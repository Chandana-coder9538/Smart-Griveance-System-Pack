# SPGPS — Smart Public Grievance Prioritization System

The **Smart Public Grievance Prioritization System (SPGPS)** is a municipal governance and citizen service platform that automates civic grievance submission, triage, prioritization, dispatch, and lifecycle tracking.

---

## What the Application Does

### 1. Citizen Grievance Reporting
- **Incident Submission**: Citizens can lodge civic complaints regarding municipal issues with detailed descriptions.
- **Incident Quick-Templates**: One-click preset incident types (e.g., *Dangerous Pothole*, *Live Exposed Power Line*, *Sewage Overflow*, *Flooded Storm Drain*) to rapidly file common issues.
- **GPS Location Capture**: Automatic device location detection and address lookup to pinpoint the exact site of civic defects.
- **Photo Evidence Attachment**: Citizens can attach photos of on-site damage or hazards.
- **Instant Tracking ID**: Generates a unique tracking reference code upon submission for ongoing status tracking.

---

### 2. Automated Complaint Triage & Prioritization
- **Departmental Routing**: Automatically determines the responsible civic department across 12 municipal sectors:
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
- **Urgency Scoring (1 to 5)**:
  - **Critical (5)**: Immediate threat to public safety or major infrastructure disruption.
  - **High (4)**: Severe localized service outage or health hazard.
  - **Medium (3)**: Routine maintenance, repairs, or service requests.
  - **Low (1–2)**: Minor cosmetic issues and general inquiries.
- **SLA Resolution Prediction**: Automatically computes expected resolution timeframes and target completion dates based on issue severity and departmental workload.
- **Distress Assessment**: Evaluates citizen sentiment and public impact to prioritize urgent community needs.
- **Audit Reasoning Logs**: Generates transparent diagnostic logs explaining classification decisions and recommended actions.

---

### 3. Real-Time Grievance Tracking
- **5-Step Lifecycle Timeline**: Visual progress tracker showing the grievance moving through all operational stages:
  1. *Submitted*
  2. *Under Review*
  3. *Officer Assigned*
  4. *In Progress / Field Work*
  5. *Resolved & Verified* (or *Escalated*)
- **Officer Accountability Card**: Displays the assigned field officer's name, designation, official phone number, and email address.
- **SLA Overdue Alerts**: Highlights cases that have exceeded their target resolution window with urgent escalation notices.
- **Depot & Incident Map**: Displays an interactive map showing the location of the incident alongside the responsible municipal depot and dispatch routes.
- **24-Hour Self-Cancellation Window**: Allows citizens to withdraw or cancel erroneously submitted complaints within 24 hours.

---

### 4. Citizen Complaint History ("My Complaints")
- **Personalized Registry**: Lists all grievances filed by the citizen.
- **Status & Urgency Badges**: Quick view of active, resolved, or escalated complaints.
- **Direct Navigation**: Instant access to detailed tracking pages and resolution notes.

---

### 5. Municipal Admin Command Center
- **Key Performance Indicators (KPIs)**: Real-time citywide statistics for:
  - Total registered grievances
  - High-priority and critical action queue
  - Verified resolution rate percentage
  - Pending and in-review cases
  - SLA overdue violations
- **Jurisdictional Heatmap**: Visual breakdown of complaint density and critical issues across city districts (North, South, East, West, Central, Suburbs).
- **Analytics Charts**: Category-wise distribution breakdown and urgency tier distribution graphs.
- **Emergency Priority Queue**: Dedicated urgent action banner highlighting high-severity safety hazards for rapid dispatch.
- **Case Lifecycle Management**:
  - Update complaint status across all lifecycle stages
  - Assign or reassign field officers and maintenance personnel
  - Record detailed field inspection and resolution notes
- **Automated SLA Audit Scanner**: Scans database for overdue grievances and triggers automatic escalations to supervisory leadership.
