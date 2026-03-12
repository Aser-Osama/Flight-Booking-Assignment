# Flight Booking System

Full-stack flight booking application built with React (Vite) on the frontend and Node.js/Express + MongoDB on the backend.

## Features

- JWT authentication with protected routes
- User registration with email verification (6-digit code, 10-minute expiry)
- Login/logout with persistent session via localStorage
- Search flights by `from`, `to`, and `date`
- Book flights with seat count validation
- View and cancel your bookings
- Responsive UI styled with Tailwind CSS

## Tech Stack

### Frontend (`client/`)

- React 19
- React Router
- Axios
- Tailwind CSS
- Vite

### Backend (`server/`)

- Node.js + Express
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Password hashing (`bcryptjs`)
- Email sending (`nodemailer` + Mailtrap SMTP)

## Project Structure

```text
.
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── App.jsx
│   └── package.json
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
└── README.md
```

## Data Model (MongoDB Collections)

- `users`
    - `name`, `email`, `password`, `isVerified`, `verificationCode`, `verificationCodeExpires`
- `flights`
    - `flightNumber`, `from`, `to`, `date`, `totalSeats`, `availableSeats`, `price`
- `bookings`
    - `user`, `flight`, `bookingDate`, `numberOfSeats`, `totalPrice`, `status`

## Prerequisites

- Node.js 18+
- npm
- MongoDB connection string
- Mailtrap SMTP credentials (for verification email)

## Environment Variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
MAILTRAP_USER=your_mailtrap_user
MAILTRAP_PASS=your_mailtrap_pass
```

## Installation

### 1) Install backend dependencies

```bash
cd server
npm install
```

### 2) Install frontend dependencies

```bash
cd ../client
npm install
```

## Run the App

Open two terminals from project root.

### Terminal A (Backend)

```bash
cd server
npm run dev
```

Backend runs on `http://localhost:5000`.

### Terminal B (Frontend)

```bash
cd client
npm run dev
```

Frontend runs on Vite default port (`5173` unless already in use).

## Build / Lint

### Frontend

```bash
cd client
npm run lint
npm run build
```

### Backend

```bash
cd server
npm start
```

## Authentication & Session Flow

1. User registers with name/email/password.
2. Backend creates a 6-digit verification code and emails it via Mailtrap.
3. User verifies email with code (`/api/auth/verify`).
4. User logs in (`/api/auth/login`) and receives JWT.
5. Frontend stores `{ token, user }` in `localStorage` under `auth`.
6. Axios request interceptor reads token from `localStorage` and sends:
     - `Authorization: Bearer <token>`

## API Endpoints

Base URL: `http://localhost:5000/api`

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/verify`
- `GET /auth/profile` (Protected)
- `PUT /auth/profile` (Protected)

### Flights

- `GET /flights`
- `GET /flights/search?from=&to=&date=`
- `GET /flights/:id`
- `POST /flights`
- `PUT /flights/:id`
- `DELETE /flights/:id`

### Bookings (Protected)

- `POST /bookings`
- `GET /bookings/my`
- `PATCH /bookings/:id/cancel`

## Frontend Routes

- Public:
    - `/register`
    - `/login`
    - `/verify`
- Protected:
    - `/` (Home / flight search)
    - `/bookings`
    - `/profile`

## CORS Notes (Local Development)

Backend allows these frontend origins:

- `http://localhost:3000`
- `http://localhost:5173`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:5173`

If your frontend starts on a different port, update CORS config in `server/server.js`.

## Quick Manual Happy Path

1. Register account
2. Get verification code from Mailtrap inbox
3. Verify email
4. Login
5. Search / show flights
6. Book a flight
7. Open My Bookings
8. Cancel booking
9. Logout
