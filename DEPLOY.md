# Deploying to GitHub + Vercel

This project has two parts: the **client** (Vite + React) and the **server** (Express API). You can either deploy them as two separate Vercel projects (client + server) or deploy as a single project (server-root) — both are supported. Below are steps for both approaches.

Steps

1. Push the repo to GitHub
   - Create a new repo on GitHub and push all files.

2. Create a Vercel project for the server
   - In the Vercel dashboard, click "New Project" → Import Git Repository.
   - In the **Root Directory** field, set `/server`.
   - Framework Preset: `Other` (Vercel will detect Node functions automatically).
   - Set Environment Variables for the Server (see list below).
   - Deploy.

3. Create a Vercel project for the client
   - In the Vercel dashboard, click "New Project" → Import Git Repository.
   - In the **Root Directory** field, set `/client`.
   - Framework Preset: `Vite` (Vercel detects it and uses `npm run build`).
   - Set Environment Variables for the Client (see list below).
   - Deploy.

4. After the server is deployed, set the client `VITE_API_URL` to the server URL
   - Example: `https://your-server-project.vercel.app/api`
   - Make sure to include the `/api` path because the server routes are mounted at `/api/*`.

Environment variables

- Server (add these in the Server project settings on Vercel):
  - `MONGO_URI` — MongoDB connection string
  - `JWT_SECRET` — JWT signing secret
  - `CLIENT_URL` — Production client URL (e.g., `https://your-client-project.vercel.app`)
  - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (if used)
  - `MAIL_USER`, `MAIL_PASS` (if email feature is used)

- Client (add these in the Client project settings on Vercel):
  - `VITE_API_URL` — set to `https://your-server-project.vercel.app/api`

Single-project deploy (one Vercel project)

1. Choose the **server** as the project root in Vercel (set **Root Directory** to `/server`).
2. In Vercel project settings, set the **Build Command** to:

```
npm run vercel-build
```

This will run the `vercel-build` script in `server/package.json`, which builds the client and copies the compiled `dist` into `server/public`.

3. In Vercel project settings, you do not need to set an Output Directory — the static files will be available from `/` because they're copied into `server/public` and Vercel serves `public/`.

4. Environment variables (Server project): set `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` (for CORS). Set `CLIENT_URL` to your final Vercel client URL (for single-project deploy this will be the same Vercel project URL).

5. Deploy. The client will be served as static files and the API will be available under `/api/*`.

Notes and tips

- The Express app is exported from `server/app.js` and `server/api/index.js` exposes it to Vercel functions. `server/server.js` still allows running the server locally with `npm start`.
- Cookies: the client uses `withCredentials: true` and the server is configured with `credentials: true`. Make sure the `CLIENT_URL` variable in server project points to your deployed client URL.
- Local testing: you can run the server locally with `cd server && npm start` and the client with `cd client && npm run dev`.

Example `vercel.json` (optional)

For the server project you can add a `vercel.json` to tweak function limits, e.g.:

```
{
  "functions": {
    "api/**/*.js": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

With this, your app should deploy successfully on Vercel. If you want, I can:

- push these changes and open a PR
- create a GitHub Actions CI for linting/build checks
