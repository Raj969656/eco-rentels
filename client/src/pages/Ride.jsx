import React, {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import api from "../api.js";


export default function Ride() {

  const navigate =
    useNavigate();


  const [ride, setRide] =
    useState(null);

  const [elapsedSeconds, setElapsedSeconds] =
    useState(0);

  const [ending, setEnding] =
    useState(false);

  const [error, setError] =
    useState("");


  // ===================================================
  // LOAD ACTIVE RIDE
  // ===================================================

  useEffect(() => {

    const savedRide =
      sessionStorage.getItem(
        "eco_ride"
      );


    if (!savedRide) {

      navigate(
        "/explore"
      );

      return;

    }


    try {

      const parsedRide =
        JSON.parse(
          savedRide
        );

      setRide(
        parsedRide
      );

    } catch (error) {

      console.error(
        error
      );

      sessionStorage.removeItem(
        "eco_ride"
      );

      navigate(
        "/explore"
      );

    }

  }, [
    navigate
  ]);


  // ===================================================
  // TIMER
  // ===================================================

  useEffect(() => {

    if (!ride) {
      return;
    }


    const startTime =
      new Date(
        ride.startedAt
      ).getTime();


    function updateTimer() {

      const now =
        Date.now();


      const seconds =
        Math.max(
          0,

          Math.floor(
            (
              now -
              startTime
            ) / 1000
          )
        );


      setElapsedSeconds(
        seconds
      );

    }


    updateTimer();


    const timer =
      setInterval(
        updateTimer,
        1000
      );


    return () => {

      clearInterval(
        timer
      );

    };

  }, [
    ride
  ]);


  // ===================================================
  // END RIDE
  // ===================================================

  async function endRide() {

    if (
      !ride ||
      ending
    ) {

      return;

    }


    const confirmed =
      window.confirm(
        "Are you sure you want to end this ride?"
      );


    if (!confirmed) {
      return;
    }


    try {

      setEnding(
        true
      );

      setError("");


      const response =
        await api.post(
          `/rides/${ride._id}/end`
        );


      sessionStorage.removeItem(
        "eco_ride"
      );


      navigate(
        "/ride-complete",
        {
          state: {
            ride:
              response.data.ride
          }
        }
      );

    } catch (error) {

      console.error(
        "End ride error:",
        error
      );


      setError(
        error.response?.data?.message ||
        "Unable to end your ride."
      );


      setEnding(
        false
      );

    }

  }


  // ===================================================
  // LOADING
  // ===================================================

  if (!ride) {

    return (

      <section className="ride-page">

        <div className="ride-active">

          <p>
            Loading ride...
          </p>

        </div>

      </section>

    );

  }


  // ===================================================
  // TIMER DISPLAY
  // ===================================================

  const minutes =
    Math.floor(
      elapsedSeconds / 60
    );


  const seconds =
    String(
      elapsedSeconds % 60
    ).padStart(
      2,
      "0"
    );


  // ===================================================
  // FARE
  // ===================================================

  const estimatedMinutes =
    Math.max(
      1,
      Math.ceil(
        elapsedSeconds / 60
      )
    );


  const estimatedFare =
    ride.unlockFee +
    estimatedMinutes *
      ride.perMinute;


  // ===================================================
  // UI
  // ===================================================

  return (

    <section className="ride-page">

      <div className="ride-active">


        <div className="ride-status">

          <span className="live-dot"></span>

          Ride in progress

        </div>


        <div className="ride-icon">

          {ride.vehicle?.type ===
            "ebike"

            ? "🚲"

            : ride.vehicle?.type ===
              "bike"

            ? "🚴"

            : "🛴"}

        </div>


        <p className="eyebrow">
          ACTIVE RIDE
        </p>


        <h1>

          {ride.vehicle?.name ||
            "Eco Vehicle"}

        </h1>


        <p className="ride-code">

          {ride.vehicle?.code}

        </p>


        <div className="timer">

          {minutes}:{seconds}

        </div>


        <p className="timer-label">
          Ride duration
        </p>


        <div className="estimate-box">

          <span>
            Estimated fare
          </span>

          <strong>
            ₹{estimatedFare.toFixed(2)}
          </strong>

        </div>


        <div className="ride-rate">

          <span>
            Unlock fee
          </span>

          <strong>
            ₹{ride.unlockFee}
          </strong>

        </div>


        <div className="ride-rate">

          <span>
            Per minute
          </span>

          <strong>
            ₹{ride.perMinute}
          </strong>

        </div>


        {error && (

          <div className="error">
            {error}
          </div>

        )}


        <button
          type="button"
          className="end-btn"
          onClick={
            endRide
          }
          disabled={
            ending
          }
        >

          {ending
            ? "Ending ride..."
            : "End ride"}

        </button>


        <small>
          Park responsibly before
          ending your ride.
        </small>

      </div>

    </section>

  );

}