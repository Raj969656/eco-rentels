import "dotenv/config";
import mongoose from "mongoose";
import Vehicle from "./models/Vehicle.js";

const vehicles = [
  { code: "ECO-101", type: "scooter", name: "Eco Scooter S1", battery: 94, lat: 28.6139, lng: 77.2090, unlockFee: 10, perMinute: 2 },
  { code: "ECO-102", type: "scooter", name: "Eco Scooter S1", battery: 81, lat: 28.6200, lng: 77.2150, unlockFee: 10, perMinute: 2 },
  { code: "ECO-201", type: "ebike", name: "Eco E-Bike E2", battery: 72, lat: 28.6070, lng: 77.2200, unlockFee: 15, perMinute: 3 },
  { code: "ECO-202", type: "ebike", name: "Eco E-Bike E2", battery: 88, lat: 28.6160, lng: 77.2250, unlockFee: 15, perMinute: 3 },
  { code: "ECO-301", type: "bike", name: "Eco Bike B1", battery: 100, lat: 28.6110, lng: 77.2000, unlockFee: 5, perMinute: 1.5 }
];

await mongoose.connect(process.env.MONGO_URI);
await Vehicle.deleteMany({});
await Vehicle.insertMany(vehicles);
console.log("Vehicles seeded");
await mongoose.disconnect();
