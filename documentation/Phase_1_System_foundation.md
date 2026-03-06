# Phase 1: System Foundation

## Purpose

This document records the full Phase 1 system foundation setup for the Expult Global project. It is meant to serve two purposes:

1. A reference for this current project.
2. A reusable roadmap for setting up a similar full-stack system in the future.

---

## Phase 1 Goal

The goal of Phase 1 was to create a clean and workable foundation for a modern full-stack web application with:

- a **Node.js backend**
- an **Express API layer**
- a **Bootstrap-powered frontend**
- a **Vite development workflow**
- a **root command** to run both frontend and backend together

This phase did **not** focus on business features yet. It focused on structure, tooling, startup flow, and developer convenience.

---

## Final Technology Stack

### Root workspace
- Node.js
- npm
- `concurrently`

### Backend
- Node.js
- Express
- CORS
- dotenv
- nodemon

### Frontend
- Vite
- Bootstrap
- Vanilla JavaScript

---

## Folder Structure

The current project foundation is organized like this:

```text
Expult Global/
├── backend/
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── src/
│   │   ├── main.js
│   │   └── style.css
│   └── dist/
├── documentation/
│   └── Phase_1_System_foundation.md
├── package.json
└── package-lock.json
```

---

## What Was Created

### 1. Root workspace setup

A root `package.json` was created so the project can be controlled from one main entry point.

The root scripts now allow:

- `npm run dev` → start backend and frontend together
- `npm run dev:backend` → start only the backend
- `npm run dev:frontend` → start only the frontend
- `npm start` → start backend in production mode

Root dependency installed:

- `concurrently`

This makes development easier because one command can launch both applications.

---

### 2. Backend setup

The backend was upgraded from a temporary minimal Node server into a proper Express application.

Backend files created or finalized:

- `backend/package.json`
- `backend/server.js`
- `backend/.env.example`

Backend dependencies installed:

- `express`
- `cors`
- `dotenv`

Backend dev dependency installed:

- `nodemon`

Backend scripts:

- `npm run dev` → runs `nodemon server.js`
- `npm start` → runs `node server.js`

Backend routes currently available:

- `GET /` → welcome message
- `GET /api/health` → health check
- `GET /api/company` → basic company/project info

Backend behaviors included:

- JSON response support
- CORS enabled for frontend access
- `.env` support through `dotenv`
- 404 JSON fallback for unknown routes

---

### 3. Frontend setup

The frontend was moved to a proper Vite structure instead of staying as a plain static page.

Frontend files created or finalized:

- `frontend/package.json`
- `frontend/index.html`
- `frontend/src/main.js`
- `frontend/src/style.css`

Frontend dependency installed:

- `bootstrap`

Frontend dev dependency installed:

- `vite`

Frontend scripts:

- `npm run dev` → starts Vite on port `5173`
- `npm run build` → builds production frontend files
- `npm run preview` → previews the production build

Frontend behaviors included:

- Bootstrap CSS and JS imported through npm
- a small starter UI confirming that project setup is complete
- frontend fetch to `http://localhost:5000/api/health`
- visible connection status between frontend and backend

---

## Commands Used During Setup

These are the main commands used to create the current foundation.

### Root

```bash
npm init -y
npm install -D concurrently
```

### Backend

```bash
cd backend
npm init -y
npm install express cors dotenv
npm install -D nodemon
```

### Frontend

```bash
cd frontend
npm init -y
npm install bootstrap
npm install -D vite
```

---

## Why the First Attempt Was Changed

The initial backend scaffold used Node's built-in `http` module and had no real npm-driven development workflow from the root.

That caused two practical issues:

1. It did not match the expected full Node.js project structure.
2. Running `npm run dev` from the project root failed because there was no root `package.json` yet.

The error looked like this in plain terms:

- npm searched for `package.json` in the project root
- it did not find one
- therefore `npm run dev` could not work

This was corrected by:

- creating a root `package.json`
- adding a root `dev` script
- switching the backend to Express
- switching the frontend to Vite + Bootstrap

---

## Issues Encountered and Fixes

### Issue 1: `npm run dev` failed in the root folder

**Cause:** No root `package.json` existed.

**Fix:** Initialize the root project and add root scripts.

---

### Issue 2: The backend was too minimal

**Cause:** The first version used only the built-in `http` module.

**Fix:** Replace it with Express so the backend is ready for real API development.

---

### Issue 3: Frontend was not on a true dev workflow

**Cause:** The first version was a static HTML file using Bootstrap CDN only.

**Fix:** Convert frontend to Vite and install Bootstrap through npm.

---

### Issue 4: Port conflicts during verification

**Cause:** Previous temporary server processes were still using local ports.

**Fix:** Clear the occupied ports and pin Vite development to port `5173`.

---

## Verification Completed

The Phase 1 foundation was verified successfully with the following checks:

1. Diagnostics were run on the project files.
2. Frontend production build was run successfully using Vite.
3. The root dev command was tested successfully.
4. Backend health endpoint responded correctly.
5. Frontend responded correctly in the browser dev server.

Verified results included:

- backend health endpoint returned a successful JSON response
- frontend returned HTTP `200`
- backend started on `http://localhost:5000`
- frontend started on `http://localhost:5173`

---

## Current Run Instructions

From the root project folder:

### Start both frontend and backend

```bash
npm run dev
```

### Start only backend

```bash
npm run dev:backend
```

### Start only frontend

```bash
npm run dev:frontend
```

### Build frontend for production

```bash
cd frontend
npm run build
```

---

## Current API Endpoints

### `GET /`
Returns a welcome message from the backend.

### `GET /api/health`
Used by the frontend to confirm the backend is live.

### `GET /api/company`
Returns a small company/project setup message.

---

## Roadmap Template for Setting Up Another Similar System

Use this exact sequence if you want to create another company system with the same architecture.

### Step 1: Create the main folders

```text
project-root/
├── backend/
├── frontend/
└── documentation/
```

### Step 2: Initialize npm in the root

```bash
npm init -y
npm install -D concurrently
```

### Step 3: Initialize the backend

```bash
cd backend
npm init -y
npm install express cors dotenv
npm install -D nodemon
```

Then create:

- `server.js`
- `.env.example`
- backend scripts for `dev` and `start`

### Step 4: Initialize the frontend

```bash
cd ../frontend
npm init -y
npm install bootstrap
npm install -D vite
```

Then create:

- `index.html`
- `src/main.js`
- `src/style.css`
- frontend scripts for `dev`, `build`, and `preview`

### Step 5: Connect both apps from the root

Add a root `package.json` script similar to:

```json
"dev": "concurrently \"npm run dev --prefix backend\" \"npm run dev --prefix frontend\""
```

### Step 6: Add a backend health endpoint

Always create a route like `/api/health` early. It helps verify that frontend and backend communication works before building real features.

### Step 7: Verify the system

Minimum verification checklist:

- run `npm run build` in the frontend
- run `npm run dev` from the root
- open frontend in browser
- call backend health endpoint
- confirm no port conflicts

---

## Recommended Phase 2

After this foundation, the next phase should be:

- build the **landing page / index page**
- define company sections
- connect frontend text and branding to Expult Global
- expand backend only as needed for contact forms, CMS, or future APIs

---

## Summary

Phase 1 is complete.

The system now has:

- a real root npm workspace
- a proper Express backend
- a Vite + Bootstrap frontend
- one-command local development
- a reusable structure for future projects

This file should be kept as the foundation reference for future system setup work.