import React from "react";
import Footer from "./components/Footer.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import {
  Routes,
  Route
} from "react-router-dom";

import Navbar
  from "./components/Navbar.jsx";

import Home
  from "./pages/Home.jsx";

import Explore
  from "./pages/Explore.jsx";

import Pricing
  from "./pages/Pricing.jsx";

import HowItWorks
  from "./pages/HowItWorks.jsx";

import Account
  from "./pages/Account.jsx";

import Ride
  from "./pages/Ride.jsx";

import RideComplete
  from "./pages/RideComplete.jsx";

import NotFound
  from "./pages/NotFound.jsx";

export default function App() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/explore"
            element={<Explore />}
          />

          <Route
            path="/pricing"
            element={<Pricing />}
          />

          <Route
            path="/how-it-works"
            element={<HowItWorks />}
          />

          <Route
            path="/account"
            element={<Account />}
          />

          <Route
            path="/ride"
            element={<Ride />}
          />
<Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>

<Route
  path="/reset-password"
  element={<ResetPassword />}
/>
          <Route
            path="/ride-complete"
            element={<RideComplete />}
          />

          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>
      </main>

      <Footer />
    </>
  );
}