'use client';

import React from 'react';
import { ExternalLink, Hash } from 'lucide-react';

interface DiscordCardProps {
  status: 'UP' | 'DOWN' | 'RESOLVED' | 'INVESTIGATING';
  title: string;
  subtitle: string;
  content: string;
  affected: string;
  updatedAt: string;
  incidentUrl?: string;
}

export const DiscordCard: React.FC<DiscordCardProps> = ({
  status,
  title,
  subtitle,
  content,
  affected,
  updatedAt,
  incidentUrl
}) => {
  const borderColor = status === 'UP' || status === 'RESOLVED' ? '#2ecc71' : '#ff4757';

  return (
    <div className="discord-shell">
      <div className="discord-border" style={{ backgroundColor: borderColor }} />
      <div className="discord-content">
        <div className="discord-top">
          <h3 className="discord-title">{title}</h3>
          {incidentUrl && (
            <a href={incidentUrl} target="_blank" className="discord-action">
              View <ExternalLink size={12} />
            </a>
          )}
        </div>

        <div className="discord-grid">
          <div className="discord-box">
            <span className="discord-label">{subtitle}</span>
            <p className="discord-text">{content}</p>
          </div>
          
          <div className="discord-box">
            <span className="discord-label">Systems Affected</span>
            <p className="discord-text font-mono text-white/60">{affected}</p>
          </div>
        </div>

        <div className="discord-meta">
          <Hash size={12} className="text-white/20" />
          <span>Automated Alert • {updatedAt}</span>
        </div>
      </div>

      <style jsx>{`
        .discord-shell {
          background: #1e1f22;
          border-radius: 8px;
          display: flex;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.03);
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
          width: 100%;
          max-width: 700px;
        }
        @media (max-width: 640px) {
          .discord-content {
            padding: 14px 16px;
          }
          .discord-title {
            font-size: 14px;
          }
          .discord-text {
            font-size: 13px;
          }
        }
        .discord-border {
          width: 4px;
          flex-shrink: 0;
        }
        .discord-content {
          padding: 18px 24px;
          flex: 1;
        }
        .discord-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .discord-title {
          color: #00a8fc;
          font-size: 16px;
          font-weight: 700;
          margin: 0;
          font-family: 'Inter', sans-serif;
        }
        .discord-action {
          color: #dbdee1;
          background: #2b2d31;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 12px;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px;
          border: 1px solid #313338;
          transition: background 0.2s;
        }
        .discord-action:hover { background: #35373c; }
        
        .discord-grid {
          display: grid;
          gap: 16px;
        }
        .discord-label {
          color: #f2f3f5;
          font-size: 13px;
          font-weight: 800;
          display: block;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .discord-text {
          color: #dbdee1;
          font-size: 14px;
          line-height: 1.5;
          margin: 0;
        }
        .discord-meta {
          margin-top: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #949ba4;
          font-size: 11px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};
