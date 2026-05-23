import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLeads } from './hooks/useLeads';
import { KanbanBoard } from './components/KanbanBoard';
import { LeadForm } from './components/LeadForm';
import { ConfirmDialog } from './components/ConfirmDialog';
import type { Lead, LeadFormData, Stage } from './types';
import './index.css';

function fmt(v: number) {
  if (v >= 1_000_000) {
    const val = v / 1_000_000;
    return `$${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)}M`;
  }
  if (v >= 1_000) {
    const val = v / 1_000;
    return `$${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)}K`;
  }
  return v === 0 ? '$0' : `$${v.toLocaleString()}`;
}

// The logo SVG from the HTML file
const LogoSVG = () => (
  <svg viewBox="0 0 20 20" width="20" height="20" fill="white">
    <path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v1H2V4zm0 3h16v9a2 2 0 01-2 2H4a2 2 0 01-2-2V7zm4 2a1 1 0 100 2h2a1 1 0 100-2H6zm0 4a1 1 0 100 2h6a1 1 0 100-2H6z"/>
  </svg>
);

export default function App() {
  const {
    leads, pipelineValue,
    searchQuery, setSearchQuery,
    addLead, updateLead, deleteLead, moveLead,
  } = useLeads();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [defaultStage, setDefaultStage] = useState<Stage>('Prospecting');
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);

  const openAdd = (stage?: Stage) => {
    setEditingLead(null);
    setDefaultStage(stage ?? 'Prospecting');
    setIsFormOpen(true);
  };
  const openEdit = (l: Lead) => { setEditingLead(l); setIsFormOpen(true); };
  const closeForm = () => { setIsFormOpen(false); setEditingLead(null); };

  const handleSubmit = (data: LeadFormData) => {
    editingLead ? updateLead(editingLead.id, data) : addLead(data);
  };

  const handleDeleteConfirm = () => {
    if (deletingLead) { deleteLead(deletingLead.id); setDeletingLead(null); }
  };

  const wonLeads = leads.filter(l => l.stage === 'Closed Won').length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>

      {/* ── HEADER ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'rgba(244,243,248,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '0.5px solid rgba(0,0,0,0.1)',
        padding: '12px 28px',
        display: 'flex', alignItems: 'center', gap: 20,
      }}>

        {/* Logo — from HTML file */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{
            width: 36, height: 36, background: 'var(--accent)',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <LogoSVG />
          </div>
          <h1 style={{
            fontSize: 20, fontWeight: 700, letterSpacing: '-0.5px',
            color: 'var(--ink)', fontFamily: 'var(--font-head)',
          }}>
            Lead<span style={{ color: 'var(--accent)' }}>Flow</span>
          </h1>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: 'rgba(0,0,0,0.1)', flexShrink: 0 }} />

        {/* Page title */}
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', flexShrink: 0, letterSpacing: '-0.3px' }}>
          Opportunities
        </div>

        {/* Search */}
        <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
          <svg style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink3)', pointerEvents: 'none' }}
            width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="m21 21-4.35-4.35"/>
          </svg>
          <input
            className="form-input"
            style={{ paddingLeft: 34, paddingRight: searchQuery ? 32 : 12, fontSize: 13, height: 36 }}
            placeholder="Search prospects…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)',
                  width: 18, height: 18, borderRadius: 5, border: 'none', cursor: 'pointer',
                  background: 'rgba(0,0,0,0.08)', color: 'var(--ink3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                }}
              >×</motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Stats pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <StatPill label="Total" value={String(leads.length)} accent />
          <StatPill label="Pipeline" value={fmt(pipelineValue)} color="var(--prospecting-c)" bg="var(--prospecting-bg)" />
          <StatPill label="Won" value={String(wonLeads)} color="var(--won-c)" bg="var(--won-bg)" />
        </div>

        <div style={{ width: 1, height: 24, background: 'rgba(0,0,0,0.1)', flexShrink: 0 }} />

        {/* Add button */}
        <motion.button
          whileHover={{ transform: 'translateY(-1px)', boxShadow: '0 4px 14px rgba(92,79,255,0.35)' }}
          whileTap={{ scale: 0.97 }}
          className="btn-primary"
          style={{ flexShrink: 0 }}
          onClick={() => openAdd()}
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M12 5v14M5 12h14"/>
          </svg>
          Add Lead
        </motion.button>
      </header>

      {/* ── KANBAN BOARD ── */}
      <div style={{ flex: 1, padding: '20px 28px 0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <KanbanBoard
          leads={leads}
          onEdit={openEdit}
          onDelete={setDeletingLead}
          searchQuery={searchQuery}
          onMoveLead={moveLead}
        />
      </div>

      {/* Modals */}
      <LeadForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={handleSubmit}
        initialData={editingLead}
        mode={editingLead ? 'edit' : 'add'}
        defaultStage={defaultStage}
      />
      <ConfirmDialog
        isOpen={!!deletingLead}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingLead(null)}
        message={`This will permanently remove ${deletingLead?.name ?? 'this lead'} from your pipeline.`}
      />
    </div>
  );
}

// Small stat pill for header
const StatPill: React.FC<{ label: string; value: string; accent?: boolean; color?: string; bg?: string }> = ({
  label, value, accent, color, bg,
}) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '5px 12px', borderRadius: 99,
    background: accent ? 'var(--accent-soft)' : (bg ?? 'rgba(0,0,0,0.04)'),
    border: `0.5px solid ${accent ? 'rgba(92,79,255,0.2)' : 'rgba(0,0,0,0.08)'}`,
  }}>
    <span style={{
      fontSize: 11, fontWeight: 600, color: 'var(--ink3)',
      textTransform: 'uppercase', letterSpacing: '0.06em',
    }}>{label}</span>
    <span style={{
      fontSize: 13, fontWeight: 700,
      color: accent ? 'var(--accent)' : (color ?? 'var(--ink)'),
      fontFamily: 'var(--font-mono)',
    }}>{value}</span>
  </div>
);
