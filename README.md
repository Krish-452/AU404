# Identity Hub - Sovereign Identity Platform

> **Banking-Grade Security • Zero-Trust Architecture • Sovereign Data Control**

Identity Hub is a high-security web platform designed to manage digital identities with strict compliance, auditability, and role-based access control. It features a complete Zero-Trust authentication flow, including mandatory Multi-Factor Authentication (MFA) for high-risk actions.

![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![Security](https://img.shields.io/badge/Security-Banking%20Grade-blue)
![Stack](https://img.shields.io/badge/Stack-MERN-orange)

## 🚀 Key Features

- **Zero-Trust Authentication**: 
  - JWT-based session management with secure cookies.
  - Mandatory 2FA/OTP for Login.
  - **High-Risk Action Enforcement**: Sensitive actions (e.g., Block Request) require fresh OTP verification.
- **Security Hardening**:
  - `Anti-Tamper`: Detects DevTools/Debugger usage and force-terminates sessions.
  - `Rate Limiting`: Protects valid endpoints against brute-force attacks.
  - `Audit Logging`: Immutable CSV logs for all identity interactions.
- **Role-Based Portals**:
  - **Citizen**: Manage personal data shards and consent requests.
  - **Company**: Request data access (e.g., Healthcare, Agriculture).
  - **Admin**: Infrastructure oversight.
- **Modern UI/UX**:
  - Built with React + TypeScript + Tailwind CSS.
  - Fully responsive with persistent Dark/Light mode.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: React Context API (`AuthContext`, `ThemeContext`)
- **Routing**: React Router v6
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Security**: `helmet`, `express-rate-limit`, `bcryptjs`, `jsonwebtoken`
- **MFA**: `speakeasy` (TOTP), Custom OTP Controller

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Local running on `:27017` or Atlas URI)

### 1. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Configure Environment
# Create a .env file with the following:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/identity-hub
# JWT_SECRET=your_super_secret_banking_grade_key_here

# Seed Database (Optional - Creates Initial Admin/Citizen)
node scripts/seed.js

# Start Server
npm start
# Server runs on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Configure Environment
# Create a .env.local file with:
# VITE_API_URL=http://localhost:5000/api

# Start Development Server
npm run dev
# App runs on http://localhost:3000
```

---

## 🔐 Security Verification

The platform includes automated verification scripts to prove security compliance.

**Run Security Audit:**
```bash
cd backend
node scripts/test_security.js
```
**Expectations:**
1.  **Block Request (No OTP)**: `[SUCCESS] Rejected (OTP Required)` (HTTP 400)
2.  **Login (Wrong Password)**: `[SUCCESS] Rejected` (HTTP 401)
3.  **Export Logs**: `[SUCCESS] CSV Received`

---

## 📂 Project Structure

```bash
identity-hub/
├── backend/
│   ├── controllers/   # Auth, OTP, and Citizen logic
│   ├── middleware/    # JWT Protection, Rate Limits
│   ├── models/        # Mongoose Schemas (User, OTP, Request)
│   ├── routes/        # API Endpoints
│   └── scripts/       # Security Tests & Seeding
└── frontend/
    ├── src/
    │   ├── context/       # Auth & Theme State
    │   ├── features/      # Core Features (Auth, Citizen Dashboard)
    │   ├── components/    # Reusable UI (VerifyOtpModal, etc.)
    │   └── services/      # Axios setup
    └── ...
```

## 🛡️ Default Credentials (Mock)

| Role | Email | Password |
|------|-------|----------|
| **Citizen** | `citizen@idtrust.gov` | `password123` |
| **Test** | `hero@test.com` | `password123` |

*Note: OTP codes are logged to the Backend Terminal in Development Mode.*

---

> **Disclaimer**: This is a demonstration of a high-security architecture. For actual production deployment, ensure `secure: true` cookies are enabled (requires HTTPS) and replace the logging OTP service with an SMS/Email provider like Twilio or SendGrid.
