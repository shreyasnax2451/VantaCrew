# VantaCrew · Mini Lead Tracker

A premium, single-page sales prospect management app built as part of the VantaCrew Builder Onboarding task.

---

## 🚀 Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **React 19 + Vite** | Fast HMR, minimal config, industry standard |
| Language | **TypeScript** | Self-documenting types, fewer runtime bugs |
| Styling | **TailwindCSS v3** | Utility-first, rapid iteration |
| Animation | **Framer Motion** | Production-grade spring physics animations |
| Persistence | **localStorage** | Zero backend, instant data survival across refreshes |

---

## ✦ Features

- ✅ **Add / Edit / Delete** prospects with animated modal
- ✅ **Delete confirmation** dialog (accidental delete protection)
- ✅ **Native Drag & Drop Kanban Board** — smoothly move prospects between stages
- ✅ **Live search** by name, company, or email
- ✅ **Per-column counters** that update in real time
- ✅ **Pipeline value** calculated from filtered leads
- ✅ **localStorage persistence** — data survives browser refresh
- ✅ **Responsive** — works on mobile and desktop
- ✅ **Empty states** with contextual messages

---

## 🏗 Architectural Decisions

### 1. `useLeads` Custom Hook — Single Source of Truth

**Decision:** All lead state, CRUD operations, filtering, search, and localStorage sync live inside a single custom hook (`src/hooks/useLeads.ts`).

**Why:** Separating business logic from UI components makes the app far easier to test, extend, or swap out. The `App.tsx` component becomes a pure orchestration layer — it only decides *what to render*, never *how data behaves*.

**Alternative considered:** React Context + useReducer. Rejected for this scale — overkill for a single-page tracker without deeply nested consumers.

---

### 2. Stage Config as a Data-Driven Map

**Decision:** All stage styling (colors, backgrounds, borders, dot indicators) lives in a single `STAGE_CONFIG` object in `types.ts`.

**Why:** Adding a new stage only requires one edit in one place — no hunting through components. Every component that uses stage colors reads from this single source, keeping the design 100% consistent.

**Alternative considered:** Hardcoded class strings per stage (e.g., Tailwind conditional classes). Rejected because Tailwind purges dynamic class names unless safelist-configured.

---

### 3. Framer Motion `AnimatePresence` with `mode="popLayout"`

**Decision:** Lead cards use `AnimatePresence` with `layout` prop and `mode="popLayout"`.

**Why:** When a lead is deleted or filtered out, other cards smoothly slide into the new positions instead of snapping. This makes the app feel alive and polished — a meaningful UX upgrade with minimal extra code.

**Alternative considered:** CSS transitions only. Rejected because coordinating layout shift + opacity + y-translate simultaneously in pure CSS requires complex keyframes and doesn't handle dynamic list reordering naturally.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── KanbanBoard.tsx    # Kanban layout orchestration
│   ├── KanbanColumn.tsx   # Droppable columns + empty states
│   ├── KanbanCard.tsx     # Draggable individual lead card
│   ├── LeadForm.tsx       # Add/edit modal with validation
│   └── ConfirmDialog.tsx  # Delete confirmation modal
├── hooks/
│   └── useLeads.ts        # All lead logic (CRUD, filter, search, persist)
├── types.ts               # Lead interface, Stage type, STAGE_CONFIG
├── App.tsx                # Root orchestration component
├── main.tsx               # React entry point
└── index.css              # Global styles + CSS variables
```

---

## 🏃 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🎨 Design System

- **Primary color**: Indigo (`#6366f1` / `#818cf8`)
- **Background**: Deep navy (`#0d0f1a`)
- **Typography**: Inter (Google Fonts)
- **Border radius**: 10px (inputs) → 16px (cards) → 20px (modals)
- **Animation**: Spring physics (damping: 25, stiffness: 300)

Each pipeline stage has its own color token:

| Stage | Color |
|---|---|
| Prospecting | Slate |
| Contacted | Blue |
| Qualified | Violet |
| Proposal | Orange |
| Closed Won | Emerald |
| Closed Lost | Red |
