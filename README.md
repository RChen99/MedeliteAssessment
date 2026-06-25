# Medelite Facility Assessment Snapshot

A full-stack web application that lets Medelite analysts look up any skilled nursing facility by **CMS Certification Number (CCN)**, pull live public data from the CMS Provider Data Catalog, add internal operational inputs, and export a branded facility assessment report as PDF or Word.

Built for the **INFINITE — Managed by MEDELITE** Facility Assessment Report Generator case study.

**Repository:** [RChen99/MedeliteAssessment](https://github.com/RChen99/MedeliteAssessment)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [CMS Data Integration](#cms-data-integration)
- [Session Persistence](#session-persistence)
- [UI Flow](#ui-flow)
- [Report & Branding](#report--branding)
- [Deployment](#deployment)
- [Testing](#testing)
- [Assumptions & Tradeoffs](#assumptions--tradeoffs)

---

## Overview

Medelite evaluates skilled nursing facilities before outreach. Much of the public data they need already exists on CMS (star ratings, address, bed count, hospitalization metrics). This app automates that lookup and combines it with Medelite-specific manual fields into a single polished report.

**How it works:**

1. User enters a 6-digit CCN on the lookup page.
2. The FastAPI backend queries three CMS datasets, merges the results, and returns a clean typed JSON response.
3. The user fills in optional name override and manual operational inputs.
4. The app renders star ratings, benchmark charts, and a report preview across three tabs.
5. The user downloads a PDF or DOCX with hardcoded INFINITE branding and a clickable Medicare Care Compare link.

---

## Features

### Core (case study requirements)

| Feature | Description |
|---------|-------------|
| **Dynamic CCN lookup** | Enter any valid 6-digit CCN to fetch facility data |
| **CMS data engine** | Live queries to `data.cms.gov` for location, star ratings, beds, and hospitalization metrics |
| **Facility name override** | Optional custom name overrides the CMS legal name on the final report only |
| **Manual operational inputs** | EMR, current census, patient type, Medelite history, medical coverage |
| **PDF export** | One-click browser download with branding and Medicare hyperlink |
| **Hardcoded branding** | `INFINITE — Managed by MEDELITE` and `FACILITY ASSESSMENT SNAPSHOT` never replaced by facility name |

### Bonus features

| Feature | Description |
|---------|-------------|
| **DOCX export** | Editable Word document download |
| **12 hospitalization/ED metrics** | 4 measures × facility / state / national values |
| **Recharts benchmark charts** | Per-bar hover highlighting for Facility, State, and National |
| **Session persistence** | JSON file storage for CMS snapshot + manual inputs per CCN |
| **Tabbed facility UI** | Entries, Performance, and Report sections |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS |
| **Charts** | Recharts |
| **PDF** | `@react-pdf/renderer` |
| **DOCX** | `docx` + `file-saver` |
| **Icons** | `react-icons` |
| **Backend** | FastAPI, Uvicorn, httpx, Pydantic |
| **Persistence** | `backend/data/database.json` (JSON file, keyed by CCN) |
| **Deployment** | Vercel (frontend) + Render (backend) |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Browser (Next.js on Vercel)                                │
│  /  → CCN lookup                                            │
│  /facility/[ccn] → Entries | Performance | Report tabs      │
└──────────────────────────┬──────────────────────────────────┘
                           │  /api/* (same-origin)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  FastAPI on Render                                          │
│  GET  /api/facility/{ccn}         → CMS fetch + save JSON   │
│  GET  /api/facility/{ccn}/stored  → load saved session      │
│  PUT  /api/facility/{ccn}/inputs  → save manual inputs       │
└──────────────────────────┬──────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
   data.cms.gov (3 datasets)    database.json
```

The frontend never calls CMS directly. All fetch, merge, normalization, and retry logic lives in the Python backend. Next.js rewrites `/api/*` to the Render backend via `BACKEND_URL`, avoiding CORS issues in the browser.

---

## Project Structure

```
Medelite/
├── frontend/                    # Next.js app
│   ├── app/
│   │   ├── page.tsx             # Lookup page (/)
│   │   └── facility/[ccn]/      # Facility report page
│   ├── components/
│   │   ├── BrandHeader.tsx      # INFINITE logo + snapshot title + state
│   │   ├── FacilityTabs.tsx     # Entries / Performance / Report tabs
│   │   ├── InputsForm.tsx         # Optional + manual inputs
│   │   ├── StarRatingCards.tsx
│   │   ├── HospitalizationCharts.tsx
│   │   ├── ReportPreview.tsx
│   │   └── ExportButtons.tsx
│   ├── lib/
│   │   ├── report-model.ts    # Report builder + row definitions
│   │   ├── export-pdf.tsx
│   │   ├── export-docx.ts
│   │   └── brand-colors.ts
│   └── public/
│       └── infinite-logo.png
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app + CORS + health check
│   │   ├── cms_api.py           # CMS fetch, merge, retry logic
│   │   ├── storage.py           # database.json read/write
│   │   ├── models.py            # Pydantic schemas
│   │   ├── formatters.py        # Address, CCN, Medicare URL helpers
│   │   └── routes/facility.py   # API endpoints
│   └── data/
│       └── database.json        # Runtime session store (gitignored)
├── render.yaml                  # Render deployment blueprint
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.12+
- Internet access (CMS API calls)

### 1. Clone the repository

```bash
git clone https://github.com/RChen99/MedeliteAssessment.git
cd MedeliteAssessment
```

### 2. Start the backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 3001
```

Verify: [http://localhost:3001/health](http://localhost:3001/health) should return `{"status":"ok"}`.

### 3. Start the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The frontend proxies API calls to `http://localhost:3001` by default (see `next.config.mjs`).

### 4. Try a lookup

Enter CCN **`686123`** (Kendall Lakes Healthcare and Rehab Center, FL) and click **Fetch Facility**.

---

## Environment Variables

### Frontend (Vercel / local)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `BACKEND_URL` | Production only | `http://localhost:3001` | Render backend URL for `/api` rewrites |

Example for production:

```
BACKEND_URL=https://medeliteassessment.onrender.com
```

### Backend (Render)

No secrets required. The CMS Provider Data Catalog API is public.

| Variable | Description |
|----------|-------------|
| `PORT` | Set automatically by Render |

---

## API Reference

All routes are prefixed with `/api` on the backend. The frontend accesses them via `/api/...` through Next.js rewrites.

### `GET /health`

Health check for deployment monitoring.

**Response:** `200 { "status": "ok" }`

---

### `GET /api/facility/{ccn}`

Fetches live CMS data for the given CCN, saves the snapshot to `database.json`, and returns the full session.

**Validation:** CCN must be exactly 6 digits.

**Response:** `200` with `FacilitySessionResponse`:

```json
{
  "cms": { "ccn": "686123", "officialName": "...", "state": "FL", ... },
  "manual": { "emr": "", "currentCensus": "", ... },
  "nameOverride": ""
}
```

**Errors:**

| Status | Meaning |
|--------|---------|
| `400` | Invalid CCN format |
| `404` | Facility not found in CMS |
| `502` | CMS API unavailable |
| `500` | Unexpected server error |

---

### `GET /api/facility/{ccn}/stored`

Loads a previously saved session from `database.json` without calling CMS.

**Response:** `200` session object, or `404` if no saved data exists.

---

### `PUT /api/facility/{ccn}/inputs`

Saves manual inputs and name override for a CCN that has already been fetched.

**Body:**

```json
{
  "manual": {
    "emr": "PCC",
    "currentCensus": "112",
    "patientType": "Long Term",
    "previousCoverage": "Yes",
    "previousProviderPerformance": "About 30",
    "medicalCoverage": "Optometry"
  },
  "nameOverride": ""
}
```

**Response:** `200` updated session, or `404` if facility has not been fetched yet.

---

## CMS Data Integration

Facility data is split across **three CMS datasets**. The backend fetches all three and merges them into one `CmsFacilityData` object.

| Dataset ID | Purpose |
|------------|---------|
| `4pq5-n9py` | Provider info (name, address, state, beds, star ratings) |
| `ijh5-nb2v` | Claims measures (hospitalization / ED visit scores) |
| `xcdc-v8bm` | State and national benchmark averages |

**Base URL:** `https://data.cms.gov/provider-data/api/1/datastore/query`

**Measure codes:**

| Code | Metric |
|------|--------|
| `521` | Short-stay hospitalization |
| `522` | Short-stay ED visits |
| `551` | Long-stay hospitalization |
| `552` | Long-stay ED visits |

**Derived fields:**

- `medicareUrl` — built from CCN: `https://www.medicare.gov/care-compare/details/nursing-home/{ccn}` (CMS does not return this directly)
- Missing or invalid numeric values are parsed as `null` and displayed as **N/A** in the UI and exports

**Retry logic:** Up to 3 attempts with 0.5s delay on transient CMS failures.

---

## Session Persistence

Sessions are stored in `backend/data/database.json`, keyed by CCN:

```json
{
  "686123": {
    "fetchedAt": "2026-06-20T23:21:01.451552+00:00",
    "cms": { ... },
    "manual": { ... },
    "nameOverride": ""
  }
}
```

**Behavior:**

| Action | What happens |
|--------|--------------|
| Fresh lookup (`?fetch=1`) | Backend calls CMS live, saves snapshot, returns session |
| Return to `/facility/{ccn}` | Loads saved session from JSON (no CMS call) |
| Edit manual inputs | Auto-saved via debounced `PUT /inputs` (500ms) |
| Override / Save buttons | Explicit save for name override and manual fields |

`database.json` is gitignored. On Render's free tier, the filesystem is ephemeral — sessions may reset on redeploy or spin-down.

---

## UI Flow

### Pages

| Route | Purpose |
|-------|---------|
| `/` | CCN lookup form |
| `/facility/[ccn]` | Facility report workspace |

### Facility tabs

| Tab | Contents |
|-----|----------|
| **Entries** | Optional facility name override + manual operational inputs |
| **Performance** | Star rating cards + hospitalization benchmark charts |
| **Report** | Full report preview + PDF/DOCX export buttons |

### Demo CCN gate

The UI is demo-gated to CCN **`686123`** for reliable reviewer testing. Entering any other CCN on the lookup page shows an unsupported warning with a **Copy 686123** button.

The backend still supports any valid 6-digit CCN if called directly via the API.

---

## Report & Branding

### Hardcoded (per case study Section 6)

These strings are fixed and never replaced by CMS facility data:

- `INFINITE — Managed by MEDELITE`
- `FACILITY ASSESSMENT SNAPSHOT`

The facility name (CMS official name or user override) appears only in the **Name of Facility** report row.

### Dynamic

- **State code** (e.g. `FL`) — from CMS, shown in the header
- All CMS metrics and manual inputs

### Brand colors

Defined in `frontend/lib/brand-colors.ts` and `frontend/tailwind.config.ts`:

| Token | Hex | Usage |
|-------|-----|-------|
| Pink | `#E91E8C` | Primary buttons, chart bars |
| Purple | `#7B2CBF` | Hover states, accents |
| Blue | `#1E78B4` | Links, state text |
| Blue Light | `#5DA9DD` | Secondary accents |
| Navy | `#312E81` | Headings, body text |

---

## Deployment

### Backend — Render

Configured via `render.yaml`:

- **Root directory:** `backend`
- **Build:** `pip install -r requirements.txt`
- **Start:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Health check:** `GET /health`
- **Python:** 3.12.8

### Frontend — Vercel

- **Root directory:** `frontend`
- **Framework:** Next.js
- **Environment variable:** `BACKEND_URL` → your Render service URL

Example:

```
BACKEND_URL=https://medeliteassessment.onrender.com
```

### First-request latency

Render free tier spins down after inactivity. The first API call after idle may take 30–60 seconds while the service wakes up.

---

## Testing

### Recommended test CCN

**`686123`** — Kendall Lakes Healthcare and Rehab Center, Miami, FL

### Manual checklist

1. Open `/` and enter `686123` → **Fetch Facility**
2. Confirm header shows INFINITE logo, snapshot title, and **FL**
3. **Entries tab** — fill manual inputs, test name override
4. **Performance tab** — verify 4 star cards and 4 charts with per-bar hover
5. **Report tab** — confirm all rows populated, Medicare link works
6. **Download PDF** and **Download Word** — check branding and hyperlink
7. Refresh page — session should restore from JSON without re-fetching CMS
8. Navigate back to lookup and fetch again — CMS data should refresh

### API smoke test

```bash
curl http://localhost:3001/health
curl http://localhost:3001/api/facility/686123
```

---

## Assumptions & Tradeoffs

1. **JSON file persistence** instead of a real database — appropriate for MVP; sessions are not durable on Render free tier redeploys.
2. **CMS logic on the backend** — keeps the frontend thin and makes data mapping easier to validate.
3. **Separate pages per flow** — lookup page vs. facility report page for clearer UX.
4. **UI demo-gated to 686123** — backend supports any CCN; UI restricts for consistent reviewer experience.
5. **Brand colors** — not specified in the case study; aligned with the INFINITE logo palette.
6. **State displayed as code** — CMS returns `FL`, not `Florida`, matching the case study's "state code" requirement.

---

## License

Built as a technical case study submission. All rights to INFINITE / MEDELITE branding belong to their respective owners.
