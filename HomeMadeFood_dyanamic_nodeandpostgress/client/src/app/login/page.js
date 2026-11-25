"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import "./login.css";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter.";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear the field error while typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setMessage("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      await login(formData.email.trim(), formData.password);

      // Go back to where the user came from (e.g. /login?next=/Cart).
      const next = new URLSearchParams(window.location.search).get("next");
      router.push(next && next.startsWith("/") && !next.startsWith("//") ? next : "/");
    } catch (err) {
      setMessage(err.message);
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-container">
        <Link href="/" className="login-logo">
          🍱 HomeMade Food
        </Link>

        <div className="login-card">
          <div className="login-icon">🍲</div>

          <h1>Welcome Back!</h1>

          <p className="login-subtitle">
            Login to enjoy fresh, homemade food.
          </p>

          <form onSubmit={handleLogin} noValidate>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>

              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={errors.email ? "input-error" : ""}
              />

              {errors.email && (
                <p id="email-error" className="error-message" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>

              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  className={errors.password ? "input-error" : ""}
                />

                <button
                  type="button"
                  className="show-password"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              {errors.password && (
                <p
                  id="password-error"
                  className="error-message"
                  role="alert"
                >
                  {errors.password}
                </p>
              )}
            </div>

            <div className="login-options">
              <label className="remember-me">
                <input type="checkbox" name="rememberMe" />
                Remember me
              </label>

              <Link href="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="login-button" disabled={submitting}>
              {submitting ? "Logging in..." : "Login"}
            </button>

            {message && (
              <p className="error-message" role="alert">
                {message}
              </p>
            )}
          </form>

          <div className="login-divider">
            <span>OR</span>
          </div>

          <p className="signup-text">
            Don&apos;t have an account?{" "}
            <Link href="/register">Create Account</Link>
          </p>

          <Link href="/" className="back-home">
            ← Back to Home
          </Link>
        </div>

        <p className="login-footer">
          ❤️ Freshly prepared with love, just for you!
        </p>
      </div>
    </main>
  );
}