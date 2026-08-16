# Eco Rentels — Lime-inspired MERN Micromobility Platform

A full-stack micromobility rental MVP built with:
- React + Vite
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Leaflet + OpenStreetMap
- Responsive CSS
- Vehicle discovery, reservation, start/end ride, ride history and pricing

Important:
This project is intentionally an original Eco Rentels implementation inspired by common
micromobility UX patterns. Do not copy Lime's trademarks, logo, proprietary assets,
source code, or exact visual trade dress.

## 1. Backend

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Set `MONGO_URI` and `JWT_SECRET` in `.env`.

## 2. Frontend

```bash
cd client
npm install
npm run dev
```

The frontend expects the API at `http://localhost:5000/api`.

## Demo login
Register a new account from the website. A demo seed can also be added later.

## Main API
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
GET    /api/vehicles
GET    /api/vehicles/:id
POST   /api/vehicles/:id/reserve
POST   /api/rides/start
POST   /api/rides/:id/end
GET    /api/rides/my
GET    /api/pricing
