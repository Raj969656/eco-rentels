import React from "react";
import { Link } from "react-router-dom";

export default function Pricing() {

  const plans = [
    {
      name: "Scooter",
      unlock: 10,
      minute: 2
    },
    {
      name: "E-Bike",
      unlock: 10,
      minute: 3
    },
    {
      name: "Bike",
      unlock: 15,
      minute: 4
    }
  ];

  return (
    <section className="page pricing-page">

      <div className="page-heading">

        <p className="eyebrow">
          SIMPLE PRICING
        </p>

        <h1>
          Pay only for what you ride.
        </h1>

        <p>
          No complicated memberships.
          Unlock your vehicle and pay
          by the minute.
        </p>

      </div>


      <div className="pricing-grid">

        {plans.map((plan) => (

          <article
            className="price-card"
            key={plan.name}
          >

            <h2>
              {plan.name}
            </h2>

            <div className="price">

              <strong>
                ₹{plan.minute}
              </strong>

              <span>
                / minute
              </span>

            </div>

            <p>
              ₹{plan.unlock} unlock fee
            </p>

            <Link
              to="/explore"
              className="dark-btn wide"
            >
              Find a {plan.name}
            </Link>

          </article>

        ))}

      </div>

    </section>
  );
}