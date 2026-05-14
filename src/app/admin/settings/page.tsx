'use client';

import React from 'react';
import { Bell, ShieldCheck, Cpu } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Configuration</h1>

      <div className="card glass">
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={20} color="hsl(var(--success))" /> System Mode: Static
        </h2>
        <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Your status page is currently running in <strong>Static Configuration Mode</strong>. 
          Monitors are managed via <code>src/config/monitors.ts</code>.
        </p>

        <div style={{ padding: '1.5rem', background: 'hsl(var(--accent) / 0.2)', borderRadius: '12px', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={18} /> Notifications
          </h3>
          <p style={{ fontSize: '0.85rem' }}>
            To enable Discord notifications, add the following to your <code>.env</code> file:
          </p>
          <pre style={{ 
            background: '#000', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginTop: '0.5rem', 
            fontSize: '0.8rem',
            overflowX: 'auto'
          }}>
            DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."<br/>
            CRON_KEY="your-secret-key"
          </pre>
        </div>

        <div style={{ padding: '1.5rem', background: 'hsl(var(--accent) / 0.2)', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={18} /> Automation
          </h3>
          <p style={{ fontSize: '0.85rem' }}>
            To track uptime and send webhooks, set up a cron job to call:
          </p>
          <code style={{ display: 'block', padding: '0.5rem', background: '#000', borderRadius: '4px', marginTop: '0.5rem', fontSize: '0.8rem' }}>
            GET /api/cron?key=your-secret-key
          </code>
        </div>
      </div>
    </div>
  );
}
