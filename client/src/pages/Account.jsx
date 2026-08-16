import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Link
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext.jsx";

import api from "../api.js";

import AuthForm
  from "../components/AuthForm.jsx";

export default function Account() {
  const {
    user,
    loading: authLoading,
    logout
  } = useAuth();

  const [rides, setRides] = useState([]);
  const [loadingRides, setLoadingRides] = useState(false);
  const [activeRide, setActiveRide] = useState(null);

  useEffect(() => {
    if (!user) {
      setRides([]);
      setActiveRide(null);
      return;
    }

    loadAccountData();
  }, [user]);

  async function loadAccountData() {
    try {
      setLoadingRides(true);

      const [ridesResponse, activeResponse] =
        await Promise.all([
          api.get("/rides/my"),
          api.get("/rides/active")
        ]);

      setRides(
        ridesResponse.data?.rides || []
      );

      setActiveRide(
        activeResponse.data?.ride || null
      );
    } catch (error) {
      console.error(
        "ACCOUNT DATA ERROR:",
        error
      );
    } finally {
      setLoadingRides(false);
    }
  }

  const completedRides = useMemo(
    () =>
      rides.filter(
        (ride) =>
          ride.status === "completed"
      ),
    [rides]
  );

  const totalSpent = useMemo(
    () =>
      completedRides.reduce(
        (total, ride) =>
          total +
          Number(ride.total || 0),
        0
      ),
    [completedRides]
  );

  const totalMinutes = useMemo(
    () =>
      completedRides.reduce(
        (total, ride) =>
          total +
          Number(
            ride.durationMinutes || 0
          ),
        0
      ),
    [completedRides]
  );

  if (authLoading) {
    return (
      <section className="account-loading">
        <div className="account-spinner"></div>
        <p>Loading your account...</p>
      </section>
    );
  }

  if (!user) {
    return <LoggedOutAccount />;
  }

  return (
    <section className="account-dashboard">

      {/* =================================================
          PROFILE HEADER
      ================================================= */}

      <div className="account-hero">

        <div className="account-profile">

          <div className="profile-avatar">
            {user.name
              ?.charAt(0)
              ?.toUpperCase() || "U"}
          </div>

          <div className="profile-info">

            <p className="account-label">
              ECO MEMBER
            </p>

            <h1>
              {user.name || "Eco Rider"}
            </h1>

            <p>
              {user.email}
            </p>

          </div>

        </div>

        <button
          type="button"
          className="logout-button"
          onClick={logout}
        >
          Log out
        </button>

      </div>


      {/* =================================================
          ACTIVE RIDE
      ================================================= */}

      {activeRide && (
        <div className="active-ride-card">

          <div className="active-ride-left">

            <div className="active-ride-icon">
              {activeRide.vehicle?.type ===
              "ebike"
                ? "🚲"
                : activeRide.vehicle?.type ===
                  "bike"
                ? "🚴"
                : "🛴"}
            </div>

            <div>

              <div className="active-badge">
                <span></span>
                Ride in progress
              </div>

              <h2>
                {activeRide.vehicle?.name ||
                  "Eco Vehicle"}
              </h2>

              <p>
                {activeRide.vehicle?.code}
              </p>

            </div>

          </div>

          <Link
            to="/ride"
            className="dark-btn"
          >
            Continue ride
          </Link>

        </div>
      )}


      {/* =================================================
          STATS
      ================================================= */}

      <div className="account-stat-grid">

        <div className="account-stat-card">

          <span className="stat-icon">
            🛴
          </span>

          <div>
            <p>Total rides</p>

            <strong>
              {completedRides.length}
            </strong>
          </div>

        </div>


        <div className="account-stat-card">

          <span className="stat-icon">
            ₹
          </span>

          <div>
            <p>Total spent</p>

            <strong>
              ₹{totalSpent.toFixed(0)}
            </strong>
          </div>

        </div>


        <div className="account-stat-card">

          <span className="stat-icon">
            ⏱
          </span>

          <div>
            <p>Ride time</p>

            <strong>
              {totalMinutes}
              <small> min</small>
            </strong>
          </div>

        </div>


        <div className="account-stat-card">

          <span className="stat-icon">
            ✓
          </span>

          <div>
            <p>Member status</p>

            <strong className="member-status">
              Active
            </strong>
          </div>

        </div>

      </div>


      {/* =================================================
          QUICK ACTIONS
      ================================================= */}

      <div className="account-section">

        <div className="section-title-row">

          <div>
            <p className="account-label">
              QUICK ACTIONS
            </p>

            <h2>
              What would you like to do?
            </h2>
          </div>

        </div>


        <div className="quick-action-grid">

          <Link
            to="/explore"
            className="quick-action-card primary"
          >

            <div className="quick-action-icon">
              📍
            </div>

            <div>

              <h3>
                Find a ride
              </h3>

              <p>
                Find nearby scooters,
                bikes and e-bikes.
              </p>

            </div>

            <span className="arrow">
              →
            </span>

          </Link>


          <Link
            to="/pricing"
            className="quick-action-card"
          >

            <div className="quick-action-icon">
              ₹
            </div>

            <div>

              <h3>
                View pricing
              </h3>

              <p>
                Check vehicle rates
                and unlock fees.
              </p>

            </div>

            <span className="arrow">
              →
            </span>

          </Link>


          <Link
            to="/how-it-works"
            className="quick-action-card"
          >

            <div className="quick-action-icon">
              ?
            </div>

            <div>

              <h3>
                How it works
              </h3>

              <p>
                Learn how to reserve
                and ride.
              </p>

            </div>

            <span className="arrow">
              →
            </span>

          </Link>

        </div>

      </div>


      {/* =================================================
          RIDE HISTORY
      ================================================= */}

      <div className="account-section">

        <div className="section-title-row">

          <div>

            <p className="account-label">
              ACTIVITY
            </p>

            <h2>
              Your ride history
            </h2>

          </div>

          {rides.length > 0 && (
            <span className="ride-count">
              {rides.length} rides
            </span>
          )}

        </div>


        {loadingRides ? (

          <div className="account-empty">
            <div className="account-spinner"></div>
            <p>
              Loading your rides...
            </p>
          </div>

        ) : rides.length === 0 ? (

          <div className="account-empty">

            <div className="empty-ride-icon">
              🛴
            </div>

            <h3>
              No rides yet
            </h3>

            <p>
              Your completed rides will
              appear here.
            </p>

            <Link
              to="/explore"
              className="dark-btn"
            >
              Find your first ride
            </Link>

          </div>

        ) : (

          <div className="ride-history-list">

            {rides.map((ride) => (

              <RideHistoryItem
                key={ride._id}
                ride={ride}
              />

            ))}

          </div>

        )}

      </div>


      {/* =================================================
          ACCOUNT FOOTER
      ================================================= */}

      <div className="account-footer">

        <div>

          <strong>
            Eco Rentels
          </strong>

          <span>
            Move freely. Ride greener.
          </span>

        </div>

        <span>
          Member since{" "}
          {user.createdAt
            ? new Date(
                user.createdAt
              ).getFullYear()
            : new Date().getFullYear()}
        </span>

      </div>

    </section>
  );
}


