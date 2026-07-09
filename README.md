# Weekly Report Generator & Team Dashboard — Setup Instructions

A full-stack **MERN** application (React + Vite, Node.js/Express, MongoDB) that lets team members submit weekly reports and lets managers view team-wide analytics.

**Stack:** React + Vite · Material UI · Node.js + Express.js · MongoDB + Mongoose · JWT Auth · Recharts

This guide walks a fresh clone through: (1) installing dependencies, (2) running the frontend, (3) running the backend, (4) running the database.

---

## 1. Clone the repository

```bash
git clone https://github.com/LoshiniWelonika/Weekly-Report-Generator.git
cd Weekly-Report-Generator
```

The repo has two main folders:

```
Weekly-Report-Generator/
├── backend/     # Express API + Mongoose models
└── frontend/    # React + Vite client
```

---

## 2. Installing Dependencies

Dependencies are installed **separately** for backend and frontend, since each folder has its own `package.json`.

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

> If either folder is missing a `package-lock.json`, `npm install` will generate one — that's expected on a fresh clone.

---

## 3. Running the Database (MongoDB)

You have two options — pick whichever is easier for you.

### Option A: Local MongoDB
1. Make sure MongoDB Community Server is installed.
2. Start the MongoDB service:
   - **macOS (Homebrew):** `brew services start mongodb-community`
   - **Linux:** `sudo systemctl start mongod`
   - **Windows:** MongoDB usually runs as a service automatically after install; otherwise start `mongod` from the install directory.
3. By default it listens on `mongodb://127.0.0.1:27017`.
4. (Optional) Use **MongoDB Compass** (GUI) to confirm it's running and inspect data: https://www.mongodb.com/products/compass

### Option B: MongoDB Atlas (cloud, no install)
1. Create a free cluster at https://cloud.mongodb.com
2. Under **Database Access**, create a user with a username/password.
3. Under **Network Access**, allow your current IP (or `0.0.0.0/0` for local dev only).
4. Click **Connect → Drivers**, copy the connection string, e.g.:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/weekly-reports?retryWrites=true&w=majority
   ```

You'll paste whichever connection string you choose into the backend's `.env` file (next step).

---

## 4. Configure Environment Variables (Backend)

Inside `backend/`, create a `.env` file (this is **not** committed to the repo, so you must create it yourself):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/weekly-reports
JWT_SECRET=replace_with_a_long_random_string
```

Notes:
- `MONGO_URI` — use the local URI (Option A) or your Atlas connection string (Option B).
- `JWT_SECRET` — any long random string, used to sign login tokens.
- Check `backend/` for a `.env.example` file if one exists — mirror its variable names exactly, as the actual variable names in the code may differ slightly from the example above.

If the frontend needs its own environment file (e.g. to point at a non-default API URL), create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
```
(Check `frontend/src` for how the API base URL is referenced — e.g. `import.meta.env.VITE_API_URL` — and match the variable name used in the code.)

---

## 5. Running the Backend

From the `backend/` folder:

```bash
npm run dev
```

or, if there's no `dev` script:

```bash
npm start
```

This starts the Express API (default `http://localhost:5000`). Watch the terminal for a "MongoDB connected" (or similar) message to confirm step 3–4 worked.

> Tip: open `backend/package.json` and check the `"scripts"` section — use whichever script name is defined there (commonly `dev`, `start`, or `server`).

---

## 6. Running the Frontend

From the `frontend/` folder:

```bash
npm run dev
```

Vite will start a local dev server, typically at:

```
http://localhost:5173
```

Open that URL in your browser. The frontend will call the backend API — make sure the backend (step 5) is running first.

---

## 7. Quick Start (all steps together)

```bash
# Terminal 1 — database (if running locally)
mongod   # or: brew services start mongodb-community

# Terminal 2 — backend
cd backend
npm install
npm run dev

# Terminal 3 — frontend
cd frontend
npm install
npm run dev
```

Then visit **http://localhost:5173** in your browser.

---

## Troubleshooting

- **"MongoNetworkError" / connection refused:** MongoDB isn't running, or `MONGO_URI` in `backend/.env` is wrong.
- **CORS errors in the browser console:** confirm the frontend's API URL matches the port the backend is actually running on.
- **"command not found" for `npm`/`node`:** Node.js isn't installed or isn't on your PATH.
- **Port already in use:** change `PORT` in `backend/.env`, or stop whatever else is using that port.
- **Scripts differ from this guide:** always double-check `"scripts"` in each folder's `package.json` — script names can vary (`dev`, `start`, `server`, `client`, etc.) and this guide's names are best-effort based on typical MERN conventions.

---

## Summary Checklist

- [ ] Node.js & npm installed
- [ ] Repo cloned
- [ ] `npm install` run in `backend/`
- [ ] `npm install` run in `frontend/`
- [ ] MongoDB running (local or Atlas) and connection string set in `backend/.env`
- [ ] `JWT_SECRET` set in `backend/.env`
- [ ] Backend running (`npm run dev` in `backend/`)
- [ ] Frontend running (`npm run dev` in `frontend/`)
- [ ] App loads at `http://localhost:5173`
