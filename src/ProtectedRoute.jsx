import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Ensure this path is correct

const ProtectedRoute = ({ children, restricted = false }) => {
  // Destructure currentUser, loading, and userType from your AuthContext
  const { currentUser, loading, userType } = useAuth();
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  // 1. Handle Loading State: Show a loading indicator while authentication state is being determined.
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        Loading authentication...
      </div>
    ); // You can replace this with a proper spinner/loading component
  }

  // 2. Define and Handle Public Routes:
  // These are routes that anyone can access, regardless of authentication status.
  // We also handle redirection if an authenticated user tries to access a 'restricted' public route (like login/signup).
  const publicRoutes = [
    "/", // Front Page
    "/signup", // Normal Signup
    "/login", // Normal Login
    "/forgot-password",
    "/company-login", // Company Login
    "/company-signup", // Company Signup (specifically allowed)
    "/webcam-setup", // Webcam setup page
  ];

  if (publicRoutes.includes(path)) {
    // If it's a 'restricted' public route (like login/signup) AND the user is already logged in,
    // redirect them to their appropriate dashboard based on their userType.
    if (restricted && currentUser) {
      if (userType === 'company') {
        return <Navigate to="/company-dashboard" replace />;
      }
      return <Navigate to="/dashboard" replace />;
    }
    // For all other public routes, simply render the content.
    return children ? children : <Outlet />;
  }

  // 3. Handle Unauthenticated Users for Protected Routes:
  // If the user is NOT logged in (currentUser is null) and the current path is NOT a public route,
  // then they are trying to access a protected route without authentication.
  if (!currentUser) {
    // Determine if the attempted protected path is company-related.
    // This helps in redirecting to the correct login page.
    const isCompanyRelatedPath = path.includes("company") || path.includes("dashboard"); // 'dashboard' catches /company-dashboard

    if (isCompanyRelatedPath) {
      // If it's a company-related protected path, redirect to the company login page.
      return <Navigate to="/company-login" state={{ from: location }} replace />;
    } else {
      // Otherwise (for general protected paths), redirect to the normal login page.
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  // 4. Handle Authenticated Users based on their `userType`:
  // At this point, we know `currentUser` exists. Now, we check their `userType`
  // to enforce role-based access control.

  // If the authenticated user is a 'company' type:
  if (userType === 'company') {
    // Allow access to the company dashboard.
    if (path === "/company-dashboard"|| path === "/host-test") {
      return children ? children : <Outlet />;
    }
    // If a company user tries to access a normal user's dashboard or other normal protected pages,
    // redirect them to their company dashboard.
    const normalUserProtectedPaths = [
      "/dashboard",
      "/practice-tests",
      "/mock-exams",
      "/refer-and-rule",
      "/how-to-use",
      "/settings",
      "/solve", // Covers /solve/:id
      "/host-test",
      "/fetch-data",
      // "/webcam-capture" is already handled as a public route
    ];
    // Check if the current path starts with any of the normal user protected paths
    if (normalUserProtectedPaths.some(p => path.startsWith(p))) {
      return <Navigate to="/company-dashboard" replace />;
    }
  }

  // If the authenticated user is a 'normal' type:
  if (userType === 'normal') {
    // If a normal user tries to access the company dashboard, redirect them to their normal dashboard.
    if (path === "/company-dashboard") {
      return <Navigate to="/dashboard" replace />;
    }
    // All other protected routes (which are not company-specific) are allowed for normal users.
    return children ? children : <Outlet />;
  }

  // 5. Fallback for Unhandled Scenarios:
  // This block should ideally not be reached if the logic above is comprehensive.
  // It acts as a safety net for any edge cases not explicitly covered.
  console.warn(
    "ProtectedRoute: Unhandled authentication scenario for path:",
    path,
    "currentUser:",
    currentUser ? currentUser.email : "null",
    "userType:",
    userType
  );
  // Redirect to a safe default, e.g., the home page or a generic error page.
  return <Navigate to="/" replace />;
};

export default ProtectedRoute;
