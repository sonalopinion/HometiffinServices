
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import "./register.css";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  function validateField(name, value, data = formData) {
    const val = value.trim();

    switch (name) {
      case "fullName":
        if (!val) return "Full name is required.";
        if (val.length < 3)
          return "Full name must contain at least 3 characters.";
        if (!/^[a-zA-Z\s.'-]+$/.test(val))
          return "Enter a valid name using letters only.";
        return "";

      case "email":
        if (!val) return "Email address is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
          return "Enter a valid email address.";
        return "";

      case "phone":
        if (!val) return "Mobile number is required.";
        if (!/^[6-9]\d{9}$/.test(val))
          return "Enter a valid 10-digit Indian mobile number.";
        return "";

      case "address":
        if (!val) return "Delivery address is required.";
        if (val.length < 10)
          return "Address must contain at least 10 characters.";
        return "";

      case "password":
        if (!value) return "Password is required.";
        if (value.length < 8)
          return "Password must contain at least 8 characters.";
        if (!/[A-Z]/.test(value))
          return "Include at least one uppercase letter.";
        if (!/[a-z]/.test(value))
          return "Include at least one lowercase letter.";
        if (!/\d/.test(value))
          return "Include at least one number.";
        if (!/[^A-Za-z0-9]/.test(value))
          return "Include at least one special character.";
        return "";

      case "confirmPassword":
        if (!value) return "Please confirm your password.";
        if (value !== data.password)
          return "Passwords do not match.";
        return "";

      default:
        return "";
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    const updatedData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedData);
    setMessage("");
    setIsSuccess(false);

    // Show validation errors after a field has an error.
    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: validateField(name, value, updatedData),
      }));
    }

    // Revalidate confirm password when password changes.
    if (name === "password" && updatedData.confirmPassword) {
      setErrors((previous) => ({
        ...previous,
        password: validateField("password", value, updatedData),
        confirmPassword: validateField(
          "confirmPassword",
          updatedData.confirmPassword,
          updatedData
        ),
      }));
    }
  }

  function handleBlur(e) {
    const { name, value } = e.target;

    setErrors((previous) => ({
      ...previous,
      [name]: validateField(name, value),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};

    Object.keys(formData).forEach((name) => {
      const error = validateField(name, formData[name], formData);

      if (error) {
        newErrors[name] = error;
      }
    });

    setErrors(newErrors);
    setMessage("");
    setIsSuccess(false);

    if (Object.values(newErrors).some(Boolean)) {
      setMessage("Please correct the errors below.");
      return;
    }

    setSubmitting(true);
    try {
      await register(formData);
      setIsSuccess(true);
      setMessage("Account created! Redirecting...");

      const next = new URLSearchParams(window.location.search).get("next");
      router.push(next && next.startsWith("/") && !next.startsWith("//") ? next : "/");
    } catch (err) {
      // Show server-side field errors (e.g. "An account with this email already exists.")
      setErrors((previous) => ({ ...previous, ...err.fieldErrors }));
      setMessage(
        Object.keys(err.fieldErrors || {}).length
          ? "Please correct the errors below."
          : err.message
      );
      setSubmitting(false);
    }
  }

  return (
    <main className="register-page">
      <div className="register-card">
        <Link href="/" className="register-brand">
          <span className="register-brand-icon">🍲</span>
          HomeMade Food
        </Link>

        <div className="register-heading">
          <h1>Create Account</h1>
          <p>
            Join HomeMade Food and enjoy fresh, delicious homemade meals.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="register-form" noValidate>
          <div className="register-field">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="name"
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
            />
            {errors.fullName && (
              <p id="fullName-error" className="field-error">
                {errors.fullName}
              </p>
            )}
          </div>

          <div className="register-field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="field-error">
                {errors.email}
              </p>
            )}
          </div>

          <div className="register-field">
            <label htmlFor="phone">Mobile Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="Enter 10-digit mobile number"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="tel"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />
            {errors.phone && (
              <p id="phone-error" className="field-error">
                {errors.phone}
              </p>
            )}
          </div>

          <div className="register-field">
            <label htmlFor="address">Delivery Address</label>
            <textarea
              id="address"
              name="address"
              placeholder="House/Flat No., Street, Area, City, State, PIN Code"
              value={formData.address}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="street-address"
              rows={3}
              aria-invalid={Boolean(errors.address)}
              aria-describedby={errors.address ? "address-error" : undefined}
            />
            {errors.address && (
              <p id="address-error" className="field-error">
                {errors.address}
              </p>
            )}
          </div>

          <div className="register-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            <small className="field-hint">
              At least 8 characters, uppercase, lowercase, number and symbol.
            </small>
            {errors.password && (
              <p id="password-error" className="field-error">
                {errors.password}
              </p>
            )}
          </div>

          <div className="register-field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="new-password"
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={
                errors.confirmPassword ? "confirmPassword-error" : undefined
              }
            />
            {errors.confirmPassword && (
              <p id="confirmPassword-error" className="field-error">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {message && (
            <p
              className={`register-message ${isSuccess ? "success" : ""}`}
              role="status"
            >
              {message}
            </p>
          )}

          <button type="submit" className="register-button" disabled={submitting}>
            {submitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="register-login-text">
          Already have an account? <Link href="/login">Login</Link>
        </p>

        <Link href="/" className="register-back-home">
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
