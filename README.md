# Task Manager + Auth (Full Stack)

A small but complete full‑stack task manager:
- React (Vite) frontend
- Express + MongoDB backend
- JWT auth (bcrypt password hashing)

## Features
- Signup / Login
- JWT-protected routes
- Tasks CRUD (create, list, update status, delete)
- Basic loading + error states

## Tech Stack
- Client: React, Vite, Tailwind CSS, React Router
- Server: Node.js, Express, Mongoose, bcrypt, jsonwebtoken
- DB: MongoDB (Atlas or any MongoDB URI)

## Project Structure
- `client/` – React app
- `server/` – Express API

## Local Setup

### 1) Backend (Express)

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Update `server/.env`:
- `MONGODB_URI=...`
- `JWT_SECRET=...`

API runs on `http://localhost:4000`.

### 2) Frontend (React)

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

If your API is not on `http://localhost:4000`, set `VITE_API_URL` in `client/.env`.

## API Routes
- `GET /api/health`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me` (Bearer token)
- `GET /api/tasks` (Bearer token)
- `POST /api/tasks` (Bearer token)
- `PUT /api/tasks/:id` (Bearer token)
- `DELETE /api/tasks/:id` (Bearer token)

## Deployment Notes (fast path)

### Backend (Render/Railway)
- Set env vars: `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN` (optional)
- Start command: `npm start`

### Frontend (Vercel)
- Set env var: `VITE_API_URL=https://your-backend-domain`
- Build command: `npm run build`
- Output: `client/dist`

## License
MIT
# Task-Manager-App
