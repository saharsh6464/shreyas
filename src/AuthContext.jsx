import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "./firebaseConfig"; // Ensure this path is correct for your Firebase app instance
import { onAuthStateChanged } from "firebase/auth";

// Create the context internally within this module.
const AuthContext = createContext();

// This is your custom hook for consuming the context.
// It ensures that useAuth is always a function and throws an error if used outside AuthProvider.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// This is your AuthProvider component. It manages the authentication state.
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Initialize userType. It will be 'normal' by default, or 'company' if custom claims indicate.
  const [userType, setUserType] = useState('normal'); // Possible values: 'normal', 'company', 'guest'

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setCurrentUser(user);

      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult(true);

          // Check for a custom claim like 'isCompanyUser'.
          if (idTokenResult.claims.isCompanyUser) {
            setUserType('company');
          } else {
            setUserType('normal');
          }
          console.log("AuthContext: User claims after auth state change:", idTokenResult.claims);

          // --- TEMPORARY DEBUGGING HACK START (REMOVE THIS BLOCK IN PRODUCTION) ---
          // This overrides the userType if localStorage.userTypeDebug is set.
          // This is ONLY for local testing to simulate the userType being set
          // when your backend claim setting isn't fully implemented yet.
          const debugUserType = localStorage.getItem('userTypeDebug');
          if (debugUserType === 'company' && user.email) { // Add email check to be slightly safer
            setUserType('company');
            console.warn("AuthContext: DEBUG HACK ACTIVE! userType forced to 'company' from localStorage.");
          }
          // --- TEMPORARY DEBUGGING HACK END ---

        } catch (error) {
          console.error("AuthContext: Error fetching custom claims:", error);
          setUserType('normal'); // Fallback to 'normal' in case of an error
        }
      } else {
        // No user is logged in
        setUserType('normal'); // Reset userType to 'normal' (or 'guest') when no user is authenticated
        // --- TEMPORARY DEBUGGING HACK START (REMOVE THIS BLOCK IN PRODUCTION) ---
        localStorage.removeItem('userTypeDebug'); // Clear debug flag on logout
        // --- TEMPORARY DEBUGGING HACK END ---
      }
      setLoading(false); // Authentication state has been determined
    });

    // Clean up the Firebase listener when the component unmounts to prevent memory leaks.
    return unsubscribe;
  }, []); // Empty dependency array means this effect runs only once on mount

  // The value provided to the context. This makes these states available to any component
  // that uses the `useAuth()` hook.
  const value = { currentUser, loading, userType };

  return (
    <AuthContext.Provider value={value}>
      {/* Only render children components once the initial authentication state has been loaded. */}
      {!loading && children}
    </AuthContext.Provider>
  );
};
