import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import { useAuthStore } from "./stores/useAuthStore";
import { Toaster } from "react-hot-toast";
import { LoaderCircle } from "lucide-react";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VerifyOTPPage from "./pages/VerifyOTPPage";
import ProductManagement from "./pages/ProductManagement";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmation from "./pages/OrderConfirmation";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";

// Protected Route Component for Admin
const AdminRoute = ({ children }) => {
  const { authUser } = useAuthStore();

  // Check if user is authenticated and is admin
  const isAdmin = authUser && authUser.role === "admin";

  if (!isAdmin) {
    // Redirect to login if not authenticated, or home if not admin
    return <Navigate to="/" />;
  }

  return children;
};

// Protected Route Component for Authenticated Users
const ProtectedRoute = ({ children }) => {
  const { authUser } = useAuthStore();

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Component (redirect to home if already authenticated)
const PublicRoute = ({ children }) => {
  const { authUser } = useAuthStore();

  if (authUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderCircle className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/verify-email"
          element={
            <PublicRoute>
              <VerifyEmailPage />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />
        <Route
          path="/verify-otp"
          element={
            <PublicRoute>
              <VerifyOTPPage />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPasswordPage />
            </PublicRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<ProductManagement />} />
        <Route
          path="/admin-order"
          element={
            <AdminRoute>
              <AdminOrdersPage />
            </AdminRoute>
          }
        />

        {/* Protected User Routes */}
        <Route path="/" element={<HomePage />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-confirmation"
          element={
            <ProtectedRoute>
              <OrderConfirmation />
            </ProtectedRoute>
          }
        />

        {/* Public Product Routes */}
        <Route path="/product/:productId" element={<ProductDetailsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
