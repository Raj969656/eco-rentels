import React from "react";

import {
  Link,
  useLocation,
  Navigate
} from "react-router-dom";


export default function RideComplete() {

  const location =
    useLocation();


  const ride =
    location.state?.ride;


  if (!ride) {

    return (
      <Navigate
        to="/explore"
        replace
      />
    );

  }


  return (

    <section className="ride-page">

      <div className="ride-success">

        <div className="success-icon">
          ✓
        </div>


        <p className="eyebrow">
          RIDE COMPLETE
        </p>


        <h1>
          Thanks for riding Eco.
        </h1>


        <p className="complete-text">
          Your ride has ended successfully.
        </p>


        <div className="fare-list">


          <div className="fare">

            <span>
              Vehicle
            </span>

            <strong>
              {ride.vehicle?.name ||
                "Eco Vehicle"}
            </strong>

          </div>


          <div className="fare">

            <span>
              Duration
            </span>

            <strong>
              {ride.durationMinutes}
              {" "}min
            </strong>

          </div>


          <div className="fare">

            <span>
              Unlock fee
            </span>

            <strong>
              ₹{ride.unlockFee}
            </strong>

          </div>


          <div className="fare">

            <span>
              Ride rate
            </span>

            <strong>
              ₹{ride.perMinute}/min
            </strong>

          </div>


          <div className="fare total">

            <span>
              Total
            </span>

            <strong>
              ₹{Number(
                ride.total
              ).toFixed(2)}
            </strong>

          </div>

        </div>


        <div className="complete-actions">

          <Link
            to="/explore"
            className="dark-btn wide"
          >
            Find another ride
          </Link>


          <Link
            to="/account"
            className="soft-btn wide"
          >
            View ride history
          </Link>

        </div>

      </div>

    </section>

  );

}