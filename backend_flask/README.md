# Flask Backend for Instant Care UI

This directory contains a Flask implementation of the API, compatible with the existing HTML frontend.

## Quick Start (Windows PowerShell)

1. Create and activate a virtual environment:

```powershell
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Install dependencies:

```powershell
pip install -r backend_flask/requirements.txt
```

3. Run the server (defaults to port 5000):

```powershell
python backend_flask/app.py
```

4. Open the frontend by double-clicking `html-frontend/index.html` or hosting it via any static server. The frontend is already configured to call `http://localhost:5000/api` when running on localhost.

## Environment Variables (optional)

- `PORT`: Server port (default `5000`)
- `FRONTEND_URL`: Allowed CORS origin (default `http://localhost:8080`)
- `JWT_SECRET`: Secret for signing JWTs (default `dev-secret`)
- `MONGODB_URI`: Mongo connection string (e.g. `mongodb+srv://user:pass@cluster/dbname`)

If `MONGODB_URI` is set and reachable, the API uses MongoDB for persistence; otherwise it falls back to in-memory storage.

## Notes

- This implementation uses in-memory storage for demo purposes. Data resets on restart.
- Endpoints and response shapes match the previous Node/Express API to keep the frontend working.
