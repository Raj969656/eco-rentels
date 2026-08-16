import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">

      {/* TOP FOOTER */}
      <div className="footer-main">

        {/* BRAND */}
        <div className="footer-brand">

          <Link to="/" className="footer-logo">
            <span className="footer-logo-mark">
              E
            </span>

            <span>
              eco rentels
            </span>
          </Link>

          <p>
            Move freely. Ride greener.
            <br />
            Simple, affordable urban mobility.
          </p>

          <Link
            to="/explore"
            className="footer-ride-btn"
          >
            Find a ride →
          </Link>

        </div>


        {/* COMPANY */}
        <div className="footer-column">

          <h3>
            Company
          </h3>

          <Link to="/">
            Home
          </Link>

          <Link to="/explore">
            Explore
          </Link>

          <Link to="/pricing">
            Pricing
          </Link>

          <Link to="/how-it-works">
            How it works
          </Link>

        </div>


        {/* RIDES */}
        <div className="footer-column">

          <h3>
            Rides
          </h3>

          <Link to="/explore">
            Scooters
          </Link>

          <Link to="/explore">
            E-Bikes
          </Link>

          <Link to="/explore">
            Bikes
          </Link>

          <Link to="/account">
            My account
          </Link>

        </div>


        {/* SUPPORT */}
        <div className="footer-column">

          <h3>
            Support
          </h3>

          <a href="mailto:support@ecorentels.com">
            Contact us
          </a>

          <a href="mailto:support@ecorentels.com">
            Help center
          </a>

          <Link to="/how-it-works">
            Safety
          </Link>

          <Link to="/pricing">
            Pricing
          </Link>

        </div>


        {/* SOCIAL */}
        <div className="footer-column">

          <h3>
            Follow us
          </h3>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
          >
            Instagram ↗
          </a>

          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn ↗
          </a>

          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
          >
            X ↗
          </a>

        </div>

      </div>


      {/* NEWSLETTER */}
      <div className="footer-newsletter">

        <div>

          <p className="footer-eyebrow">
            STAY IN THE LOOP
          </p>

          <h2>
            Get updates from
            Eco Rentels.
          </h2>

        </div>

        <form
          className="footer-form"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Thanks for subscribing!");
          }}
        >

          <input
            type="email"
            placeholder="Your email address"
            required
          />

          <button type="submit">
            Subscribe
          </button>

        </form>

      </div>


      {/* BOTTOM */}
      <div className="footer-bottom">

        <span>
          © {new Date().getFullYear()} Eco Rentels.
          All rights reserved.
        </span>

        <div className="footer-legal">

          <a href="#">
            Privacy
          </a>

          <a href="#">
            Terms
          </a>

          <a href="#">
            Cookies
          </a>

        </div>

        <span className="footer-made">
          Built for better cities.
        </span>

      </div>

    </footer>
  );
}