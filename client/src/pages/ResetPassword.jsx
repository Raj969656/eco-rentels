import React, { useState } from "react";

import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import api from "../api.js";

export default function ResetPassword() {
  const [searchParams] =
    useSearchParams();

  const navigate =
    useNavigate();

  const token =
    searchParams.get("token");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  async function submit(e) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!token) {
      setError(
        "This password reset link is invalid."
      );

      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    setLoading(true);

    try {
      const response =
        await api.post(
          "/auth/reset-password",
          {
            token,
            password,
          }
        );

      setMessage(
        response.data.message ||
          "Password reset successfully."
      );

      setTimeout(() => {
        navigate("/account");
      }, 1800);

    } catch (error) {
      console.error(
        "RESET PASSWORD ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">

          <div className="auth-logo-circle">
            E
          </div>

          <span>
            eco rentels
          </span>

        </div>

        <h1>
          Create new password
        </h1>

        <p className="auth-description">
          Enter a new password for
          your Eco Rentels account.
        </p>

        <form onSubmit={submit}>

          <div className="input-group">

            <label>
              New password
            </label>

            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => {
                setPassword(
                  e.target.value
                );
                setError("");
              }}
              minLength={6}
              required
              autoComplete="new-password"
            />

          </div>

          <div className="input-group">

            <label>
              Confirm password
            </label>

            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(
                  e.target.value
                );
                setError("");
              }}
              minLength={6}
              required
              autoComplete="new-password"
            />

          </div>

          {error && (
            <div className="auth-error">

              <span>!</span>

              <p>
                {error}
              </p>

            </div>
          )}

          {message && (
            <div className="auth-success">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Updating..."
              : "Reset password"}
          </button>

        </form>

        <div className="auth-back">

          <Link to="/account">
            ← Back to login
          </Link>

        </div>

      </div>

    </main>
  );
}