import { useState, useEffect, useCallback } from 'react';
import type { Lead, LeadFormData, Stage } from '../types';

const STORAGE_KEY = 'vanta-leads-v1';

function generateId(): string {
  return `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function loadFromStorage(): Lead[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(leads: Lead[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
}

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>(() => loadFromStorage());
  const [activeFilter, setActiveFilter] = useState<Stage | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Persist to localStorage on every change
  useEffect(() => {
    saveToStorage(leads);
  }, [leads]);

  const addLead = useCallback((data: LeadFormData): Lead => {
    const now = new Date().toISOString();
    const newLead: Lead = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    setLeads(prev => [newLead, ...prev]);
    return newLead;
  }, []);

  const updateLead = useCallback((id: string, data: LeadFormData): void => {
    setLeads(prev =>
      prev.map(lead =>
        lead.id === id
          ? { ...lead, ...data, updatedAt: new Date().toISOString() }
          : lead
      )
    );
  }, []);

  const deleteLead = useCallback((id: string): void => {
    setLeads(prev => prev.filter(lead => lead.id !== id));
  }, []);

  const moveLead = useCallback((id: string, stage: Stage): void => {
    setLeads(prev =>
      prev.map(lead =>
        lead.id === id
          ? { ...lead, stage, updatedAt: new Date().toISOString() }
          : lead
      )
    );
  }, []);

  // Stage counts for the top counter bar
  const stageCounts = leads.reduce((acc, lead) => {
    acc[lead.stage] = (acc[lead.stage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Filtered + searched leads
  const filteredLeads = leads.filter(lead => {
    const matchesStage = activeFilter === 'All' || lead.stage === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      lead.name.toLowerCase().includes(q) ||
      lead.company.toLowerCase().includes(q) ||
      lead.email.toLowerCase().includes(q);
    return matchesStage && matchesSearch;
  });

  // Total pipeline value of filtered leads
  const pipelineValue = filteredLeads.reduce((sum, lead) => {
    const v = parseFloat(lead.value.replace(/[^0-9.]/g, '')) || 0;
    return sum + v;
  }, 0);

  return {
    leads,
    filteredLeads,
    stageCounts,
    pipelineValue,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    addLead,
    updateLead,
    deleteLead,
    moveLead,
  };
}
