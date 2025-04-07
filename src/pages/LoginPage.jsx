import { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { app } from "../firebaseConfig";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const LoginPage = () => {
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleEmailPasswordLogin = async () => {
    if (!email || !password) return alert("Please enter both email and password.");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in successfully!");
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google login error:", error);
      alert("Google login failed.");
    }
  };

  const handleGithubLogin = async () => {
    try {
      await signInWithPopup(auth, githubProvider);
    } catch (error) {
      console.error("GitHub login error:", error);
      alert("GitHub login failed.");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) return alert("Enter your email to reset password");
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent!");
    } catch (error) {
      console.error("Reset password error:", error);
      alert("Failed to send reset email.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black relative overflow-hidden px-4">
      <div className="absolute inset-0 border-2 border-purple-600 opacity-30 animate-spin-slow pointer-events-none" />
      <div className="bg-black border border-purple-600 text-white shadow-lg rounded-xl p-6 w-full max-w-md z-10">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2 bg-gray-700 w-full py-2 rounded-md mb-3 hover:bg-gray-600 transition"
        >
          <FcGoogle /> Login with Google
        </button>

        <button
          onClick={handleGithubLogin}
          className="flex items-center justify-center gap-2 bg-gray-700 w-full py-2 rounded-md mb-4 hover:bg-gray-600 transition"
        >
          <FaGithub /> Login with GitHub
        </button>

        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:outline-none"
          />

          <button
            onClick={handleEmailPasswordLogin}
            className="bg-purple-600 hover:bg-purple-700 transition text-white py-2 rounded-md"
          >
            Login with Email/Password
          </button>

          <button
            onClick={handleForgotPassword}
            className="text-blue-400 underline text-sm hover:text-blue-300 transition w-max"
          >
            Forgot Password?
          </button>

          <button
      onClick={() => navigate("/dashboard")} // Navigate to the dashboard on click
      className="bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-md transition"
    >
      New here? Sign Up
    </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;