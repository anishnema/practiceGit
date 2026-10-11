# Calculator

A small calculator with a React frontend and a Python (FastAPI) backend. They talk over HTTP. Right now only **addition** is implemented: two numbers in, one sum out.

```
frontend (React / Vite, http://localhost:5173)
        │  POST /add
        ▼
backend (FastAPI, http://127.0.0.1:8000)
```

## Prerequisites

- Python 3.9+
- Node.js 18+ (and npm)

## Running the server

From the repo root:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --host 127.0.0.1 --port 8000
```

The API is available at `http://127.0.0.1:8000`.

Quick checks:

```bash
curl http://127.0.0.1:8000/health
curl -X POST http://127.0.0.1:8000/add \
  -H "Content-Type: application/json" \
  -d '{"a": 12.5, "b": 7.5}'
```

Expected: `{"status":"ok"}` and `{"result":20.0}`.

## Running the client

Open a second terminal from the repo root:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in a browser. Enter two numbers and click **Add**.

In development, Vite proxies `POST /add` to the backend on port 8000. Keep the server running while you use the UI.

Optional: to call the API at a different origin, set `VITE_API_BASE` (for example `http://127.0.0.1:8000`) before starting the frontend.

## Contributing

Contributions are welcome, especially the remaining arithmetic operations.

### Project layout

| Path | Role |
|------|------|
| `backend/app.py` | HTTP API (FastAPI) |
| `backend/requirements.txt` | Python dependencies |
| `frontend/src/App.jsx` | Calculator UI and API calls |
| `frontend/vite.config.js` | Dev server and `/add` proxy |

### Adding subtraction, multiplication, or division

1. **Backend** — In `backend/app.py`, add a request model (two floats) and a `POST` route that returns `{ "result": ... }`. For division, reject a zero divisor with a `400` response.
2. **Frontend proxy** — In `frontend/vite.config.js`, proxy the new path (for example `/subtract`) to `http://127.0.0.1:8000`, same as `/add`.
3. **UI** — In `frontend/src/App.jsx`, add a button that `POST`s `{ a, b }` as JSON to the new endpoint and shows `result` or the error.
4. **CORS** — If the frontend is not using the Vite proxy, add its origin to `allow_origins` in `backend/app.py`.

Keep each operation as its own endpoint so the UI can grow without changing existing addition behavior.

### Suggested workflow

1. Create a branch from the latest `main`.
2. Make a focused change (one operation or one bug fix).
3. Smoke-test: hit the new endpoint with `curl`, then exercise it in the browser at `http://localhost:5173`.
4. Open a pull request that describes what you added and how you tested it.

### API conventions

- Method: `POST`
- Body: JSON `{ "a": <number>, "b": <number> }`
- Success: `{ "result": <number> }`
- Failure: HTTP `400` with `{ "detail": "<message>" }`