/* =====================================================
   RIDE HISTORY ITEM
===================================================== */

function RideHistoryItem({ ride }) {

  const vehicleType =
    ride.vehicle?.type;

  const icon =
    vehicleType === "ebike"
      ? "🚲"
      : vehicleType === "bike"
      ? "🚴"
      : "🛴";

  const date = ride.createdAt
    ? new Date(
        ride.createdAt
      )
    : null;

  return (
    <div className="ride-history-item">

      <div className="history-vehicle">

        <div className="history-icon">
          {icon}
        </div>

        <div>

          <h3>
            {ride.vehicle?.name ||
              "Eco Vehicle"}
          </h3>

          <p>
            {ride.vehicle?.code ||
              "Vehicle"}
          </p>

        </div>

      </div>


      <div className="history-date">

        <span>
          {date
            ? date.toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                }
              )
            : "—"}
        </span>

        <small>
          {date
            ? date.toLocaleTimeString(
                "en-IN",
                {
                  hour: "2-digit",
                  minute: "2-digit"
                }
              )
            : ""}
        </small>

      </div>


      <div className="history-duration">

        <span>
          Duration
        </span>

        <strong>
          {ride.durationMinutes || 0}
          {" "}min
        </strong>

      </div>


      <div className="history-fare">

        <span>
          Fare
        </span>

        <strong>
          ₹{Number(
            ride.total || 0
          ).toFixed(2)}
        </strong>

      </div>


      <div className="completed-badge">
        ✓ Completed
      </div>

    </div>
  );
}


/* =====================================================
   LOGGED OUT ACCOUNT
===================================================== */

function LoggedOutAccount() {

  const [mode, setMode] =
    useState("login");

  return (
    <section className="auth-page">

      <div className="auth-showcase">

        <div className="auth-showcase-content">

          <p className="account-label">
            ECO RENTELS
          </p>

          <h1>
            Your city.
            <br />
            Your ride.
          </h1>

          <p>
            Log in to reserve vehicles,
            start rides and keep track
            of every journey.
          </p>

          <div className="auth-benefits">

            <div>
              <span>✓</span>
              Find nearby vehicles
            </div>

            <div>
              <span>✓</span>
              Reserve for 10 minutes
            </div>

            <div>
              <span>✓</span>
              Track your ride history
            </div>

          </div>

        </div>

        <div className="auth-decoration">

          <div className="auth-circle"></div>

          <div className="auth-scooter">
            🛴
          </div>

        </div>

      </div>


      <div className="auth-panel">

        <div className="auth-panel-header">

          <h2>
            {mode === "login"
              ? "Welcome back"
              : "Create your account"}
          </h2>

          <p>
            {mode === "login"
              ? "Log in to continue riding."
              : "Join Eco Rentels today."}
          </p>

        </div>


        <AuthForm
          mode={mode}
          onModeChange={setMode}
        />

      </div>

    </section>
  );
}