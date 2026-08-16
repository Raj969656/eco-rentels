import React from "react";
import { Link } from "react-router-dom";

export default function HowItWorks() {

  const steps = [
    {
      number: "01",
      title: "Find a vehicle",
      text:
        "Open Explore and find an available Eco vehicle near you."
    },
    {
      number: "02",
      title: "Reserve or start",
      text:
        "Reserve a vehicle for 10 minutes or start an available vehicle immediately."
    },
    {
      number: "03",
      title: "Ride",
      text:
        "Unlock the vehicle and enjoy your trip while the ride timer tracks your fare."
    },
    {
      number: "04",
      title: "End your ride",
      text:
        "Park responsibly, end the ride and see your final fare."
    }
  ];

  return (
    <section className="page how-page">

      <div className="page-heading">

        <p className="eyebrow">
          HOW IT WORKS
        </p>

        <h1>
          Four simple steps.
        </h1>

        <p>
          Getting around your city with
          Eco Rentels is simple.
        </p>

      </div>


      <div className="how-grid">

        {steps.map((step) => (

          <article
            className="how-card"
            key={step.number}
          >

            <span>
              {step.number}
            </span>

            <h2>
              {step.title}
            </h2>

            <p>
              {step.text}
            </p>

          </article>

        ))}

      </div>


      <div className="how-cta">

        <h2>
          Ready to ride?
        </h2>

        <Link
          to="/explore"
          className="dark-btn"
        >
          Find a vehicle
        </Link>

      </div>

    </section>
  );
}