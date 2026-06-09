# VexaNode Status

Real-time infrastructure monitoring for VexaNode services. Built with Next.js, Framer Motion, and styled with the VexaNode brand identity.

## Features

- Live status monitoring with real-time checks
- VexaNode brand UI (dark theme, cyan/blue accents, Orbitron typography)
- Animated status indicators and sparkline uptime bars
- JSON API endpoints for external consumers
- Zero database — lightweight in-memory monitoring

## Quick Start

```bash
npm install
npm run dev
```

## Configuration

Edit `src/config/monitors.ts` to add/remove monitored services.

## API Endpoints

### `GET /api/status`
Returns live status for all configured monitors as JSON.

```json
{
  "success": true,
  "timestamp": "2026-06-09T12:00:00.000Z",
  "summary": {
    "total": 5,
    "online": 5,
    "offline": 0,
    "avgLatency": 24,
    "availability": 100
  },
  "results": [
    { "name": "Main Website", "url": "vexanode.cloud", "status": "UP", "latency": 24, "checkedAt": "..." }
  ]
}
```

### `GET /api/cron`
Internal endpoint that checks all monitors and returns results. Useful for cron-based automation.

### `POST /api/ping`
Pings a single URL. Body: `{ "url": "https://example.com" }`. Returns `{ "status": "UP", "latency": 42 }`.

## Cron Automation

Set up a cron job to hit `/api/cron` every 60 seconds for continuous monitoring:

```
* * * * * curl https://your-status-page.vercel.app/api/cron
```
