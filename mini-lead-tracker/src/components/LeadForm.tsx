import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STAGES, STAGE_CONFIG } from '../types';
import type { Lead, LeadFormData } from '../types';

interface LeadFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeadFormData) => void;
  initialData?: Lead | null;
  mode: 'add' | 'edit';
  defaultStage?: import('../types').Stage;
}

const EMPTY: LeadFormData = { name: '', company: '', email: '', phone: '', stage: 'Prospecting', value: '', notes: '' };

export const LeadForm: React.FC<LeadFormProps> = ({ isOpen, onClose, onSubmit, initialData, mode, defaultStage }) => {
  const [form, setForm] = useState<LeadFormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      const { id: _i, createdAt: _c, updatedAt: _u, ...rest } = initialData;
      setForm(rest);
    } else {
      setForm({ ...EMPTY, stage: defaultStage ?? 'Prospecting' });
    }
    setErrors({});
  }, [isOpen, initialData, defaultStage]);

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.company.trim()) e.company = 'Company is required';
    if (!form.value.trim()) e.value = 'Deal value is required';
    
    if (!form.email.trim() && !form.phone.trim()) {
      e.email = 'Email or phone is required';
      e.phone = 'Email or phone is required';
    } else if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Invalid email';
    }
    
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (validate()) { onSubmit(form); onClose(); }
  };

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    setErrors(prev => {
      const next = { ...prev };
      delete next[name as keyof LeadFormData];
      if (name === 'email' || name === 'phone') {
        if (next.email === 'Email or phone is required') delete next.email;
        if (next.phone === 'Email or phone is required') delete next.phone;
      }
      return next;
    });
  };

  const stageCfg = STAGE_CONFIG[form.stage];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="bd"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 100,
              background: 'rgba(10,8,30,0.45)',
              backdropFilter: 'blur(3px)',
            }}
          />
          {/* Modal */}
          <motion.div
            key="md"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', damping: 28, stiffness: 340 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 101,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
            }}
          >
            <div style={{
              width: '100%', maxWidth: 440, maxHeight: '90vh', overflowY: 'auto',
              background: '#ffffff', borderRadius: 20,
              boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
              padding: '28px 28px 24px',
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
                <h2 style={{
                  fontSize: 18, fontWeight: 700, color: 'var(--ink)',
                  fontFamily: 'var(--font-head)', letterSpacing: '-0.3px',
                }}>
                  {mode === 'add' ? 'Add Prospect' : 'Edit Prospect'}
                </h2>
                <button
                  onClick={onClose}
                  style={{
                    width: 30, height: 30, borderRadius: 8, border: '0.5px solid var(--border2)',
                    background: 'transparent', color: 'var(--ink3)', cursor: 'pointer',
                    fontSize: 17, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >×</button>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Name */}
                <Field label="Name *" error={errors.name}>
                  <input name="name" value={form.name} onChange={set} placeholder="Jane Smith" className="form-input" />
                </Field>
                {/* Company */}
                <Field label="Company *" error={errors.company}>
                  <input name="company" value={form.company} onChange={set} placeholder="Acme Corp" className="form-input" />
                </Field>
                {/* Email + Phone */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Field label="Email (or Phone) *" error={errors.email}>
                    <input name="email" type="email" value={form.email} onChange={set} placeholder="jane@acme.com" className="form-input" />
                  </Field>
                  <Field label="Phone (or Email) *" error={errors.phone}>
                    <input name="phone" value={form.phone} onChange={set} placeholder="+1 555 0100" className="form-input" />
                  </Field>
                </div>
                {/* Stage + Value */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Field label="Stage">
                    <select name="stage" value={form.stage} onChange={set} className="form-input"
                      style={{ color: stageCfg.color }}>
                      {STAGES.map(s => (
                        <option key={s} value={s} style={{ color: STAGE_CONFIG[s].color }}>{s}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Deal Value *" error={errors.value}>
                    <input name="value" value={form.value} onChange={set} placeholder="e.g. $5,000" className="form-input" />
                  </Field>
                </div>
                {/* Notes */}
                <Field label="Notes">
                  <textarea
                    name="notes" value={form.notes} onChange={set}
                    placeholder="Optional notes…" rows={3}
                    className="form-input" style={{ resize: 'vertical', minHeight: 70 }}
                  />
                </Field>

                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                  <button type="button" onClick={onClose} className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>
                    Cancel
                  </button>
                  <motion.button
                    type="submit" whileHover={{ transform: 'translateY(-1px)', boxShadow: '0 4px 14px rgba(92,79,255,0.35)' }} whileTap={{ scale: 0.97 }}
                    className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}
                  >
                    {mode === 'add' ? 'Add Prospect' : 'Save Changes'}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Field: React.FC<{ label: string; error?: string; children: React.ReactNode }> = ({ label, error, children }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{
      display: 'block', fontSize: 11, fontWeight: 600,
      color: 'var(--ink3)', textTransform: 'uppercase',
      letterSpacing: '0.06em', marginBottom: 6,
    }}>
      {label}
    </label>
    {children}
    {error && <span style={{ fontSize: 11, color: '#a32d2d', marginTop: 4, display: 'block' }}>{error}</span>}
  </div>
);
