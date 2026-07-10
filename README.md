# Institutional Deal Terminal

Clean light-mode financial data terminal built with React, Tailwind CSS, and Vite.

## Run Locally

```bash
npm install
npm run dev
```

The Vite server defaults to `http://localhost:5173`.

## API Wiring

The terminal renders deterministic fallback data when API variables are absent. To connect the live FastAPI/Railway backend, add:

```bash
VITE_API_BASE_URL=https://your-railway-service.up.railway.app
VITE_SNAPSHOT_PATH=/api/terminal/snapshot
VITE_STREAM_PATH=/api/terminal/stream
```

Snapshot responses and stream frames can send:

```json
{
  "rows": [],
  "metrics": {}
}
```

The stream adapter uses `EventSource` for Server-Sent Events and keeps the terminal connected state visible in the header and toolbar.
