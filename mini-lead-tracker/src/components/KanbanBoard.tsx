import React from 'react';
import type { Lead, Stage } from '../types';
import { STAGES } from '../types';
import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  searchQuery: string;
  onMoveLead: (id: string, stage: Stage) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  leads, onEdit, onDelete, searchQuery, onMoveLead,
}) => {
  return (
    <div style={{
      display: 'flex',
      gap: 12,
      overflowX: 'auto',
      paddingBottom: 24,
      paddingTop: 4,
      alignItems: 'flex-start',
      /* Hide scrollbar on Firefox */
      scrollbarWidth: 'thin',
      scrollbarColor: 'rgba(255,255,255,0.08) transparent',
    }}>
      {STAGES.map(stage => (
        <KanbanColumn
          key={stage}
          stage={stage}
          leads={leads.filter(l => l.stage === stage)}
          onEdit={onEdit}
          onDelete={onDelete}
          searchQuery={searchQuery}
          onMoveLead={onMoveLead}
        />
      ))}
    </div>
  );
};
