import React, { useState } from "react";

import {
  Link,
  NavLink,
  useNavigate
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/");
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  const navClass = ({ isActive }) => (isActive ? "active" : "");

  return (
    <header className="navbar">
      <Link to="/" className="brand" onClick={closeMenu}>
        <span className="brand-mark">E</span>
        <span>eco rentels</span>
      </Link>

      <nav className="desktop-nav">
        <NavLink to="/" end className={navClass}>Home</NavLink>
        <NavLink to="/explore" className={navClass}>Explore</NavLink>
        <NavLink to="/pricing" className={navClass}>Pricing</NavLink>
        <NavLink to="/how-it-works" className={navClass}>How it works</NavLink>
      </nav>

      <div className="nav-actions desktop-nav-actions">
        {user ? (
          <>
            <Link to="/account" className="text-link">
              Hi, {user.name?.split(" ")[0] || "User"}
            </Link>
            <button type="button" className="outline-btn" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <Link to="/account" className="dark-btn">Log in</Link>
        )}
      </div>

      <button
        type="button"
        className={`mobile-menu-button ${menuOpen ? "open" : ""}`}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((value) => !value)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <nav className="mobile-nav-links">
          <NavLink to="/" end className={navClass} onClick={closeMenu}>Home</NavLink>
          <NavLink to="/explore" className={navClass} onClick={closeMenu}>Explore</NavLink>
          <NavLink to="/pricing" className={navClass} onClick={closeMenu}>Pricing</NavLink>
          <NavLink to="/how-it-works" className={navClass} onClick={closeMenu}>How it works</NavLink>
        </nav>

        <div className="mobile-menu-actions">
          {user ? (
            <>
              <Link to="/account" className="mobile-account-link" onClick={closeMenu}>
                Hi, {user.name?.split(" ")[0] || "User"}
              </Link>
              <button type="button" className="outline-btn" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <Link to="/account" className="dark-btn" onClick={closeMenu}>
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
