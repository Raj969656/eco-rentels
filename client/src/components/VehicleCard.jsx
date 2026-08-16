import React, { useEffect, useState } from "react";

export default function VehicleCard({
  vehicle,
  selected,
  onSelect,
  onReserve,
  onStart,
  onCancelReservation
}) {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (
      vehicle.status !== "reserved" ||
      !vehicle.reservationExpiresAt
    ) {
      setSecondsLeft(0);
      return;
    }

    const updateTimer = () => {
      const expiry = new Date(
        vehicle.reservationExpiresAt
      ).getTime();

      const remaining = Math.max(
        0,
        Math.floor((expiry - Date.now()) / 1000)
      );

      setSecondsLeft(remaining);
    };

    updateTimer();

    const interval = setInterval(
      updateTimer,
      1000
    );

    return () => clearInterval(interval);
  }, [
    vehicle.status,
    vehicle.reservationExpiresAt
  ]);

  const icon =
    vehicle.type === "ebike"
      ? "🚲"
      : vehicle.type === "bike"
      ? "🚴"
      : "🛴";

  const minutes = String(
    Math.floor(secondsLeft / 60)
  ).padStart(2, "0");

  const seconds = String(
    secondsLeft % 60
  ).padStart(2, "0");

  return (
    <article
      className={`vehicle-card ${
        selected ? "selected" : ""
      }`}
      onClick={() => onSelect(vehicle)}
    >
      <div className="vehicle-visual">
        <span className="vehicle-icon">
          {icon}
        </span>

        <span className="battery">
          🔋 {vehicle.battery ?? 0}%
        </span>
      </div>

      <div className="vehicle-body">
        <div>
          <h3>{vehicle.name}</h3>

          <p>{vehicle.code}</p>

          <p>
            ₹{vehicle.unlockFee ?? 0} unlock
            {" · "}
            ₹{vehicle.perMinute ?? 0}/min
          </p>
        </div>

        <div className="vehicle-actions">

          {/* AVAILABLE */}
          {vehicle.status === "available" && (
            <>
              <button
                type="button"
                className="soft-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onReserve(vehicle);
                }}
              >
                Reserve
              </button>

              <button
                type="button"
                className="dark-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onStart(vehicle);
                }}
              >
                Start
              </button>
            </>
          )}

          {/* RESERVED */}
          {vehicle.status === "reserved" && (
            <div className="reservation-box">
              <span className="reservation-timer">
                {secondsLeft > 0
                  ? `${minutes}:${seconds}`
                  : "Expired"}
              </span>

              {secondsLeft > 0 && (
                <>
                  <button
                    type="button"
                    className="dark-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStart(vehicle);
                    }}
                  >
                    Start
                  </button>

                  <button
                    type="button"
                    className="soft-btn"
                    onClick={(e) => {
                      e.stopPropagation();

                      if (onCancelReservation) {
                        onCancelReservation(vehicle);
                      }
                    }}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          )}

          {/* IN USE */}
          {vehicle.status === "in_use" && (
            <span className="status-pill">
              In use
            </span>
          )}

          {/* MAINTENANCE */}
          {vehicle.status === "maintenance" && (
            <span className="status-pill">
              Maintenance
            </span>
          )}

        </div>
      </div>
    </article>
  );
}