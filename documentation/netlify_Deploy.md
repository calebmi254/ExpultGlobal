# Netlify Deployment Reference

## Purpose

This document records the deployment preparation done for **Expult Global** so the same setup can be reused later on **Netlify**, **Render**, or another hosting platform.

It explains:

1. what was changed in the codebase
2. why the original Netlify load likely failed
3. how to configure Netlify correctly
4. how to handle the backend separately
5. how to adapt the same project for Render later

---

## Project Structure Relevant to Deployment

This repository is not a single flat frontend app. It has two separate parts:

- `frontend/` → Vite frontend
- `backend/` → Express backend API

That means deployment must treat them as **two deployable units**.

---

## Why Netlify Initially Showed "Page Not Available"

The main cause was likely that Netlify was connected to the repository root, while the actual website entry point is inside `frontend/`.

Important facts:

- the frontend source app lives in `frontend/`
- the production output is generated in `frontend/dist/`
- Netlify only serves static build output unless functions are explicitly configured

So if Netlify was trying to publish the wrong folder, the site would not load correctly.

---

## Changes Made

### 1. Added `netlify.toml`

Created a root-level Netlify configuration file so Netlify knows exactly how to build and publish the frontend.

Configured values:

- base directory: `frontend`
- build command: `npm run build`
- publish directory: `dist`
- node version: `22`
- SPA redirect: `/* -> /index.html`

This makes Netlify treat `frontend/` as the deployable app instead of the repository root.

### 2. Updated frontend API base URL handling

Changed the frontend so production API requests can use a configurable environment variable instead of assuming the backend is served from the same host.

New behavior:

- if `VITE_API_BASE_URL` exists, the frontend uses it
- otherwise, on localhost it falls back to `http://localhost:5000`
- otherwise, it uses an empty string

This is important because the backend is a separate Express server and will usually be deployed on another platform or URL.

### 3. Added `frontend/.env.example`

Created a frontend example environment file containing:

- `VITE_API_BASE_URL=`

This serves as a reminder of the variable required for production deployment.

---

## Files Added or Updated

- `netlify.toml`
- `frontend/src/main.js`
- `frontend/.env.example`

---

## Validation Performed

After the changes, the frontend production build was tested locally.

Command used:

- `npm run build` from `frontend/`

Result:

- build completed successfully
- no diagnostics were reported for the edited files

---

## Correct Netlify Configuration

If Netlify reads `netlify.toml`, no manual dashboard setup should be necessary after pushing the changes.

If manual configuration is needed, use these values:

### Recommended settings

- **Base directory:** `frontend`
- **Build command:** `npm run build`
- **Publish directory:** `dist`

### Alternative equivalent setup

- **Base directory:** leave empty
- **Build command:** `npm run build --prefix frontend`
- **Publish directory:** `frontend/dist`

---

## Netlify Environment Variable Needed

Once the backend is deployed, add this variable in Netlify:

- `VITE_API_BASE_URL=https://your-backend-url`

Example:

- `VITE_API_BASE_URL=https://expult-global-api.onrender.com`

After adding the variable, trigger a new deploy so Vite can bake that value into the frontend build.

---

## Important Deployment Limitation

Netlify in this setup is only hosting the **frontend**.

The following backend-powered features will not work until the Express API is deployed separately:

- contact form
- chatbot endpoints
- automation test drive endpoints
- any server-side MongoDB or email integrations

---

## Backend Deployment Guidance

The backend should be deployed as a separate Node/Express service.

Suitable platforms include:

- Render
- Railway
- another Node-compatible host

For the backend deployment, the key settings are:

- root directory: `backend`
- start command: `npm start`

Backend environment variables should be provided from `backend/.env.example`, including items such as:

- `PORT`
- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `MONGODB_CONTACT_COLLECTION`
- `MONGODB_SIMULATION_COLLECTION`
- `MONGODB_SERVICE_COLLECTION`
- `MONGODB_CHAT_LEAD_COLLECTION`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `RESEND_REPLY_TO_EMAIL`
- `ADMIN_NOTIFICATION_EMAIL`
- `HOT_LEAD_NOTIFICATION_EMAIL`
- `GROQ_API_KEY`
- `GROQ_MODEL`

---

## If Deploying on Render Later

There are two practical options.

### Option 1: Keep frontend on Netlify and deploy backend on Render

This is the simplest approach.

- Netlify hosts the Vite frontend
- Render hosts the Express backend
- Netlify uses `VITE_API_BASE_URL` pointing to the Render backend URL

### Option 2: Move both frontend and backend to Render

Possible setup:

- `frontend/` as a **Render Static Site**
- `backend/` as a **Render Web Service**

If doing this, the same separation still applies:

- frontend build comes from `frontend/`
- backend runs from `backend/`
- frontend must know the backend URL through an environment variable

---

## Recommended Deployment Strategy for This Project

For the current architecture, the cleanest production setup is:

1. deploy `backend/` first on Render
2. copy the Render backend URL
3. set `VITE_API_BASE_URL` in Netlify
4. redeploy Netlify
5. test the site again

This gives a clear separation between static hosting and API hosting.

---

## Future Maintenance Notes

Whenever new frontend code calls the backend, make sure it uses the same configurable API base URL pattern instead of hardcoding a production server address.

Whenever the backend URL changes:

1. update `VITE_API_BASE_URL` in the hosting platform
2. redeploy the frontend

---

## Summary

The project was prepared for Netlify by pointing deployment to the correct frontend app and by making the API base URL configurable.

Netlify can now host the frontend correctly, but a separate backend deployment is still required for dynamic features.

This same structure can be reused later if the backend is deployed on Render or if both frontend and backend are moved to another hosting provider.