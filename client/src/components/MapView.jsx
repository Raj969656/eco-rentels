import React from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

import L from "leaflet";

import UserLocation
  from "./UserLocation.jsx";

import "leaflet/dist/leaflet.css";


const vehicleIcon =
  new L.Icon({

    iconUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

    iconSize: [
      25,
      41
    ],

    iconAnchor: [
      12,
      41
    ],

    popupAnchor: [
      1,
      -34
    ]

  });


export default function MapView({

  vehicles = [],

  selectedVehicle,

  onSelect

}) {


  const defaultCenter = [
    28.6139,
    77.2090
  ];


  const center =
    selectedVehicle &&
    typeof selectedVehicle.lat ===
      "number" &&
    typeof selectedVehicle.lng ===
      "number"

      ? [
          selectedVehicle.lat,
          selectedVehicle.lng
        ]

      : defaultCenter;


  return (

    <div className="map-wrapper">

      <MapContainer

        center={
          center
        }

        zoom={
          14
        }

        scrollWheelZoom={
          true
        }

        className="map"

      >

        {/* OpenStreetMap */}

        <TileLayer

          attribution=
            '&copy; OpenStreetMap contributors'

          url=
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

        />


        {/* User location */}

        <UserLocation />


        {/* Vehicles */}

        {vehicles.map(
          (vehicle) => {

            if (
              typeof vehicle.lat !==
                "number" ||
              typeof vehicle.lng !==
                "number"
            ) {

              return null;

            }


            return (

              <Marker

                key={
                  vehicle._id
                }

                position={[
                  vehicle.lat,
                  vehicle.lng
                ]}

                icon={
                  vehicleIcon
                }

                eventHandlers={{
                  click:
                    () =>
                      onSelect(
                        vehicle
                      )
                }}

              >

                <Popup>

                  <div className="map-popup">

                    <strong>
                      {vehicle.name}
                    </strong>

                    <span>
                      {vehicle.code}
                    </span>

                    <span>
                      🔋 {vehicle.battery}%
                    </span>

                    <span>
                      ₹{vehicle.unlockFee}
                      {" "}unlock
                    </span>

                    <span>
                      ₹{vehicle.perMinute}/min
                    </span>

                    <span>
                      Status:{" "}
                      {vehicle.status}
                    </span>

                  </div>

                </Popup>

              </Marker>

            );

          }
        )}

      </MapContainer>

    </div>

  );
}