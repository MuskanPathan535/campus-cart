# Campus Cart

A resume-ready MERN college marketplace where students can buy and sell calculators, books, cycles, laptops, and hostel items.

## Features

- Student registration and login with JWT and bcrypt
- Sell item form with image upload through Multer
- Categories, keyword search, and availability filtering
- Wishlist save and remove flow
- Seller dashboard with mark sold / mark available
- Chat request flow without sockets, using manual refresh plus frontend polling
- MongoDB models for users, items, conversations, and messages
- Responsive React UI designed as a practical campus dashboard

## Project Structure

```text
backend/
  src/
    middleware/
    models/
    routes/
    utils/
  uploads/
  .env_example
  package.json

frontend/
  src/
    App.jsx
    api.js
    styles.css
  package.json
```

## Run Locally

1. Start MongoDB locally or use MongoDB Atlas.
2. Copy `backend/.env_example` to `backend/.env`.
3. Install and start the backend:

```bash
cd backend
npm install
npm run dev
```

4. Install and start the frontend in another terminal:

```bash
cd frontend
npm install
npm run dev
```

5. Open `http://localhost:5173`.

## Resume Highlights

- Built a full-stack MERN marketplace with protected REST APIs and role-aware item actions.
- Implemented refresh-based buyer-seller messaging without WebSockets for simpler deployment.
- Added image uploads, wishlist persistence, listing ownership checks, and responsive UI flows.
