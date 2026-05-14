'use client';

import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle, CheckCircle2, Info } from 'lucide-react';

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [monitors, setMonitors] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ 
    title: '', 
    status: 'INVESTIGATING', 
    severity: 'MINOR', 
    message: '',
    monitorId: '' 
  });

  useEffect(() => {
    fetchIncidents();
    fetch('/api/monitors').then(res => res.json()).then(setMonitors);
  }, []);

  const fetchIncidents = async () => {
    const res = await fetch('/api/incidents');
    const data = await res.json();
    setIncidents(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setFormData({ title: '', status: 'INVESTIGATING', severity: 'MINOR', message: '', monitorId: '' });
    setIsAdding(false);
    fetchIncidents();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Incidents</h1>
        <button 
          onClick={() => setIsAdding(!isAdding)} 
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} /> New Incident
        </button>
      </div>

      {isAdding && (
        <div className="card glass" style={{ marginBottom: '2rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label>Incident Title</label>
              <input 
                type="text" 
                placeholder="e.g. Database Connectivity Issues" 
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Status</label>
                <select 
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="INVESTIGATING">Investigating</option>
                  <option value="IDENTIFIED">Identified</option>
                  <option value="MONITORING">Monitoring</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>
              <div className="form-group">
                <label>Severity</label>
                <select 
                  value={formData.severity}
                  onChange={e => setFormData({ ...formData, severity: e.target.value })}
                >
                  <option value="MINOR">Minor</option>
                  <option value="MAJOR">Major</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Affected Service (Optional)</label>
              <select 
                value={formData.monitorId}
                onChange={e => setFormData({ ...formData, monitorId: e.target.value })}
              >
                <option value="">None / All Services</option>
                {monitors.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Initial Message</label>
              <textarea 
                rows={3}
                placeholder="Describe what is happening..." 
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary">Start Incident</button>
              <button type="button" onClick={() => setIsAdding(false)} className="btn btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {incidents.map((incident) => (
          <div key={incident.id} className="card glass">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  {incident.status === 'RESOLVED' ? <CheckCircle2 size={16} color="hsl(var(--success))" /> : <AlertCircle size={16} color="hsl(var(--error))" />}
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{incident.title}</h3>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))' }}>
                  Started {new Date(incident.createdAt).toLocaleString()}
                </p>
              </div>
              <div className={`severity-badge severity-${incident.severity.toLowerCase()}`}>
                {incident.severity}
              </div>
            </div>
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'hsl(var(--accent) / 0.3)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', color: 'hsl(var(--primary))' }}>
                <Info size={14} /> {incident.status}
              </div>
              <p style={{ fontSize: '0.9rem' }}>{incident.updates[0]?.message}</p>
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
        input, select, textarea { 
          padding: 0.75rem; 
          background: hsl(var(--input)); 
          border: 1px solid hsl(var(--border)); 
          border-radius: var(--radius); 
          color: white; 
          outline: none;
          font-family: inherit;
        }
        
        .severity-badge {
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 800;
        }
        .severity-minor { background: hsl(var(--warning) / 0.2); color: hsl(var(--warning)); }
        .severity-major { background: hsl(var(--error) / 0.2); color: hsl(var(--error)); }
        .severity-critical { background: hsl(var(--error)); color: white; }
      `}</style>
    </div>
  );
}
