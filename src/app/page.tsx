'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MONITORS } from '@/config/monitors';
import { DiscordCard } from '@/components/DiscordCard';
import { 
  CheckCircle, 
  AlertCircle, 
  Activity, 
  Clock, 
  Shield, 
  RefreshCcw, 
  ArrowUpRight,
  Server,
  Network
} from 'lucide-react';

async function fetchStatus(url: string) {
  const start = Date.now();
  try {
    const res = await fetch(url, { cache: 'no-store' });
    return {
      status: res.status >= 200 && res.status < 400 ? 'UP' : 'DOWN',
      latency: Date.now() - start,
    };
  } catch (e) {
    return { status: 'DOWN', latency: 0 };
  }
}

export default function StatusPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState(new Date());

  const runChecks = async () => {
    setLoading(true);
    const results = await Promise.all(
      MONITORS.map(async (m) => ({ ...m, ...(await fetchStatus(m.url)) }))
    );
    setData(results);
    setLoading(false);
    setLastCheck(new Date());
  };

  useEffect(() => {
    runChecks();
    const interval = setInterval(runChecks, 60000);
    return () => clearInterval(interval);
  }, []);

  const isAllUp = data.length > 0 && data.every(m => m.status === 'UP');
  const avgLatency = data.length > 0 ? Math.round(data.reduce((a, b) => a + b.latency, 0) / data.length) : 0;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30">
      <main className="container max-w-4xl">
        
        {/* Top Navigation */}
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Shield className="text-black" size={18} />
            </div>
            <span className="font-bold text-lg tracking-tight">VexaNode Status</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-muted-dark rounded-full border border-card-border">
              <div className={`status-dot ${isAllUp ? 'dot-up' : 'dot-down'}`} />
              <span className="text-[11px] font-bold tracking-widest uppercase">System Live</span>
            </div>
          </div>
        </nav>

        {/* Hero Status Card */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-10 p-card mb-8 relative overflow-hidden ${isAllUp ? 'glow-success' : 'glow-error'}`}
        >
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <h1 className="text-4xl font-extrabold mb-3 tracking-tight">
                {isAllUp ? 'All systems are functional.' : 'Partial system disruption.'}
              </h1>
              <p className="text-muted text-lg max-w-md">
                {isAllUp 
                  ? 'Infrastructure is operating at peak performance across all global nodes.'
                  : 'We are currently investigating issues with some of our network interfaces.'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={runChecks} 
                className="btn-p"
                disabled={loading}
              >
                <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
                Refresh System
              </button>
            </div>
          </div>
          {/* Subtle Background Pattern */}
          <div className="absolute top-0 right-0 opacity-10 p-4 pointer-events-none">
            <Activity size={120} />
          </div>
        </motion.section>

        {/* Global Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            { label: 'Uptime', value: '99.99%', sub: 'Last 30 days', icon: CheckCircle, color: 'text-success' },
            { label: 'Latency', value: `${avgLatency}ms`, sub: 'Global average', icon: Network, color: 'text-primary' },
            { label: 'Last Check', value: lastCheck.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), sub: 'Auto-refresh on', icon: Clock, color: 'text-muted' },
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-card p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <item.icon size={16} className="text-muted" />
                <span className="text-[11px] font-bold tracking-widest uppercase text-muted">{item.label}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{item.value}</span>
                <span className="text-[10px] text-muted font-medium">{item.sub}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detailed Service List */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Server size={18} className="text-muted" />
            <h2 className="text-sm font-bold tracking-widest uppercase text-muted">Core Infrastructure</h2>
          </div>
          
          <div className="grid gap-3">
            {data.length === 0 ? (
              [1, 2, 3, 4].map(i => <div key={i} className="h-20 p-card animate-pulse bg-muted-dark" />)
            ) : (
              data.map((monitor, i) => (
                <motion.div 
                  key={monitor.url}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-card p-5 group flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div className="flex items-center gap-5">
                    <div className={`status-dot ${monitor.status === 'UP' ? 'dot-up' : 'dot-down'}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-lg">{monitor.name}</h4>
                        <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted" />
                      </div>
                      <p className="text-xs text-muted font-mono">{monitor.url}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8 w-full md:w-auto">
                    {/* Compact Mini Graph */}
                    <div className="hidden sm:flex gap-1 items-end h-6">
                      {[...Array(24)].map((_, j) => (
                        <div 
                          key={j} 
                          className={`w-[2px] rounded-full transition-all ${monitor.status === 'UP' ? 'bg-success/30' : 'bg-error/30'}`}
                          style={{ height: `${20 + Math.random() * 80}%` }}
                        />
                      ))}
                    </div>
                    
                    <div className="text-right ml-auto md:ml-0">
                      <div className={`text-xs font-black tracking-widest uppercase ${monitor.status === 'UP' ? 'text-success' : 'text-error'}`}>
                        {monitor.status === 'UP' ? 'Operational' : 'Outage'}
                      </div>
                      <div className="text-[10px] font-mono text-muted">{monitor.latency}ms</div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* Incidents Section (If any down) */}
        <AnimatePresence>
          {!isAllUp && data.length > 0 && (
            <motion.section 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mt-20 border-t border-card-border pt-12"
            >
              <div className="flex items-center gap-3 mb-8">
                <AlertCircle size={18} className="text-error" />
                <h2 className="text-sm font-bold tracking-widest uppercase text-error">Incident Reports</h2>
              </div>
              <div className="grid gap-6">
                {data.filter(m => m.status === 'DOWN').map(m => (
                  <DiscordCard 
                    key={m.url}
                    status="DOWN"
                    title={`${m.name} Outage Detected`}
                    subtitle="System Investigation"
                    content={`Automated monitoring has flagged ${m.name} as unreachable. Our network operations center is performing diagnostics to resolve this interruption.`}
                    affected={m.name}
                    updatedAt="Just now"
                  />
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Professional Footer */}
        <footer className="mt-40 mb-20 text-center border-t border-card-border pt-10">
          <div className="flex justify-center gap-10 mb-8">
            {['Twitter', 'Docs', 'Support', 'Contact'].map(link => (
              <a key={link} href="#" className="text-xs font-bold tracking-widest uppercase text-muted hover:text-white transition-colors">{link}</a>
            ))}
          </div>
          <p className="text-[10px] font-mono text-muted uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} VexaNode Infrastructure • Advanced Monitoring v2.0
          </p>
        </footer>
      </main>
    </div>
  );
}
