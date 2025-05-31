import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  // sendPasswordResetEmail, // Not directly used here, so can be removed if not needed
} from "firebase/auth";
// import { ref, set } from "firebase/database"; // Not used in this component's logic
import { auth, database } from "../firebaseConfig"; // Assuming 'auth' is exported from firebaseConfig
import { useAuth } from '../AuthContext'; // Correct path to your AuthContext

const CompanyLoginPage = () => {
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for displaying errors
  const [loading, setLoading] = useState(false); // State for loading indicator

  const [waveData, setWaveData] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Destructure currentUser and userType from useAuth.
  const { currentUser, userType } = useAuth();

  // Determine where to redirect after successful login if there's no specific 'from' state.
  // The useEffect below will handle the actual redirection logic.
  const from = location.state?.from?.pathname;

  // Track window resize for wave animation
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    const id = setInterval(() => {
      setWaveData(waves =>
        waves.map(w => ({ ...w, phase: w.phase + w.speed * 0.02 }))
      );
    }, 30);
    return () => clearInterval(id);
  }, []);

  // Redirect if user is already logged in (based on AuthContext's state)
  // This useEffect runs when currentUser or userType changes.
  useEffect(() => {
    if (currentUser) {
      // Prioritize 'from' path if it exists and is company-related
      if (from && from.includes("company")) {
        navigate(from, { replace: true });
      } else if (userType === 'company') {
        // If user is identified as 'company' type by AuthContext, go to company dashboard
        navigate("/company-dashboard", { replace: true });
      } else {
        // Otherwise (e.g., a normal user somehow lands here and is logged in), go to normal dashboard
        navigate("/dashboard", { replace: true });
      }
    }
  }, [currentUser, navigate, from, userType]); // Added userType to dependencies for reactivity

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

      // --- TEMPORARY LOCAL DEBUGGING HACK START (REMOVE IN PRODUCTION) ---
      // This is ONLY for local testing to simulate the userType being set.
      // In a real app, the AuthContext's onAuthStateChanged listener would pick up
      // the actual Firebase Custom Claim after the backend sets it.
      localStorage.setItem('userTypeDebug', 'company');
      console.log("DEBUG: userTypeDebug set to 'company' in localStorage.");
      // --- TEMPORARY LOCAL DEBUGGING HACK END ---

      // After the backend sets the claim, force a token refresh so AuthContext picks it up.
      // This is crucial for the AuthContext's onAuthStateChanged listener to get the updated claims.
      await user.getIdToken(true);
      console.log("Firebase ID token refreshed to pick up new claims.");

    } catch (error) {
      console.error("Error setting company user claim:", error);
      setError("Failed to finalize company account setup. Please try again or contact support.");
    }
  };

  // Handlers for login methods
  const handleEmailPasswordLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    setError(""); // Clear previous errors
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // After successful login, set the custom claim for this user to be a company user.
      // This is crucial for AuthContext and ProtectedRoute to identify them correctly.
      await setCompanyUserClaim(user);

      // Navigate to the company dashboard. AuthContext's onAuthStateChanged will update userType.
      // The useEffect above will then handle the final redirection based on the updated userType.
      navigate("/company-dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(""); // Clear previous errors
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      await setCompanyUserClaim(user);
      navigate("/company-dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.message || "Google login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setLoading(true);
    setError(""); // Clear previous errors
    try {
      const userCredential = await signInWithPopup(auth, githubProvider);
      const user = userCredential.user;

      await setCompanyUserClaim(user);
      navigate("/company-dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.message || "GitHub login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-black">
      {/* Animated Background Waves */}
      <div className="absolute inset-0 pointer-events-none">
        {waveData.map(wave => {
          const y0 = 50 + wave.amplitude * Math.sin(wave.phase);
          const y1 = 50 + wave.amplitude * Math.sin(wave.frequency * (windowWidth * 0.25) + wave.phase);
          const y2 = 50 + wave.amplitude * Math.sin(wave.frequency * (windowWidth * 0.75) + wave.phase);
          const y3 = 50 + wave.amplitude * Math.sin(wave.frequency * windowWidth + wave.phase);

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

      {/* Login Form */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="bg-black border border-purple-600 text-white shadow-lg rounded-xl p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-4">Company Login</h2>

          {error && (
            <p className="text-red-500 text-center text-sm mb-4">{error}</p>
          )}

          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 bg-gray-700 w-full py-2 rounded-md mb-3 hover:bg-gray-600 transition"
            disabled={loading}
          >
            <FcGoogle /> {loading ? "Logging in..." : "Login with Google"}
          </button>

          <button
            onClick={handleGithubLogin}
            className="flex items-center justify-center gap-2 bg-gray-700 w-full py-2 rounded-md mb-4 hover:bg-gray-600 transition"
            disabled={loading}
          >
            <FaGithub /> {loading ? "Logging in..." : "Login with GitHub"}
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
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:outline-none"
              disabled={loading}
            />

            <button
              onClick={handleEmailPasswordLogin}
              className="bg-purple-600 hover:bg-purple-700 transition text-white py-2 rounded-md"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login with Email/Password"}
            </button>

            <button
              onClick={handleForgotPassword}
              className="text-blue-400 underline text-sm hover:text-blue-300 transition w-max"
              disabled={loading}
            >
              Forgot Password?
            </button>

            <button
              onClick={() => navigate("/company-signup")}
              className="bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-md transition"
              disabled={loading}
            >
              New here? Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyLoginPage;
