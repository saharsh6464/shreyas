import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebaseConfig"; // Assuming firebaseConfig exports the Firebase app instance
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext"; // Import useAuth hook

const SignupPage = () => {
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // State for displaying errors
  const [waveData, setWaveData] = useState([]);
  // Destructure currentUser and userType from useAuth.
  // AuthContext handles setting currentUser internally via onAuthStateChanged.
  const { currentUser, userType } = useAuth();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Track window resize for responsive waves
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Redirect if user is already logged in
  useEffect(() => {
    if (currentUser) {
      // Redirect based on userType from AuthContext
      if (userType === 'company') {
        navigate("/company-dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [currentUser, userType, navigate]); // Added userType to dependency array

  // Initialize wave parameters
  useEffect(() => {
    const numberOfWaves = 5;
    const initial = Array.from({ length: numberOfWaves }, (_, i) => ({
      id: i,
      amplitude: Math.random() * 20 + 30,
      frequency: Math.random() * 0.02 + 0.01,
      phase: Math.random() * 2 * Math.PI,
      speed: Math.random() * 0.5 + 0.5,
      opacity: Math.random() * 0.3 + 0.2,
      color: `rgba(124, 58, 237, ${Math.random() * 0.4 + 0.2})`,
    }));
    setWaveData(initial);
  }, []);

  // Animate wave phases
  useEffect(() => {
    const intervalId = setInterval(() => {
      setWaveData(waves =>
        waves.map(w => ({ ...w, phase: w.phase + w.speed * 0.02 }))
      );
    }, 30);
    return () => clearInterval(intervalId);
  }, []);

  // Function to set custom claim for company user
  // This typically requires a Firebase Cloud Function or a backend API
  const setCompanyUserClaim = async (user) => {
    if (!user) return;
    try {
      // --- IMPORTANT: You MUST implement this backend call ---
      // This is where you would call your Firebase Cloud Function (or other backend API)
      // to set the custom claim 'isCompanyUser: true' for the user with 'user.uid'.
      // Example using a hypothetical Cloud Function:
      // const response = await fetch('/api/setCompanyUserClaim', { // Replace with your actual endpoint
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${await user.getIdToken()}` // Send user's ID token for authentication
      //   },
      //   body: JSON.stringify({ uid: user.uid })
      // });
      // const data = await response.json();
      // if (!response.ok) {
      //   throw new Error(data.message || 'Failed to set company claim on backend');
      // }
      // console.log("Company claim set successfully on backend:", data.message);

      // --- TEMPORARY LOCAL DEBUGGING HACK (REMOVE IN PRODUCTION) ---
      // This is ONLY for local testing to simulate the userType being set.
      // In a real app, the AuthContext's onAuthStateChanged listener would pick up
      // the actual Firebase Custom Claim after the backend sets it.
      localStorage.setItem('userTypeDebug', 'company');
      console.log("DEBUG: userTypeDebug set to 'company' in localStorage.");
      // --- END TEMPORARY HACK ---

      // After the backend sets the claim, force a token refresh so AuthContext picks it up.
      // This is crucial for the AuthContext's onAuthStateChanged listener to get the updated claims.
      await user.getIdToken(true);
      console.log("Firebase ID token refreshed to pick up new claims.");

    } catch (error) {
      console.error("Error setting company user claim:", error);
      setError("Failed to finalize company account setup. Please try again or contact support.");
    }
  };

  // Email/password signup
  const handleSignup = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError(""); // Clear previous errors
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // User created in Firebase Authentication
      const user = userCredential.user;

      // Set the custom claim for this user to be a company user
      await setCompanyUserClaim(user);

      // Navigate immediately. The AuthContext's useEffect will then confirm the userType
      // and ProtectedRoute will handle the final redirection if needed.
      navigate("/company-dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
      console.error("Email/Password Signup Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Google signup
  const handleGoogleSignup = async () => {
    setLoading(true);
    setError(""); // Clear previous errors
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      // Set the custom claim for this user to be a company user
      await setCompanyUserClaim(user);

      navigate("/company-dashboard", { replace: true });
    } catch (err) {
      setError(err.message); // Use err.message for more specific Firebase errors
      console.error("Google Signup Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // GitHub signup
  const handleGithubSignup = async () => {
    setLoading(true);
    setError(""); // Clear previous errors
    try {
      const userCredential = await signInWithPopup(auth, githubProvider);
      const user = userCredential.user;

      // Set the custom claim for this user to be a company user
      await setCompanyUserClaim(user);

      // All sign-ups on this page should lead to company dashboard
      navigate("/company-dashboard", { replace: true });
    } catch (err) {
      setError(err.message); // Use err.message for more specific Firebase errors
      console.error("GitHub Signup Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-black">
      {/* Animated Background Waves */}
      <div className="absolute inset-0 pointer-events-none">
        {waveData.map(wave => {
          // Main wave
          const y0 = 50 + wave.amplitude * Math.sin(wave.phase);
          const y1 = 50 + wave.amplitude * Math.sin(wave.frequency * (windowWidth * 0.25) + wave.phase);
          const y2 = 50 + wave.amplitude * Math.sin(wave.frequency * (windowWidth * 0.75) + wave.phase);
          const y3 = 50 + wave.amplitude * Math.sin(wave.frequency * windowWidth + wave.phase);
          // Secondary wave (offset)
          const y0b = 50 + (wave.amplitude / 1.5) * Math.sin(wave.phase + Math.PI / 4);
          const y1b = 50 + (wave.amplitude / 1.5) * Math.sin(wave.frequency * (windowWidth * 0.25) + wave.phase + Math.PI / 4);
          const y2b = 50 + (wave.amplitude / 1.5) * Math.sin(wave.frequency * (windowWidth * 0.75) + wave.phase + Math.PI / 4);
          const y3b = 50 + (wave.amplitude / 1.5) * Math.sin(wave.frequency * windowWidth + wave.phase + Math.PI / 4);

          return (
            <motion.svg
              key={wave.id}
              viewBox={`0 0 ${windowWidth} 100`}
              preserveAspectRatio="none"
              style={{ opacity: wave.opacity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
            >
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  loop: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                  delay: wave.id * 0.2,
                }}
                d={`M0,${y0} C${windowWidth * 0.25},${y1} ${windowWidth * 0.75},${y2} ${windowWidth},${y3}`}
                fill="none"
                stroke={wave.color}
                strokeWidth={2}
              />
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  loop: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                  delay: wave.id * 0.2 + 1.5,
                }}
                d={`M0,${y0b} C${windowWidth * 0.25},${y1b} ${windowWidth * 0.75},${y2b} ${windowWidth},${y3b}`}
                fill="none"
                stroke={wave.color}
                strokeWidth={1.5}
              />
            </motion.svg>
          );
        })}
      </div>

      {/* Sign Up Form */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="bg-black border border-purple-600 text-white shadow-lg rounded-xl p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-4">Company Sign Up</h2>

          <button
            onClick={handleGoogleSignup}
            className="flex items-center justify-center gap-2 bg-gray-700 w-full py-2 rounded-md mb-3 hover:bg-gray-600 transition"
            disabled={loading}
          >
            <FcGoogle /> {loading ? "Signing up..." : "Sign up with Google"}
          </button>

          <button
            onClick={handleGithubSignup}
            className="flex items-center justify-center gap-2 bg-gray-700 w-full py-2 rounded-md mb-4 hover:bg-gray-600 transition"
            disabled={loading}
          >
            <FaGithub /> {loading ? "Signing up..." : "Sign up with GitHub"}
          </button>

          <div className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:outline-none"
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:outline-none"
              disabled={loading}
            />

            {error && <p className="text-red-500 text-center text-sm mt-2">{error}</p>}

            <button
              onClick={handleSignup}
              className="bg-purple-600 hover:bg-purple-700 transition text-white py-2 rounded-md mt-2"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <button
              onClick={() => navigate("/login")}
              className="bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-md transition"
              disabled={loading}
            >
              Already have an account? Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
