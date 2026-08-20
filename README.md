# SPGPS — Smart Public Grievance Prioritization System

> **Next-Generation AI-Driven Municipal Governance & Civic Grievance Triage Platform**  
> Powered by Google Gemini 3.7 Flash, React 18, TypeScript, Tailwind CSS, and Express.

---

## 🏛️ Executive Overview

The **Smart Public Grievance Prioritization System (SPGPS)** modernizes municipal grievance resolution by replacing slow, manual citizen service desks with an automated, AI-powered triage and dispatch pipeline. 

Using **Google Gemini 3.7 Flash**, the system automatically analyzes citizen problem descriptions and photo evidence in real-time, categorizes complaints across 12 municipal domains, scores urgency on a weighted 1–5 scale, computes sentiment distress, calculates Service Level Agreement (SLA) deadlines, and routes tickets directly to local field engineering teams with exact GPS coordinates.

---

## ✨ Key Features

### 👤 Citizen Experience
- **Instant Grievance Ingestion**: Clean, responsive reporting interface with pre-built incident quick-templates (e.g., *Dangerous Pothole*, *Live Exposed Power Line*, *Sewage Overflow*, *Flooded Drain*).
- **Geolocation & Coordinate Pinning**: One-tap browser GPS detection and address lookup for precise field crew dispatch.
- **Photo Evidence Attachment**: Upload or drag-and-drop on-site photos of infrastructure damage.
- **Real-Time 5-Step Lifecycle Tracker**: Live animated timeline with status updates (`Submitted` ➔ `Under Review` ➔ `Assigned` ➔ `In Progress` ➔ `Resolved` / `Escalated`).
- **Assigned Field Officer Card**: Direct contact details (Officer Name, Badge/Role, Official Phone, and Email) for accountability.
- **24-Hour Self-Cancellation Grace Window**: Citizens can modify or withdraw tickets submitted by mistake within 24 hours of submission.
- **Interactive OpenStreetMap Routing**: Visualizes the incident site relative to the responsible municipal department depot with driving routes.

---

### 🧠 Gemini 3.7 Flash AI Triage Engine
- **Multi-Domain Taxonomy Classification**: Automatically classifies complaints into 12 civic departments:
  - Roads & Infrastructure
  - Water & Sewage Management
  - Stormwater & Drainage
  - Electrical & Power Distribution
  - Solid Waste & Sanitation
  - Street Lighting & Signals
  - Parks & Public Spaces
  - Building & Structural Safety
  - Public Health & Vector Control
  - Municipal Schools & Centers
  - Transit & Public Mobility
  - General Civic Services
- **Urgency Scoring Matrix (1–5)**:
  - `Critical (5)`: Immediate danger to human life or major city disruption (SLA: 24–48 hours)
  - `High (4)`: Severe infrastructure outage or health hazard (SLA: 2–3 days)
  - `Medium (3)`: Routine neighborhood repairs and servicing (SLA: 4–7 days)
  - `Low (1-2)`: Cosmetic issues and general inquiries (SLA: 7–14 days)
- **Distress & Sentiment Extraction**: Evaluates emotional tone and public urgency (1–10).
- **Predictive SLA Target Computation**: Dynamically calculates days to resolution based on severity and departmental capacity.
- **Transparent Reasoning Logs**: Provides human-readable explanations of why the AI assigned a specific department and urgency score.

---

### 📊 Municipal Admin Command & Operations Center
- **Executive KPI Dashboard**: Live metrics for Total Grievances, Critical Priority Queue, Verified Resolution Rate, Pending Caseload, and SLA Violations.
- **Jurisdictional Density Heatmap**: Interactive visual map breaking down grievances and critical incidents across urban zones (North, South, East, West, Central, Metro Suburbs).
- **Interactive Analytics (Recharts)**:
  - Departmental distribution charts
  - Urgency level breakdown
  - Trend indicators and resolution ratios
- **Priority Emergency Action Queue**: High-visibility alert strip highlighting critical safety tickets requiring immediate field dispatch.
- **Full Case Lifecycle Management**:
  - Update progress status (`under_review`, `assigned`, `in_progress`, `resolved`, `closed`, `escalated`)
  - Assign specific field supervisors and engineers
  - Record audit logs and post-resolution notes
- **Automated SLA Audit Detector**: Background routine to audit active cases, detect deadline overruns, and escalate tickets to senior supervision.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 18, TypeScript, Vite |
| **Styling & Design** | Tailwind CSS, Lucide React, Glassmorphism UI tokens |
| **Animations & 3D** | Motion (Framer Motion), Three.js (interactive 3D torus canvas) |
| **Charts & Visualizations** | Recharts, Leaflet / OpenStreetMap |
| **Backend Runtime** | Node.js, Express, TypeScript (`tsx` / `esbuild`) |
| **Artificial Intelligence** | `@google/genai` (Google Gemini 3.7 Flash) |
| **State & Notifications** | React Hooks, Local Storage, Sonner Toast Notifications |

---

## 📡 REST API Reference

### Complaints API
- `POST /api/complaints` — Submit a new grievance and execute the Gemini AI triage pipeline.
- `GET /api/complaints` — Fetch all registered grievances (supports optional search and filter parameters).
- `GET /api/complaints/:id` — Retrieve comprehensive details for a specific tracking ID (including timeline, officer info, and AI reasoning).
- `PUT /api/complaints/:id` — Update case status, assign field personnel, and attach resolution notes.
- `DELETE /api/complaints/:id` — Withdraw/cancel a grievance within the 24-hour window.

### Analytics & System API
- `GET /api/kpis` — Aggregate citywide metrics, category statistics, urgency distributions, and district counts.
- `POST /api/simulate/check-overdue` — Trigger an automated SLA audit to flag and escalate overdue cases.
- `GET /api/departments` — List municipal departments, contact officers, and geographic depots.

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- Node.js (v18.x or later)
- npm or yarn
- Gemini API Key (set in `.env` as `GEMINI_API_KEY`)

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/your-org/spgps-municipal-system.git
cd spgps-municipal-system

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env and supply your GEMINI_API_KEY

# 4. Start development server
npm run dev
```

The application will be accessible at `http://localhost:3000`.

### Production Build
```bash
# Build frontend and bundle server
npm run build

# Start production server
npm start
```

---

## 👥 Role-Based Access Demo

The portal includes an instant role toggle in the navigation bar to test both perspectives:
- **Citizen Mode (`Chandana Kumar`)**: Access the submission portal, track filed grievances via tracking ID, and view personalized complaint history.
- **Admin Mode (`Admin Olivia Taylor`)**: Access the Command Center, monitor citywide KPIs, assign field engineers, run SLA audits, and update ticket states.

---

## 📄 License
This project is licensed under the MIT License.
