import React, {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import api from "../api.js";

import {
  useAuth
} from "../context/AuthContext.jsx";

import VehicleCard
  from "../components/VehicleCard.jsx";

import MapView
  from "../components/MapView.jsx";


export default function Explore() {

  const { user } = useAuth();

  const navigate = useNavigate();

  const [vehicles, setVehicles] =
    useState([]);

  const [selectedVehicle, setSelectedVehicle] =
    useState(null);

  const [type, setType] =
    useState("all");

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");


  // ============================================
  // LOAD VEHICLES
  // ============================================

  async function fetchVehicles() {

    try {

      setLoading(true);

      const response =
        await api.get(
          `/vehicles?type=${type}`
        );

      const list =
        response.data?.vehicles || [];

      setVehicles(list);

      setSelectedVehicle(
        (current) => {

          if (!list.length) {
            return null;
          }

          const updated =
            list.find(
              (v) =>
                v._id ===
                current?._id
            );

          return updated || list[0];
        }
      );

    } catch (error) {

      console.error(
        "VEHICLES ERROR:",
        error
      );

      setMessage(
        error.response?.data?.message ||
        "Unable to load vehicles."
      );

    } finally {

      setLoading(false);

    }
  }


  useEffect(() => {

    fetchVehicles();

  }, [type]);


  // ============================================
  // AUTO REFRESH
  // ============================================

  useEffect(() => {

    const interval =
      setInterval(
        fetchVehicles,
        30000
      );

    return () =>
      clearInterval(interval);

  }, [type]);


  // ============================================
  // LOGIN CHECK
  // ============================================

  function requireLogin() {

    if (user) {
      return true;
    }

    setMessage(
      "Please login before booking a vehicle."
    );

    setTimeout(() => {
      navigate("/account");
    }, 800);

    return false;
  }


  // ============================================
  // RESERVE
  // ============================================

  async function reserveVehicle(
    vehicle
  ) {

    if (!requireLogin()) {
      return;
    }

    try {

      setMessage("");

      const response =
        await api.post(
          `/vehicles/${vehicle._id}/reserve`
        );

      setMessage(
        "Vehicle reserved for 10 minutes."
      );

      setSelectedVehicle(
        response.data.vehicle
      );

      await fetchVehicles();

    } catch (error) {

      console.error(
        "RESERVE ERROR:",
        error
      );

      setMessage(
        error.response?.data?.message ||
        "Unable to reserve vehicle."
      );

    }
  }


  // ============================================
  // CANCEL
  // ============================================

  async function cancelReservation(
    vehicle
  ) {

    try {

      setMessage("");

      await api.post(
        `/vehicles/${vehicle._id}/cancel-reservation`
      );

      setMessage(
        "Reservation cancelled."
      );

      await fetchVehicles();

    } catch (error) {

      console.error(
        "CANCEL ERROR:",
        error
      );

      setMessage(
        error.response?.data?.message ||
        "Unable to cancel reservation."
      );

    }
  }


  // ============================================
  // START RIDE
  // ============================================

  async function startRide(
    vehicle
  ) {

    if (!requireLogin()) {
      return;
    }

    try {

      setMessage("");

      const response =
        await api.post(
          "/rides/start",
          {
            vehicleId:
              vehicle._id
          }
        );

      sessionStorage.setItem(
        "eco_ride",
        JSON.stringify(
          response.data.ride
        )
      );

      navigate("/ride");

    } catch (error) {

      console.error(
        "START RIDE ERROR:",
        error
      );

      setMessage(
        error.response?.data?.message ||
        "Unable to start ride."
      );
    }
  }


  return (
    <section className="explore">

      {/* HEADER */}

      <div className="explore-top">

        <div>

          <p className="eyebrow">
            ECO RENTELS
          </p>

          <h1>
            Find a ride.
          </h1>

          <p>
            Choose a vehicle near you
            and start moving.
          </p>

        </div>


        {/* FILTERS */}

        <div className="filters">

          {[
            ["all", "All"],
            ["scooter", "Scooters"],
            ["ebike", "E-Bikes"],
            ["bike", "Bikes"]
          ].map(
            ([value, label]) => (

              <button
                key={value}
                type="button"
                className={
                  type === value
                    ? "filter active"
                    : "filter"
                }
                onClick={() =>
                  setType(value)
                }
              >
                {label}
              </button>

            )
          )}

        </div>

      </div>


      {/* MESSAGE */}

      {message && (
        <div className="notice">
          {message}
        </div>
      )}


      {/* CONTENT */}

      <div className="explore-layout">

        {/* VEHICLES */}

        <div className="vehicle-list">

          {loading ? (

            <div className="empty">
              Loading vehicles...
            </div>

          ) : vehicles.length === 0 ? (

            <div className="empty">

              <h3>
                No vehicles found
              </h3>

              <p>
                Try another category.
              </p>

            </div>

          ) : (

            vehicles.map(
              (vehicle) => (

                <VehicleCard
                  key={
                    vehicle._id
                  }

                  vehicle={
                    vehicle
                  }

                  selected={
                    selectedVehicle?._id ===
                    vehicle._id
                  }

                  onSelect={
                    setSelectedVehicle
                  }

                  onReserve={
                    reserveVehicle
                  }

                  onStart={
                    startRide
                  }

                  onCancelReservation={
                    cancelReservation
                  }
                />

              )
            )

          )}

        </div>


        {/* MAP */}

        <MapView
          vehicles={
            vehicles
          }

          selectedVehicle={
            selectedVehicle
          }

          onSelect={
            setSelectedVehicle
          }
        />

      </div>

    </section>
  );
}