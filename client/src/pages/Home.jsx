import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [openFaq, setOpenFaq] = useState(0);

  const vehicles = [
    {
      type: "Scooters",
      icon: "🛴",
      description:
        "Perfect for quick city trips, errands and everyday commuting.",
      price: "₹2/min",
      action: "Explore scooters",
    },
    {
      type: "E-Bikes",
      icon: "🚲",
      description:
        "Comfortable electric rides for longer trips around the city.",
      price: "₹3/min",
      action: "Explore e-bikes",
    },
    {
      type: "Bikes",
      icon: "🚴",
      description:
        "Simple and active transportation for short-distance journeys.",
      price: "₹4/min",
      action: "Explore bikes",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Find a vehicle",
      description:
        "Open Explore and find an available Eco Rentels vehicle near you.",
    },
    {
      number: "02",
      title: "Reserve or start",
      description:
        "Reserve your vehicle for a few minutes or start an available ride instantly.",
    },
    {
      number: "03",
      title: "Enjoy your ride",
      description:
        "Unlock your vehicle and get moving. Your ride time is tracked automatically.",
    },
    {
      number: "04",
      title: "Park and finish",
      description:
        "Park responsibly in an approved location and end your ride from the app.",
    },
  ];

  const benefits = [
    {
      icon: "⚡",
      title: "Quick and convenient",
      text:
        "Find a ride nearby and start your journey without waiting for public transport.",
    },
    {
      icon: "₹",
      title: "Simple pricing",
      text:
        "Clear unlock fees and per-minute pricing. No complicated calculations.",
    },
    {
      icon: "📍",
      title: "Ride where you need",
      text:
        "Discover available vehicles around your location using our live map.",
    },
    {
      icon: "🌱",
      title: "Better urban mobility",
      text:
        "Choose a lighter, cleaner way to move through busy city streets.",
    },
  ];

  const faqs = [
    {
      question: "How do I start a ride?",
      answer:
        "Open Explore, choose an available vehicle and tap Start. If you are not logged in, Eco Rentels will ask you to log in before starting the ride.",
    },
    {
      question: "Can I reserve a vehicle?",
      answer:
        "Yes. You can reserve an available vehicle before reaching it. The reservation keeps the vehicle available for you for the reservation period.",
    },
    {
      question: "How is the ride price calculated?",
      answer:
        "Your fare is based on the vehicle's unlock fee and the number of minutes you ride. The exact pricing is displayed before you start.",
    },
    {
      question: "What vehicles can I rent?",
      answer:
        "Eco Rentels supports scooters, e-bikes and bikes. Vehicle availability depends on your current service area.",
    },
    {
      question: "How do I end my ride?",
      answer:
        "Park the vehicle responsibly in an allowed location and use the End Ride option on the ride screen.",
    },
  ];

  return (
    <div className="home-page">

      {/* =====================================================
          1. HERO
      ===================================================== */}

      <section className="home-hero">

        <div className="home-hero-content">

          <div className="home-eyebrow">
            <span></span>
            ECO RENTELS
          </div>

          <h1>
            Move freely.
            <br />
            <span>Ride greener.</span>
          </h1>

          <p className="home-hero-description">
            Convenient bikes, e-bikes and scooters
            for getting around your city without
            the hassle.
          </p>

          <div className="home-hero-actions">

            <Link
              to="/explore"
              className="home-primary-btn"
            >
              Find a ride
              <span>→</span>
            </Link>

            <Link
              to="/how-it-works"
              className="home-secondary-btn"
            >
              How it works
            </Link>

          </div>

          <div className="home-trust-row">

            <div>
              <strong>3+</strong>
              <span>Ride types</span>
            </div>

            <div>
              <strong>24/7</strong>
              <span>Ride access</span>
            </div>

            <div>
              <strong>₹2</strong>
              <span>Starting / min</span>
            </div>

          </div>

        </div>


        {/* HERO VISUAL */}

        <div className="home-hero-visual">

          <div className="hero-map-decoration">
            <span className="map-line line-one"></span>
            <span className="map-line line-two"></span>
            <span className="map-line line-three"></span>

            <span className="map-dot dot-one"></span>
            <span className="map-dot dot-two"></span>
            <span className="map-dot dot-three"></span>
          </div>

          <div className="hero-vehicle-circle">
            <div className="hero-vehicle">
              🛴
            </div>
          </div>

          <div className="hero-floating-card hero-location-card">

            <span className="floating-icon">
              📍
            </span>

            <div>
              <strong>
                Vehicles nearby
              </strong>

              <span>
                Find your next ride
              </span>
            </div>

          </div>

          <div className="hero-floating-card hero-price-card">

            <span className="floating-price">
              ₹2
            </span>

            <div>
              <strong>
                per minute
              </strong>

              <span>
                Simple pricing
              </span>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          2. VEHICLE TYPES
      ===================================================== */}

      <section className="home-section home-vehicles">

        <div className="home-section-heading">

          <div>

            <span className="home-section-label">
              CHOOSE YOUR RIDE
            </span>

            <h2>
              Whatever the journey,
              <br />
              there is a ride for it.
            </h2>

          </div>

          <Link
            to="/explore"
            className="section-link"
          >
            View all vehicles →
          </Link>

        </div>


        <div className="home-vehicle-grid">

          {vehicles.map((vehicle) => (

            <Link
              to="/explore"
              className="home-vehicle-card"
              key={vehicle.type}
            >

              <div className="vehicle-card-top">

                <span className="home-vehicle-icon">
                  {vehicle.icon}
                </span>

                <span className="vehicle-arrow">
                  ↗
                </span>

              </div>

              <div className="home-vehicle-info">

                <h3>
                  {vehicle.type}
                </h3>

                <p>
                  {vehicle.description}
                </p>

                <div className="vehicle-price-row">

                  <span>
                    From
                  </span>

                  <strong>
                    {vehicle.price}
                  </strong>

                </div>

              </div>

            </Link>

          ))}

        </div>

      </section>


      {/* =====================================================
          3. HOW IT WORKS
      ===================================================== */}

      <section className="home-section home-how">

        <div className="home-section-heading">

          <div>

            <span className="home-section-label">
              HOW IT WORKS
            </span>

            <h2>
              From standing still
              <br />
              to moving in minutes.
            </h2>

          </div>

          <p className="section-heading-description">
            No complicated process. Find a vehicle,
            start your ride and get where you need
            to go.
          </p>

        </div>


        <div className="home-steps">

          {steps.map((step) => (

            <div
              className="home-step"
              key={step.number}
            >

              <span className="step-number">
                {step.number}
              </span>

              <div className="step-line"></div>

              <h3>
                {step.title}
              </h3>

              <p>
                {step.description}
              </p>

            </div>

          ))}

        </div>


        <div className="home-how-banner">

          <div className="how-banner-visual">
            <span>📍</span>
            <div></div>
            <span>🛴</span>
            <div></div>
            <span>🏁</span>
          </div>

          <div>

            <span className="home-section-label">
              READY WHEN YOU ARE
            </span>

            <h3>
              Your next ride is only
              a few taps away.
            </h3>

          </div>

          <Link
            to="/explore"
            className="home-primary-btn"
          >
            Find a vehicle →
          </Link>

        </div>

      </section>


      {/* =====================================================
          4. WHY ECO RENTELS
      ===================================================== */}

      <section className="home-section home-benefits">

        <div className="home-benefits-intro">

          <span className="home-section-label">
            WHY ECO RENTELS
          </span>

          <h2>
            Built around
            <br />
            your journey.
          </h2>

          <p>
            Getting around the city should be
            simple, predictable and convenient.
            Eco Rentels is designed around exactly
            that.
          </p>

          <Link
            to="/how-it-works"
            className="text-arrow-link"
          >
            Learn how it works →
          </Link>

        </div>


        <div className="home-benefits-grid">

          {benefits.map((benefit) => (

            <div
              className="home-benefit"
              key={benefit.title}
            >

              <div className="benefit-icon">
                {benefit.icon}
              </div>

              <h3>
                {benefit.title}
              </h3>

              <p>
                {benefit.text}
              </p>

            </div>

          ))}

        </div>

      </section>


      {/* =====================================================
          5. PRICING
      ===================================================== */}

      <section className="home-section home-pricing-preview">

        <div className="pricing-preview-header">

          <div>

            <span className="home-section-label">
              SIMPLE PRICING
            </span>

            <h2>
              Know the price
              before you ride.
            </h2>

          </div>

          <Link
            to="/pricing"
            className="section-link"
          >
            See full pricing →
          </Link>

        </div>


        <div className="home-price-table">

          <div className="price-row price-header">

            <span>
              Vehicle
            </span>

            <span>
              Unlock
            </span>

            <span>
              Per minute
            </span>

            <span>
              Action
            </span>

          </div>


          <div className="price-row">

            <div className="price-vehicle">
              <span>🛴</span>
              <strong>Scooter</strong>
            </div>

            <span>₹10</span>

            <strong>₹2/min</strong>

            <Link to="/explore">
              Ride →
            </Link>

          </div>


          <div className="price-row">

            <div className="price-vehicle">
              <span>🚲</span>
              <strong>E-Bike</strong>
            </div>

            <span>₹10</span>

            <strong>₹3/min</strong>

            <Link to="/explore">
              Ride →
            </Link>

          </div>


          <div className="price-row">

            <div className="price-vehicle">
              <span>🚴</span>
              <strong>Bike</strong>
            </div>

            <span>₹15</span>

            <strong>₹4/min</strong>

            <Link to="/explore">
              Ride →
            </Link>

          </div>

        </div>


        <div className="price-example">

          <div className="price-example-icon">
            ₹
          </div>

          <div>

            <strong>
              Example ride
            </strong>

            <p>
              A 15-minute scooter ride
              would cost ₹40 including
              the ₹10 unlock fee.
            </p>

          </div>

          <Link to="/pricing">
            Calculate your ride →
          </Link>

        </div>

      </section>


      {/* =====================================================
          6. SAFETY
      ===================================================== */}

      <section className="home-safety">

        <div className="safety-content">

          <span className="home-section-label">
            RIDE RESPONSIBLY
          </span>

          <h2>
            Your ride.
            <br />
            Your responsibility.
          </h2>

          <p>
            We want every Eco Rentels journey
            to be convenient and safe. Follow
            local traffic rules, wear appropriate
            safety equipment and park responsibly.
          </p>

          <div className="safety-points">

            <div>
              <span>01</span>
              Wear a helmet where required.
            </div>

            <div>
              <span>02</span>
              Follow local traffic regulations.
            </div>

            <div>
              <span>03</span>
              Park without blocking pedestrians.
            </div>

          </div>

          <Link
            to="/how-it-works"
            className="home-light-btn"
          >
            Learn about riding safely →
          </Link>

        </div>


        <div className="safety-visual">

          <div className="safety-circle">

            <div className="safety-vehicle">
              🚲
            </div>

          </div>

          <div className="safety-badge">
            <span>✓</span>
            Ride responsibly
          </div>

        </div>

      </section>


      {/* =====================================================
          7. FAQ
      ===================================================== */}

      <section className="home-section home-faq">

        <div className="home-section-heading faq-heading">

          <div>

            <span className="home-section-label">
              FAQ
            </span>

            <h2>
              Questions?
              <br />
              We've got answers.
            </h2>

          </div>

          <p className="section-heading-description">
            Everything you need to know before
            your first Eco Rentels ride.
          </p>

        </div>


        <div className="faq-list">

          {faqs.map((faq, index) => {

            const isOpen =
              openFaq === index;

            return (
              <div
                className={
                  isOpen
                    ? "faq-item open"
                    : "faq-item"
                }
                key={faq.question}
              >

                <button
                  type="button"
                  onClick={() =>
                    setOpenFaq(
                      isOpen
                        ? -1
                        : index
                    )
                  }
                >

                  <span>
                    {faq.question}
                  </span>

                  <strong>
                    {isOpen
                      ? "−"
                      : "+"}
                  </strong>

                </button>

                {isOpen && (

                  <div className="faq-answer">
                    <p>
                      {faq.answer}
                    </p>
                  </div>

                )}

              </div>
            );

          })}

        </div>

      </section>


      {/* =====================================================
          8. FINAL CTA
      ===================================================== */}

      <section className="home-final-cta">

        <div className="final-cta-content">

          <span className="home-section-label">
            START MOVING
          </span>

          <h2>
            Your city is waiting.
          </h2>

          <p>
            Find a vehicle nearby and
            make your next trip easier.
          </p>

          <div className="final-cta-actions">

            <Link
              to="/explore"
              className="home-dark-cta"
            >
              Find a ride →
            </Link>

            <Link
              to="/account"
              className="home-outline-cta"
            >
              Create account
            </Link>

          </div>

        </div>

        <div className="final-cta-vehicle">
          🛴
        </div>

      </section>

    </div>
  );
}