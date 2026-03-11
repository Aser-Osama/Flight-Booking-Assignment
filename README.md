# Flight Booking System (Monorepo Scaffold)

This repository is scaffolded as a monorepo with:

- `server/` — Node.js + Express + MongoDB backend
- `client/` — React frontend created with Vite

## Project Structure

```text
.
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   └── server.js
└── client/
    └── src/
        ├── api/
        ├── context/
        ├── pages/
        ├── components/
        └── App.jsx
```

## Prerequisites

- Node.js (v18+ recommended)
- npm
- MongoDB (local or hosted)

## Setup

### 1) Backend

```bash
cd server
npm install
```

Configure environment variables in `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
MAILTRAP_USER=your_mailtrap_user
MAILTRAP_PASS=your_mailtrap_pass
```

Run backend:

```bash
npm run dev
```

### 2) Frontend

```bash
cd client
npm install
```

Run frontend:

```bash
npm run dev
```

## Run Both (Two Terminals)

Terminal 1:

```bash
cd server
npm run dev
```

Terminal 2:

```bash
cd client
npm run dev
```

## Notes

- This is scaffolding/boilerplate only.
- Core auth, flights, and bookings logic is intentionally left unimplemented.
