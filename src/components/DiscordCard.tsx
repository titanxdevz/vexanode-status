'use client';

import React from 'react';

interface DiscordCardProps {
  status: 'UP' | 'DOWN' | 'RESOLVED' | 'INVESTIGATING';
  title: string;
  subtitle: string;
  content: string;
  affected: string;
  updatedAt: string;
  incidentUrl?: string;
}

const STATUS_CONFIG = {
  UP:           { color: '#23a559', label: 'Operational',    accent: '#23a559' },
  RESOLVED:     { color: '#23a559', label: 'Resolved',       accent: '#23a559' },
  DOWN:         { color: '#f23f43', label: 'Outage',         accent: '#f23f43' },
  INVESTIGATING:{ color: '#f0b232', label: 'Investigating',  accent: '#f0b232' },
} as const;

export const DiscordCard: React.FC<DiscordCardProps> = ({
  status,
  title,
  subtitle,
  content,
  affected,
  updatedAt,
  incidentUrl,
}) => {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.DOWN;

  return (
    <div style={styles.outerContainer}>
      <div style={styles.botHeader}>
        <div style={styles.botAvatar}>
          <div style={styles.avatarInner}>
            <span style={styles.avatarText}>VN</span>
          </div>
        </div>
        <div style={styles.botInfo}>
          <span style={styles.botName}>VexaNode</span>
          <span style={styles.botBadge}>BOT</span>
        </div>
      </div>

      <div style={{ ...styles.embed, borderLeft: `4px solid ${cfg.accent}` }}>
        <div style={styles.embedContent}>
          <div style={styles.headerRow}>
            <span style={{ ...styles.statusDot, background: cfg.accent }} />
            <span style={styles.headerText}>{title}</span>
          </div>

          <div style={styles.mainTitle}>{subtitle}</div>
          <div style={styles.description}>{content}</div>

          <div style={styles.fieldsGrid}>
            <div style={styles.field}>
              <div style={styles.fieldName}>System</div>
              <div style={styles.fieldValue}>{affected}</div>
            </div>
            <div style={styles.field}>
              <div style={styles.fieldName}>Latency</div>
              <div style={styles.fieldValue}>{status === 'UP' ? '24ms' : 'N/A'}</div>
            </div>
            <div style={styles.field}>
              <div style={styles.fieldName}>Status</div>
              <div style={styles.fieldValue}>{cfg.label}</div>
            </div>
          </div>

          {incidentUrl && (
            <div style={styles.actionRow}>
              <a href={incidentUrl} target="_blank" rel="noreferrer" style={styles.button}>
                View Status Page
              </a>
            </div>
          )}

          <div style={styles.footer}>VexaNode Infrastructure</div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  outerContainer: {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    width: '100%',
    maxWidth: '640px',
    background: '#313338',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    border: '1px solid rgba(255,255,255,0.03)',
  },
  botHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  botAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0,
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    background: '#5865f2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: '0.8rem',
    fontWeight: 800,
    letterSpacing: '0.05em',
  },
  botInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  botName: {
    color: '#f2f3f5',
    fontWeight: 700,
    fontSize: '1rem',
    letterSpacing: '-0.01em',
  },
  botBadge: {
    background: '#5865f2',
    color: '#fff',
    fontSize: '0.625rem',
    fontWeight: 800,
    padding: '2px 6px',
    borderRadius: '4px',
    lineHeight: '1',
    letterSpacing: '0.02em',
  },
  embed: {
    background: '#2b2d31',
    borderRadius: '4px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  embedContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '2px',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    display: 'inline-block',
    flexShrink: 0,
  },
  headerText: {
    color: '#949ba4',
    fontWeight: 600,
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  mainTitle: {
    color: '#f2f3f5',
    fontWeight: 800,
    fontSize: '1.35rem',
    lineHeight: '1.2',
    letterSpacing: '-0.02em',
  },
  description: {
    color: '#dbdee1',
    fontSize: '0.95rem',
    lineHeight: '1.4',
    fontWeight: 400,
  },
  fieldsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginTop: '4px',
  },
  field: {
    minWidth: '140px',
    flex: '1 1 0',
  },
  fieldName: {
    color: '#949ba4',
    fontSize: '0.7rem',
    fontWeight: 800,
    textTransform: 'uppercase',
    marginBottom: '6px',
    letterSpacing: '0.05em',
  },
  fieldValue: {
    color: '#f2f3f5',
    fontSize: '0.85rem',
    background: '#1e1f22',
    padding: '6px 10px',
    borderRadius: '4px',
    display: 'inline-block',
    minWidth: '80px',
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontWeight: 600,
  },
  actionRow: {
    marginTop: '4px',
    display: 'flex',
    gap: '8px',
  },
  button: {
    background: '#4b4d54',
    color: '#fff',
    border: 'none',
    borderRadius: '3px',
    fontSize: '0.875rem',
    fontWeight: 600,
    padding: '8px 16px',
    cursor: 'pointer',
    transition: 'background 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    textDecoration: 'none',
  },
  footer: {
    color: '#949ba4',
    fontSize: '0.725rem',
    marginTop: '4px',
    fontWeight: 500,
  },
};
