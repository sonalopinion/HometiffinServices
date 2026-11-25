"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import "./profile.css";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  if (loading) {
    return <main className="profile-page">Loading profile...</main>;
  }

  if (!user) {
    return (
      <main className="profile-page">
        <div className="profile-card">
          <h1>Profile Not Found</h1>
          <p>Please register or log in to view your profile.</p>
          <Link href="/login?next=/Profile" className="profile-button">
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">
          {user.fullName?.charAt(0).toUpperCase() || "U"}
        </div>

        <h1>My Profile</h1>
        <p className="profile-subtitle">Your HomeMade Food account details</p>

        <div className="profile-details">
          <div className="profile-row">
            <span>Full Name</span>
            <strong>{user.fullName || "Not provided"}</strong>
          </div>

          <div className="profile-row">
            <span>Email Address</span>
            <strong>{user.email || "Not provided"}</strong>
          </div>

          <div className="profile-row">
            <span>Mobile Number</span>
            <strong>{user.phone || "Not provided"}</strong>
          </div>

          <div className="profile-row">
            <span>Delivery Address</span>
            <strong>{user.address || "Not provided"}</strong>
          </div>
        </div>

        <Link href="/orders" className="profile-button">
          My Orders
        </Link>

        <Link href="/" className="profile-button">
          Back to Home
        </Link>

        <button
          type="button"
          className="profile-button"
          onClick={() => {
            logout();
            router.push("/");
          }}
        >
          Logout
        </button>
      </div>
    </main>
  );
}
