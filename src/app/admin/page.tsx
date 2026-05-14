'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Globe, Zap, ShieldCheck } from 'lucide-react';
import { MONITORS } from '@/config/monitors';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    checkAll();
    const interval = setInterval(checkAll, 30000); // Every 30s
    return () => clearInterval(interval);
  }, []);

  const checkAll = async () => {
    setLoading(true);
    const results = await Promise.all(
      MONITORS.map(async (m) => {
        try {
          const start = Date.now();
          const res = await fetch(m.url, { mode: 'no-cors' }); // Simple ping
          return { ...m, status: 'UP', latency: Date.now() - start };
        } catch (e) {
          return { ...m, status: 'DOWN', latency: 0 };
        }
      })
    );
    setStats(results);
    setLoading(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Live Console</h1>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div className={`animate-pulse`} style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'hsl(var(--success))' }} />
          <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>Live Monitoring Active</span>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="card glass">
          <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.8rem' }}>Total Nodes</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Globe size={20} color="hsl(var(--primary))" />
            <h3 style={{ fontSize: '1.5rem' }}>{MONITORS.length}</h3>
          </div>
        </div>
        <div className="card glass">
          <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.8rem' }}>Avg Latency</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Zap size={20} color="hsl(var(--warning))" />
            <h3 style={{ fontSize: '1.5rem' }}>
              {stats.length ? Math.round(stats.reduce((acc, curr) => acc + curr.latency, 0) / stats.length) : 0}ms
            </h3>
          </div>
        </div>
        <div className="card glass">
          <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.8rem' }}>Uptime Score</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <ShieldCheck size={20} color="hsl(var(--success))" />
            <h3 style={{ fontSize: '1.5rem' }}>
              {stats.length ? Math.round((stats.filter(s => s.status === 'UP').length / stats.length) * 100) : 0}%
            </h3>
          </div>
        </div>
      </div>

      <section className="card glass">
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={18} /> Network Traffic
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {stats.map(s => (
            <div key={s.url} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid hsl(var(--border))' }}>
              <span style={{ fontWeight: 500 }}>{s.name}</span>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <span style={{ color: s.status === 'UP' ? 'hsl(var(--success))' : 'hsl(var(--error))', fontSize: '0.85rem', fontWeight: 700 }}>
                  {s.status}
                </span>
                <span style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.85rem' }}>{s.latency}ms</span>
              </div>
            </div>
          ))}
          {loading && <p style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>Refreshing data...</p>}
        </div>
      </section>
    </div>
  );
}
