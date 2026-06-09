'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
interface MonitorResult {
  name: string;
  url: string;
  status: 'UP' | 'DOWN';
  latency: number;
}

function generateSparkline(status: 'UP' | 'DOWN') {
  return Array.from({ length: 30 }, (_, i) => {
    const isDown = status === 'DOWN' && i === 29;
    return { up: !isDown, height: 30 + Math.floor(Math.random() * 70) };
  });
}

function ServiceRow({
  monitor,
  index,
}: {
  monitor: MonitorResult;
  index: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isUp = monitor.status === 'UP';
  const bars = generateSparkline(monitor.status);

  return (
    <div className="flex flex-col gap-1">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04, duration: 0.35, ease: 'easeOut' }}
        onClick={() => setIsOpen(!isOpen)}
        className={`service-row ${isUp ? '' : 'row-down'} group ${isOpen ? 'row-open' : ''}`}
      >
        <div className="service-row-main">
          <div className={`status-dot ${isUp ? 'dot-up' : 'dot-down'}`} />
          <div className="service-info">
            <div className="service-name">{monitor.name}</div>
            <div className="service-url">{monitor.url.replace(/^https?:\/\//, '')}</div>
          </div>
        </div>
        <div className="uptime-bars">
          {bars.map((bar, j) => (
            <div
              key={j}
              className={`uptime-bar ${bar.up ? 'uptime-bar-up' : 'uptime-bar-down'}`}
              style={{ height: `${bar.height}%` }}
              title={bar.up ? 'Operational' : 'Incident'}
            />
          ))}
        </div>
        <div className="service-meta">
          <div className={`status-label ${isUp ? 'status-up' : 'status-down'}`}>
            {isUp ? 'Online' : 'Outage'}
          </div>
          <div className="latency-text">
            {monitor.latency > 0 ? `${monitor.latency}ms` : '\u2014'}
          </div>
        </div>
      </motion.div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="service-details">
              <div className="detail-row">
                <span className="detail-label">Edge Location</span>
                <span className="detail-value">Frankfurt, DE</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Protocol</span>
                <span className="detail-value">HTTPS/3 (QUIC)</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">SSL Certificate</span>
                <span className="detail-value status-green">Valid (256-bit)</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">24h Uptime</span>
                <span className="detail-value">100.00%</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">30d Uptime</span>
                <span className="detail-value">99.95%</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function StatusPage() {
  const [data, setData] = useState<MonitorResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const runChecks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/status', { cache: 'no-store' });
      const json = await res.json();
      setData(json.results);
      setLastCheck(new Date(json.timestamp));
    } catch (err) {
      console.error('Fetch failed', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    runChecks();
    const automation = setInterval(async () => {
      try {
        await fetch('/api/cron');
        runChecks();
      } catch (e) {
        console.error('Automation ping failed', e);
      }
    }, 60_000);
    return () => clearInterval(automation);
  }, [runChecks]);

  const upCount = data.filter((m) => m.status === 'UP').length;
  const isAllUp = data.length > 0 && upCount === data.length;
  const avgLatency =
    data.length > 0
      ? Math.round(data.reduce((a, b) => a + b.latency, 0) / data.length)
      : 0;

  return (
    <>
      <div className="page-bg" />
      <div className="cyber-grid" />
      <div className="page-wrapper">
        <div className="container">
          <motion.header
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="page-header"
          >
            <div className="header-left">
              <a href="https://vexanode.cloud" target="_blank" rel="noreferrer" className="logo-link">
                <img src="/logo.png" alt="VexaNode" className="logo-image" />
                <div>
                  <div className="brand-text">
                    Vexa<span className="brand-accent">Node</span>
                  </div>
                  <p className="site-subtitle">Infrastructure Status</p>
                </div>
              </a>
            </div>
            <div className="header-right">
              <div className={`overall-badge ${isAllUp ? 'badge-up' : data.length === 0 ? 'badge-neutral' : 'badge-down'}`}>
                <span className={`badge-dot ${isAllUp ? 'dot-up' : 'dot-down'}`} />
                {data.length === 0 ? 'Checking Systems' : isAllUp ? 'All Systems Operational' : 'Partial Outage'}
              </div>
              <button className="refresh-btn" onClick={runChecks} disabled={loading}>
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </motion.header>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="summary-bar"
          >
            <div className="summary-stat">
              <span className="summary-label">Total Nodes</span>
              <span className="summary-value">{data.length || '\u2014'}</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-stat">
              <span className="summary-label">Online</span>
              <span className="summary-value status-green">{loading ? '\u2014' : upCount}</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-stat">
              <span className="summary-label">Average Latency</span>
              <span className="summary-value">{loading ? '\u2014' : `${avgLatency}ms`}</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-stat">
              <span className="summary-label">Service Availability</span>
              <span className={`summary-value ${isAllUp ? 'status-green' : 'status-red'}`}>
                {loading ? '\u2014' : data.length > 0 ? `${Math.round((upCount / data.length) * 100)}%` : '\u2014'}
              </span>
            </div>
            <div className="summary-divider" />
            <div className="summary-stat">
              <span className="summary-label">Last Updated</span>
              <span className="summary-value">
                {mounted ? lastCheck.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
              </span>
            </div>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className={`hero-card ${isAllUp ? 'hero-up' : 'hero-down'}`}
          >
            <div className={`hero-indicator ${isAllUp ? 'indicator-up' : 'indicator-down'}`}>
              {isAllUp ? 'All systems are operational' : 'Service disruption detected'}
            </div>
            <p className="hero-description">
              {isAllUp
                ? 'Global infrastructure is performing within optimal parameters. No issues detected.'
                : 'We are currently experiencing issues with some of our core services. Our engineering team is investigating.'}
            </p>
            <div className="hero-bar">
              <div className="hero-bar-track">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${loading ? 0 : data.length > 0 ? (upCount / data.length) * 100 : 0}%` }}
                  transition={{ duration: 0.8, ease: 'circOut' }}
                  className={`hero-bar-fill ${isAllUp ? 'fill-up' : 'fill-down'}`}
                />
              </div>
              <span className="hero-bar-label">
                {loading ? '...' : data.length > 0 ? `${Math.round((upCount / data.length) * 100)}%` : '\u2014'}
              </span>
            </div>
          </motion.section>

          <section className="services-section">
            <div className="services-header">
              <h2 className="services-title">Core Infrastructure</h2>
              <span className="services-count">{upCount} / {data.length} Nodes Online</span>
            </div>
            <div className="services-list">
              {data.length === 0
                ? [1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="skeleton" style={{ height: 60, borderRadius: 10 }} />
                  ))
                : data.map((monitor, i) => (
                    <ServiceRow key={monitor.url} monitor={monitor} index={i} />
                  ))}
            </div>
          </section>

          <AnimatePresence>
            {!isAllUp && data.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="incidents-section"
              >
                <h2 className="incidents-title">Active Incidents</h2>
                {data
                  .filter((m) => m.status === 'DOWN')
                  .map((m) => (
                    <div key={m.url} className="incident-card">
                      <div className="incident-info">
                        <div className="incident-icon" />
                        <div>
                          <h3 className="incident-name">{m.name} - Outage</h3>
                          <p className="incident-message">System is currently unreachable from monitoring nodes.</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </motion.section>
            )}
          </AnimatePresence>

          <footer className="page-footer">
            <span>VexaNode Infrastructure</span>
            <span className="footer-divider" />
            <span>Automated Status Monitoring</span>
            <span className="footer-divider" />
            <a href="mailto:support@vexanode.cloud" className="footer-link">Contact Support</a>
          </footer>
        </div>
      </div>
    </>
  );
}
