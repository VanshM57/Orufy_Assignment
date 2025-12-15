# Productr (Orufy Project)

A simple marketplace admin app to add/manage products with image uploads, OTP-based email login, and cookie-based JWT authentication.

---

## Repo structure

- `client/` - React + Vite frontend
  - `src/` - source code (pages, components, contexts)
  - `.env` - sets `VITE_API_URL`
- `server/` - Express backend
  - `controllers/`, `models/`, `routes/`, `config/`, `middlewares/`, `utils/`

---

## Features

- Email OTP authentication (send OTP, verify OTP)
- Cookie-based JWT authentication (`token` cookie)
- Create / update / delete products
- Multiple images per product (Cloudinary storage via `multer-storage-cloudinary`)
- Publish/unpublish products
- Client-side search/publish filter and product management UI

---

## Quick start

Prerequisites:
- Node.js (v16+ recommended)
- A MongoDB instance (Atlas or local)
- Cloudinary account (for image uploads)
- SMTP credentials (for sending OTPs)

### 1) Server

1. Copy `server/.env.example` (or create `.env`) and fill values (see below).
2. Install dependencies and start:

```bash
# from project root
cd server
npm install
npm start    # runs `node server.js`
```

> Note: `server/server.js` expects an `app` export (the Express app). Confirm `app.js` or equivalent exists and is wired to connect to MongoDB and register middleware/routes. If deploying to Vercel, the Express app is exported from `server/api/index.js` for serverless function usage.

### 2) Client

```bash
cd client
npm install
npm run dev   # runs Vite dev server (default port: 5173)
```

Open the app at `http://localhost:5173`.

The frontend reads `VITE_API_URL` from `client/.env` (default during development: `http://localhost:5000/api`).

---

## Environment variables

Server (create `.env` with these variables):

- `MONGO_URI` - MongoDB connection string
- `PORT` - server port (default 5000)
- `JWT_SECRET` - secret used to sign JWT tokens
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` - SMTP settings for sending OTP
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` - Cloudinary settings for image uploads
- `CLIENT_URL` - frontend origin (used for CORS or links)
  - Important: set this to your deployed frontend origin (e.g. `https://orufy-assignment-zz19.vercel.app`) so the server returns a non-wildcard `Access-Control-Allow-Origin` header when cookies are used (`withCredentials`).

Client (in `client/.env`):

- `VITE_API_URL` - e.g. `http://localhost:5000/api`

Important: Never commit real secret values to the repo. Use placeholders during development and set real secrets in your deployment environment.

---

## API (summary)

Base URL: `${VITE_API_URL}` (frontend expects cookie auth and uses `withCredentials`).

Auth routes (`/auth`):
- `POST /auth/send-otp` - body: `{ email }` -> sends OTP to email
- `POST /auth/verify-otp` - body: `{ email, otp }` -> returns a token (and sets `token` cookie)
- `POST /auth/logout` - clears auth cookie
- `GET /auth/me` - returns the authenticated user (requires cookie or Authorization header)

Products routes (`/products`) - protected (requires auth):
- `GET /products` - returns all products
- `POST /products` - create product (multipart/form-data). Field name for images: `images` (up to 10 files)
- `PUT /products/:id` - update product; supports `existingImages` body field and appended new `images` files
- `PUT /products/:id/toggle` - toggle published state
- `DELETE /products/:id` - delete product

Notes:
- The backend stores product image URLs returned by Cloudinary in the `images` array.
- JWT tokens are set as an HTTP-only `token` cookie on successful OTP verification. The frontend uses `axios` with `withCredentials` enabled.

---

## Client internals

- `src/context/AuthContext.jsx` - checks `/auth/me` on load; provides `authenticated` state and `logout()` helper.
- `src/context/ProductContext.jsx` - fetches products, provides `addProduct`, `updateProduct`, `deleteProduct`, and `togglePublish` helpers.
- `src/api/axios.js` - Axios instance configured with `baseURL` = `VITE_API_URL` and `withCredentials: true`.
- `pages/` - `Login`, `VerifyOtp`, `Home`, `Products` implement UI flows.
- Product forms send `multipart/form-data` with field `images` and other product fields.

---

## Server internals

- `controllers/authController.js` - handles OTP generation, verification, setting JWT cookie, logout, and returning `me`.
- `controllers/productController.js` - CRUD operations for products; merges image arrays on update.
- `config/cloudinary.js` - configures Cloudinary SDK using env vars.
- `config/multer.js` - uses `multer-storage-cloudinary` to upload to Cloudinary. Allowed formats: `jpg, jpeg, png, webp`.
- `middlewares/authMiddleware.js` - expects a JWT token in `cookies.token` or `Authorization: Bearer <token>`.
- `utils/mailer.js` - uses `nodemailer` to send OTP emails.

---

## Seeding & Scripts

If a seed script exists under `server/scripts/seed` (not always present), you can use it to populate example products. Check that folder for instructions.

---

## Deployment

- The server directory contains an `api` entry designed for serverless platforms (e.g., Vercel functions) by exporting the Express app. Configure environment variables on your platform and deploy both `client` and `server` appropriately.

---

## Troubleshooting & Notes

- If `npm start` fails with `Cannot find module './app'`, ensure an Express app file (commonly `app.js`) exists and exports the app instance. `server.js` currently expects `./app`.
- If image uploads fail, verify Cloudinary credentials and allowed formats.
- If OTP emails fail, verify SMTP credentials and that your SMTP provider allows the connection (Gmail may require app passwords or enabling less secure access).

---

## Contributing

- Run linters and formatters before raising PRs (client uses ESLint).
- Keep secrets out of commits.

---

If you'd like, I can:
- Add a `server/.env.example` file (without secrets),
- Add or fix the missing `app.js` to ensure `npm start` works locally,
- Or split the README into `README.md`, `client/README.md`, and `server/README.md` with more detail.

Tell me which of the above you'd like next.