import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Lead, Stage } from '../types';
import { STAGE_CONFIG } from '../types';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  stage: Stage;
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  searchQuery: string;
  onMoveLead: (id: string, stage: Stage) => void;
}

function fmtTotal(leads: Lead[]): string {
  const total = leads.reduce((sum, l) => {
    const n = parseFloat(l.value.replace(/[^0-9.]/g, '')) || 0;
    return sum + n;
  }, 0);
  if (total === 0) return '';
  if (total >= 1_000_000) {
    const val = total / 1_000_000;
    return `$${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)}M`;
  }
  if (total >= 1_000) {
    const val = total / 1_000;
    return `$${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)}K`;
  }
  return `$${total.toLocaleString()}`;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  stage, leads, onEdit, onDelete, searchQuery, onMoveLead,
}) => {
  const cfg = STAGE_CONFIG[stage];
  const [isDragOver, setIsDragOver] = useState(false);

  const q = searchQuery.toLowerCase();
  const visible = q
    ? leads.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.company.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q)
      )
    : leads;
  const totalStr = fmtTotal(visible);

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        const id = e.dataTransfer.getData('text/plain');
        if (id) {
          onMoveLead(id, stage);
        }
      }}
      style={{
        flexShrink: 0, width: 256,
        display: 'flex', flexDirection: 'column',
        maxHeight: 'calc(100vh - 148px)',
        borderRadius: 12,
        boxShadow: isDragOver ? `0 0 0 2px var(--accent)` : 'none',
        background: isDragOver ? 'rgba(92,79,255,0.04)' : 'transparent',
        transition: 'background 0.18s ease, box-shadow 0.18s ease',
      }}
    >
      {/* Column header */}
      <div style={{
        background: '#fff',
        border: '0.5px solid rgba(0,0,0,0.08)',
        borderBottom: 'none',
        borderRadius: '12px 12px 0 0',
        padding: '12px 14px 10px',
      }}>
        {/* Coloured top line */}
        <div style={{
          height: 3, borderRadius: 99,
          background: cfg.barColor, marginBottom: 10,
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{stage}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              {/* Count badge */}
              <span style={{
                fontSize: 10, fontWeight: 700,
                padding: '2px 8px', borderRadius: 99,
                color: cfg.color, background: cfg.bg,
              }}>
                {visible.length}
              </span>
              {totalStr && (
                <>
                  <span style={{ fontSize: 10, color: 'var(--ink3)' }}>·</span>
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    color: 'var(--ink2)',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {totalStr}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cards scroll area */}
      <div style={{
        flex: 1, overflowY: 'auto',
        background: 'rgba(0,0,0,0.025)',
        border: '0.5px solid rgba(0,0,0,0.08)',
        borderTop: '0.5px solid rgba(0,0,0,0.05)',
        borderRadius: '0 0 12px 12px',
        padding: '10px 10px 14px',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        <AnimatePresence mode="popLayout">
          {visible.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                padding: '28px 12px', textAlign: 'center',
                color: 'var(--ink3)', fontSize: 12,
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                margin: '0 auto 10px',
                border: '1.5px dashed rgba(0,0,0,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--ink3)',
              }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
              </div>
              {q ? 'No matches' : 'No leads yet'}
            </motion.div>
          ) : (
            visible.map((lead, i) => (
              <KanbanCard
                key={lead.id}
                lead={lead}
                index={i}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
