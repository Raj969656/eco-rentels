import React, {
  useEffect,
  useState
} from "react";

import {
  Marker,
  Circle,
  useMap
} from "react-leaflet";

import L from "leaflet";


const userIcon =
  new L.DivIcon({

    className:
      "user-location-marker",

    html: `
      <div class="user-location-dot">
        <span></span>
      </div>
    `,

    iconSize: [
      22,
      22
    ],

    iconAnchor: [
      11,
      11
    ]

  });


export default function UserLocation() {

  const map =
    useMap();


  const [position, setPosition] =
    useState(null);


  // ===================================================
  // GET USER LOCATION
  // ===================================================

  useEffect(() => {

    if (
      !navigator.geolocation
    ) {

      console.log(
        "Geolocation is not supported."
      );

      return;

    }


    const watchId =
      navigator.geolocation.watchPosition(

        (location) => {

          const newPosition = [

            location.coords.latitude,

            location.coords.longitude

          ];


          setPosition(
            newPosition
          );

        },

        (error) => {

          console.error(
            "Location error:",
            error
          );

        },

        {
          enableHighAccuracy:
            true,

          maximumAge:
            10000,

          timeout:
            10000
        }

      );


    return () => {

      navigator.geolocation.clearWatch(
        watchId
      );

    };

  }, []);


  // ===================================================
  // CENTER MAP ON USER
  // ===================================================

  useEffect(() => {

    if (!position) {
      return;
    }


    map.setView(
      position,
      15,
      {
        animate: true
      }
    );

  }, [
    position,
    map
  ]);


  // ===================================================
  // NO LOCATION YET
  // ===================================================

  if (!position) {
    return null;
  }


  return (
    <>
      <Marker
        position={
          position
        }
        icon={
          userIcon
        }
      />

      <Circle
        center={
          position
        }

        radius={
          60
        }

        pathOptions={{
          color:
            "#1677ff",

          fillColor:
            "#1677ff",

          fillOpacity:
            0.08,

          opacity:
            0.2
        }}
      />

    </>
  );
}