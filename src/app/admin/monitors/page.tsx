'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Globe, ExternalLink } from 'lucide-react';

export default function MonitorsPage() {
  const [monitors, setMonitors] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', url: '', checkInterval: '60' });

  useEffect(() => {
    fetchMonitors();
  }, []);

  const fetchMonitors = async () => {
    const res = await fetch('/api/monitors');
    const data = await res.json();
    setMonitors(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/monitors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setFormData({ name: '', url: '', checkInterval: '60' });
    setIsAdding(false);
    fetchMonitors();
  };

  const deleteMonitor = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/monitors/${id}`, { method: 'DELETE' });
    fetchMonitors();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Monitors</h1>
        <button 
          onClick={() => setIsAdding(!isAdding)} 
          className="btn btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} /> Add Monitor
        </button>
      </div>

      {isAdding && (
        <div className="card glass" style={{ marginBottom: '2rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label>Service Name</label>
              <input 
                type="text" 
                placeholder="e.g. API Server" 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>URL</label>
              <input 
                type="url" 
                placeholder="https://api.example.com/health" 
                value={formData.url}
                onChange={e => setFormData({ ...formData, url: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Check Interval (seconds)</label>
              <input 
                type="number" 
                value={formData.checkInterval}
                onChange={e => setFormData({ ...formData, checkInterval: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary">Create Monitor</button>
              <button type="button" onClick={() => setIsAdding(false)} className="btn btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {monitors.map((monitor) => (
          <div key={monitor.id} className="card glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'hsl(var(--primary) / 0.1)', borderRadius: '8px', color: 'hsl(var(--primary))' }}>
                <Globe size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{monitor.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {monitor.url} <ExternalLink size={12} />
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.25rem' }}>Status</div>
                <div className={`status-badge status-${monitor.status.toLowerCase()}`}>
                  {monitor.status}
                </div>
              </div>
              <button onClick={() => deleteMonitor(monitor.id)} style={{ color: 'hsl(var(--error))', padding: '0.5rem' }}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .btn { padding: 0.6rem 1.2rem; border-radius: var(--radius); font-weight: 600; cursor: pointer; border: none; }
        .btn-primary { background: hsl(var(--primary)); color: white; }
        .btn-secondary { background: hsl(var(--secondary)); color: hsl(var(--foreground)); }
        
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group label { font-size: 0.9rem; font-weight: 500; }
        input { 
          padding: 0.75rem; 
          background: hsl(var(--input)); 
          border: 1px solid hsl(var(--border)); 
          border-radius: var(--radius); 
          color: white; 
          outline: none;
        }
        input:focus { border-color: hsl(var(--primary)); }
        
        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 99px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        .status-up { background: hsl(var(--success) / 0.15); color: hsl(var(--success)); }
        .status-down { background: hsl(var(--error) / 0.15); color: hsl(var(--error)); }
      `}</style>
    </div>
  );
}
