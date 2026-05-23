import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen, onConfirm, onCancel,
  title = 'Delete prospect?',
  message = 'This action cannot be undone.',
}) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          key="cbd"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onCancel}
          style={{
            position: 'fixed', inset: 0, zIndex: 110,
            background: 'rgba(10,8,30,0.45)', backdropFilter: 'blur(3px)',
          }}
        />
        <motion.div
          key="cmd"
          initial={{ opacity: 0, scale: 0.93, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93 }}
          transition={{ type: 'spring', damping: 30, stiffness: 360 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 111,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
          }}
        >
          <div style={{
            width: '100%', maxWidth: 380,
            background: '#ffffff', borderRadius: 20,
            boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
            padding: '28px 28px 24px',
            textAlign: 'center',
          }}>
            {/* Icon */}
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: '#fcebeb',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <svg width="26" height="26" fill="none" stroke="#a32d2d" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </div>

            <h2 style={{
              fontSize: 18, fontWeight: 700, color: 'var(--ink)',
              fontFamily: 'var(--font-head)', marginBottom: 8,
            }}>
              {title}
            </h2>
            <p style={{ fontSize: 14, color: 'var(--ink2)', lineHeight: 1.6, marginBottom: 24 }}>
              {message}
            </p>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={onCancel} className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>
                Keep them
              </button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onConfirm}
                className="btn-danger"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Yes, delete
              </motion.button>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);
