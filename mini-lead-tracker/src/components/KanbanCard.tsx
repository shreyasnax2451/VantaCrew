import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Lead } from '../types';
import { STAGE_CONFIG, AVATAR_PALETTE } from '../types';

interface KanbanCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  index: number;
}

function fmtVal(v: string) {
  if (!v) return null;
  const n = parseFloat(v.replace(/[^0-9.]/g, ''));
  if (isNaN(n)) return null;
  if (n >= 1_000_000) {
    const val = n / 1_000_000;
    return `$${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)}M`;
  }
  if (n >= 1_000) {
    const val = n / 1_000;
    return `$${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)}K`;
  }
  return `$${n.toLocaleString()}`;
}

function ago(iso: string) {
  const d = Date.now() - new Date(iso).getTime();
  const m = Math.floor(d / 60000), h = Math.floor(d / 3600000), dy = Math.floor(d / 86400000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${dy}d ago`;
}

function initials(name: string) {
  return name.trim().split(/\s+/).map(w => w[0] ?? '').slice(0, 2).join('').toUpperCase() || '?';
}

function avatarColors(name: string): [string, string] {
  return AVATAR_PALETTE[name.charCodeAt(0) % AVATAR_PALETTE.length];
}

// SVG icons
const IconEdit = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
  </svg>
);
const IconTrash = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
  </svg>
);

export const KanbanCard: React.FC<KanbanCardProps> = ({ lead, onEdit, onDelete, index }) => {
  const cfg = STAGE_CONFIG[lead.stage];
  const [avBg, avColor] = avatarColors(lead.name);
  const dealVal = fmtVal(lead.value);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.04, 0.22) }}
      draggable
      onDragStart={(e: any) => {
        e.dataTransfer.setData('text/plain', lead.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        background: '#ffffff',
        border: '0.5px solid rgba(0,0,0,0.08)',
        borderRadius: 12,
        padding: '12px 14px',
        cursor: 'grab',
        boxShadow: hovered ? 'var(--shadow-hover)' : 'var(--shadow)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'box-shadow 0.18s ease, transform 0.18s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Stage colour top bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2.5,
        background: cfg.barColor, borderRadius: '12px 12px 0 0',
        opacity: 0.85,
      }} />

      {/* Header: name + actions */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 4 }}>
        {/* Avatar */}
        <div style={{
          width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
          background: avBg, color: avColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700,
        }}>
          {initials(lead.name)}
        </div>

        {/* Name + company */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13, fontWeight: 700, color: 'var(--ink)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3,
          }}>
            {lead.name}
          </div>
          {lead.company && (
            <div style={{
              fontSize: 11, color: 'var(--ink3)', marginTop: 2,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {lead.company}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          <button
            className="btn-icon"
            onClick={e => { e.stopPropagation(); onEdit(lead); }}
            title="Edit"
          >
            <IconEdit />
          </button>
          <button
            className="btn-icon danger"
            onClick={e => { e.stopPropagation(); onDelete(lead); }}
            title="Delete"
          >
            <IconTrash />
          </button>
        </div>
      </div>

      {/* Notes */}
      {lead.notes && (
        <div style={{
          marginTop: 10, fontSize: 11, color: 'var(--ink2)',
          background: 'var(--surface)', borderRadius: 7, padding: '6px 8px',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          lineHeight: 1.5,
        }}>
          {lead.notes}
        </div>
      )}

      {/* Footer: deal value + date */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
        {dealVal ? (
          <span style={{
            fontSize: 13, fontWeight: 700, color: 'var(--ink)',
            fontFamily: 'var(--font-mono)',
          }}>
            {dealVal}
          </span>
        ) : <span />}
        <span style={{ fontSize: 10, color: 'var(--ink3)', fontFamily: 'var(--font-mono)' }}>
          {ago(lead.createdAt)}
        </span>
      </div>

      {/* Stage badge */}
      <div style={{ marginTop: 8 }}>
        <span style={{
          display: 'inline-block',
          padding: '3px 10px', borderRadius: 20,
          fontSize: 10, fontWeight: 600, letterSpacing: '0.04em',
          color: cfg.color, background: cfg.bg,
        }}>
          {lead.stage}
        </span>
      </div>
    </motion.div>
  );
};
