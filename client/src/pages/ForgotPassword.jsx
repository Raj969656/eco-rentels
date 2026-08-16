import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ShieldCheck, ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import api from "../api.js";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await api.post(
        "/auth/forgot-password",
        {
          email: email.trim(),
        }
      );

      setMessage(
        response.data.message ||
          "If an account exists with this email, a reset link has been sent."
      );
    } catch (error) {
      console.error("FORGOT PASSWORD ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Unable to process your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="forgot-page">

      {/* Background decoration */}
      <div className="forgot-glow glow-one"></div>
      <div className="forgot-glow glow-two"></div>

      <section className="forgot-container">

        {/* LEFT CONTENT */}
        <div className="forgot-content">

          <div className="forgot-badge">
            <ShieldCheck size={17} />
            <span>Secure account recovery</span>
          </div>

          <h1>
            Forgot your
            <span> password?</span>
          </h1>

          <p className="forgot-description">
            No worries. Enter the email address
            connected to your Eco Rentels account
            and we'll send you a secure reset link.
          </p>

          {/* FORM CARD */}
          <div className="forgot-form-card">

            <form onSubmit={submit}>

              <div className="forgot-label-row">
                <label htmlFor="forgot-email">
                  Email address
                </label>
              </div>

              <div className="forgot-input-wrapper">

                <Mail size={20} />

                <input
                  id="forgot-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                    setMessage("");
                  }}
                  required
                  autoComplete="email"
                />

              </div>

              {/* SUCCESS */}
              {message && (
                <div className="forgot-message success">

                  <CheckCircle2 size={20} />

                  <p>
                    {message}
                  </p>

                </div>
              )}

              {/* ERROR */}
              {error && (
                <div className="forgot-message error">

                  <span>!</span>

                  <p>
                    {error}
                  </p>

                </div>
              )}

              <button
                type="submit"
                className="forgot-submit"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className="forgot-spinner"></span>
                    Sending reset link...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send reset link
                  </>
                )}

              </button>

            </form>

            <div className="forgot-back">

              <Link to="/account">
                <ArrowLeft size={18} />
                Back to login
              </Link>

            </div>

          </div>

          {/* SECURITY NOTE */}
          <div className="forgot-security">

            <div className="security-icon">
              <ShieldCheck size={22} />
            </div>

            <div>
              <strong>
                Your security matters
              </strong>

              <p>
                Your password reset request is
                protected and the link expires
                after 15 minutes.
              </p>
            </div>

          </div>

        </div>


        {/* RIGHT VISUAL */}
        <div className="forgot-visual">

          <div className="visual-circle"></div>

          <div className="floating-dot dot-one"></div>
          <div className="floating-dot dot-two"></div>
          <div className="floating-dot dot-three"></div>

          <div className="mail-illustration">

            <div className="mail-top"></div>

            <div className="mail-body">

              <div className="lock">

                <div className="lock-shackle"></div>

                <div className="lock-body">
                  <span></span>
                </div>

              </div>

            </div>

          </div>

          <div className="visual-text">

            <span>
              SAFE & SECURE
            </span>

            <h3>
              Get back to
              your ride.
            </h3>

            <p>
              We'll help you regain access
              to your Eco Rentels account.
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}