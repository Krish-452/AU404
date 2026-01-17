# AU404 – Privacy-Centric Digital Identity & Trust Management Platform

AU404 is a **privacy-first digital identity and consent management platform** built for **Ingenious Hackathon 7.0**, aligned with the theme:

> **Trustworthy, Scalable, and Human-Centered Digital Systems**

The platform enables **users to fully control their personal data**, allows **companies to request only explicitly consented data**, and provides **administrators with governance, monitoring, and abuse control capabilities**, all with complete transparency and auditability.

---

## 🚀 Core Features

### 🔐 Authentication & Security
- Role-based login: **User / Company / Admin**
- Email + password authentication
- **OTP-based Multi-Factor Authentication (MFA)**
- OTP generated server-side and **logged to backend console (demo mode)**
- JWT-based session management
- Secure password hashing
- Role-Based Access Control (RBAC)

---

### 🧾 User Data Ownership
Users can securely manage:
- Identity credentials & government IDs
- Complete medical history
- Education records
- Work, agriculture, and property-related documents

All data is **private by default** and categorized by sensitivity.

---

### ✅ Consent-Driven Data Sharing
- Companies request specific user data by specifying:
  - Purpose
  - Requested attributes
  - Access duration
- Users can:
  - Approve requests
  - Modify requested scope
  - Revoke consent at any time
- Consent automatically expires
- Only **explicitly approved data** is shared (data minimization)

---

### 📊 Transparency & Audit Logs
- Immutable audit logs for every data access
- Users can view:
  - Who accessed their data
  - What data was accessed
  - When and for what purpose
- Admins can monitor system-wide access patterns

---

### 🏢 Company APIs
- One API key per company
- Rate-limited API access
- Consent-enforced data retrieval
- JSON-only, minimal data responses

---

### 🛡️ Admin Governance
- View total users and companies
- Monitor active sessions
- Configure per-company rate limits
- Detect bot or abusive behavior
- Suspend or delete company accounts
- View system logs and server health

---

## 🏗️ Tech Stack

### Backend
- Node.js (LTS)
- Express.js
- MongoDB
- JWT Authentication
- bcrypt
- nodemailer (OTP handling – demo via console)
- express-rate-limit
- helmet
- cors
- dotenv

### Frontend
- React + TypeScript
- Vite
- Context API
- Modular feature-based architecture
- UX aligned with **India Government UX4G guidelines**

---

## 📁 Project Structure

AU404/
│
├── backend/
│ ├── config/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── services/
│ ├── .env
│ ├── index.js
│ ├── package.json
│ └── package-lock.json
│
├── frontend/
│ ├── components/
│ ├── context/
│ ├── features/
│ ├── routes/
│ ├── services/
│ ├── .env.local
│ ├── App.tsx
│ ├── index.tsx
│ ├── index.html
│ ├── vite.config.ts
│ └── package.json
│
├── admin/ # Reserved / future admin tooling
└── README.md



---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB running locally

---

### 1️⃣ Install Dependencies

```bash
cd backend
npm install
cd ..

cd frontend
npm install
cd ..


PORT=5000
MONGO_URI=mongodb://localhost:27017/au404
JWT_SECRET=your_secret_key


VITE_API_BASE_URL=http://localhost:5000
