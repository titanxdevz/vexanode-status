# VexaNode Premium Status

A stunning, high-performance status page built with Next.js and Framer Motion. Zero-database architecture for maximum reliability and ease of deployment.

## ✨ Features

- **Premium UI**: Dark mode, glassmorphism, and smooth Framer Motion animations.
- **Infrastructure Focus**: Designed for high-end hosting and VPS providers.
- **Live Monitoring**: Real-time status checks on every page load.
- **Discord Webhooks**: Automatic notifications for outages using Discord's premium "Components V2" style.
- **Zero Database**: Configuration-driven monitoring with lightweight file-based state tracking.

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file:
```env
DISCORD_WEBHOOK_URL="your-discord-webhook"
CRON_KEY="your-secret-key"
```

### 3. Run
```bash
npm run dev
```

## 🛠️ Configuration

Monitors are managed in `src/config/monitors.ts`. Simply add or remove URLs from the list.

## 🔔 Discord Notifications

To automate notifications, set up a cron job (GitHub Actions, Vercel Cron, or a local crontab) to hit the following endpoint every minute:

`GET http://your-site.com/api/cron?key=your-secret-key`

The system will automatically detect status changes (Up ↔ Down) and send beautifully formatted logs to your Discord channel.
