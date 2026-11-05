# 🛡️ Rakib - Privacy-First Productivity Platform

> **Status:** Archived / Portfolio Project  
> This project is no longer accepting new users. It is kept public as a technical showcase of a full-stack architecture built from scratch.

---

## 📝 Description

**Rakib** is a full-stack web application designed for personal discipline and habit tracking, focused on extreme privacy and ethical design. It was originally built to help users track their daily progress, maintain a private journal, and stay accountable without toxic gamification.

---

## 🌐 Live Demo

You can view the static showcase of the frontend architecture here:  
👉 [rakib-opal.vercel.app](https://rakib-opal.vercel.app) *(Note: User registration is disabled)*

---

## 🛠️ Tech Stack

* **Frontend:** React, Vite, TypeScript, Tailwind CSS, Lucide Icons
* **Backend:** Python, FastAPI, SQLAlchemy (ORM)
* **Database:** PostgreSQL (via Supabase)
* **Security:** Custom JWT Authentication, HttpOnly Cookies, Bcrypt, SlowAPI (Rate Limiting)
* **Deployment:** Vercel (Frontend), Render (Backend)

---

## ✨ Key Features

* **Dual Token Auth:** Short-lived access tokens + long-lived refresh tokens stored securely in HttpOnly cookies.
* **Secret Garden (Journal):** A completely private, un-gamified space for spiritual and personal journaling.
* **Check-ins & Streaks:** Habit tracking with an anti-guilt system (Grace Days).
* **Companions System:** Accountability partners for mutual daily check-ins.
* **GDPR Compliant:** Built-in legal pages, explicit consent tracking, and one-click account deletion.

---

## 🔒 Backend Architecture & Security

This project features a custom authentication system (bypassing standard third-party wrappers) to demonstrate a deep understanding of web security:

* **JWT Storage:** Tokens are stored in HttpOnly and SameSite cookies to mitigate XSS and CSRF attacks.
* **Rate Limiting:** Implemented via SlowAPI to prevent brute-force attacks on login/registration routes (e.g., max 5 attempts/minute).
* **Password Hashing:** Utilizes bcrypt with secure salting.
* **OTP Verification:** Email verification via cryptographically secure 6-digit codes (using Python's `secrets` module).

---

## 📁 Project Structure

```text
├── frontend/             # React + Vite client
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Application views (Dashboard, Login, Legal, etc.)
│   │   └── function/     # API fetch wrappers
├── backend/              # FastAPI server
│   ├── core/             # Security, DB connection, Rate Limiter config
│   ├── modules/          # Domain-driven modules (identity, Panel, etc.)
│   │   ├── identity/     # Auth logic, User models, Pydantic schemas
│   │   └── Panel/        # User stats and dashboard logic
│   └── main.py           # FastAPI entry point
```

---

## 🚀 Local Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/rakib.git
cd rakib
```

### 2. Environment Variables (`.env.example`)

To run this project locally, you need to create `.env` files based on the provided templates.

#### Frontend (`/frontend/.env.example`)
```env
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Backend (`/backend/.env.example`)
```env
ENVIRONMENT=development
SECRET_KEY=your_super_secret_jwt_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTE=15
REFRESH_TOKEN_EXPIRE_DAYS=30
DATABASE_URL=postgresql://user:password@localhost:5432/rakib
FRONTEND_URL=http://localhost:5173
# Optional Email Service (Resend/Brevo)
# If left empty, the OTP verification codes will print directly to the terminal console.
EMAIL_API_KEY=
```

### 3. Frontend Setup (React/Vite)

```bash
cd frontend
npm install
npm run dev
```

### 4. Backend Setup (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## 📧 Note on Email Verification (Open Source Mode)

To make this project easy to test locally without requiring a paid email provider account, the email service has been abstracted. If no API key is provided in the `.env`, the FastAPI backend will print the 6-digit OTP verification code directly into the terminal console where you launched the server.

---

## 💡 What I Learned

* Designing a secure, custom JWT authentication flow from scratch.
* Managing complex global states and protected routes in React.
* Structuring a scalable FastAPI backend using Domain-Driven Design principles.
* Implementing GDPR compliance (consent tracking, data deletion) in a real-world scenario.

---

## ⚠️ Disclaimer

This project is a portfolio piece. The legal pages (`Legal.tsx`) contain placeholders and should be reviewed by a legal professional for actual production use.