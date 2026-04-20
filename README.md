# ⛳ Golf Club Manager

A modern full-stack golf club administration platform that connects members, tournament organizers, and administrators in a single responsive web application.

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express + MySQL
- **Deployment:** Docker Compose for local development and containerized services

## 📋 Overview

Golf Club Manager is designed to support golf club operations including membership onboarding, tournament event management, and club-wide content publishing. The platform helps administrators manage requests, track tournament participation, and keep members informed through notifications and document uploads.

Main capabilities include:
- secure registration and login
- role-based access control
- member directory and profile management
- tournament creation, registration, and roster management
- document and notification publishing

The app supports two primary user roles:
- **Member** — browse tournaments, register for events, access content, and update profile details
- **Admin** — approve membership requests, manage tournaments, publish documents/notifications, and view member data

## ✨ Key Features

- JWT-based authentication and protected frontend routes
- Role checks for administrator-only actions
- Member directory with profile browsing and search
- Tournament dashboard with overview, roster, and requests pages
- Content hub for documents and notifications
- Publish and edit club content
- Membership request review and approval workflow
- Responsive UI with reusable card, form, modal, and layout components
- Fully containerized app using Docker Compose

## 🛠️ Technology Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- React Router DOM
- React Markdown
- remark-gfm
- Lucide React icons
- date-fns

### Backend
- Node.js
- Express
- MySQL via `mysql2`
- JWT authentication
- bcryptjs password hashing
- CORS and dotenv

### Infrastructure
- Docker Compose
- MySQL 8.0 container
- Backend and frontend container networking

## 🚀 Installation Guide

### Option 1: Docker Compose

1. Install Docker Desktop.
2. Open a terminal at the project root.
3. Run:
   ```bash
   docker compose up --build
   ```
4. Visit the frontend at `http://localhost:3000`.
5. The backend API is available at `http://localhost:5000/api`.

### Option 2: Run Locally

#### Backend

1. `cd backend`
2. `npm install`
3. Copy `sample-env.txt` to `.env` and update values as needed
4. `npm start`

#### Frontend

1. `cd frontend`
2. `npm install`
3. Copy `sample-env.txt` to `.env`
4. `npm run dev`

### Database Initialization

When using Docker Compose, the MySQL container automatically loads SQL scripts from `mysql/init/`.

For manual initialization, execute:
1. `mysql/init/01_schema.sql`
2. `mysql/init/02_procedures.sql`
3. `mysql/init/03_triggers.sql`
4. `mysql/init/04_seed_data.sql`

## 📦 Project Structure

### Root
- `docker-compose.yaml` — service definitions for MySQL, backend, and frontend
- `README.md` — project documentation
- `assets/` — supplemental images and documentation assets
- `mysql/init/` — database schema, stored procedures, triggers, and seed data

### Backend
- `backend/Dockerfile` — backend container build definition
- `backend/package.json` — dependencies and npm scripts
- `backend/server.js` — Express application entry point
- `backend/config/db.js` — MySQL connection setup
- `backend/controllers/` — request handlers and app logic
- `backend/middlewares/authMiddleware.js` — JWT auth and role authorization middleware
- `backend/models/` — database query helpers and data access abstractions
- `backend/routes/` — API route registration and module mounting
- `backend/sample-env.txt` — example backend environment variables

### Frontend
- `frontend/Dockerfile` — frontend container build definition
- `frontend/package.json` — frontend dependencies and scripts
- `frontend/sample-env.txt` — example frontend environment variables
- `frontend/src/main.jsx` — React app bootstrap
- `frontend/src/App.jsx` — routing, protected route wrapper, and layout composition
- `frontend/src/context/AuthContext.jsx` — authentication state provider
- `frontend/src/services/api.js` — centralized API request helper
- `frontend/src/pages/` — top-level page views and nested page layouts
- `frontend/src/components/` — reusable UI components for cards, forms, layout, and navigation
- `frontend/src/hooks/` — custom hooks for forms, filtering, role checks, and UI behavior
- `frontend/src/utils/` — shared utilities for date formatting, pagination, and status display

## 🔌 API Overview

Core backend endpoints are exposed under `/api`:

- `POST /api/register` — register a new user
- `POST /api/login` — authenticate and receive a JWT
- `GET /api/profile` — fetch the current logged-in user's profile
- `PUT /api/profile` — update profile information
- `GET /api/users` — retrieve member directory data
- `GET /api/requests` — list membership requests
- `POST /api/requests/manage` — approve or reject requests
- `GET /api/tournaments` — fetch tournaments
- `POST /api/tournaments/create` — create a tournament
- `GET /api/tournaments/:id` — fetch tournament details
- `PUT /api/tournaments/:id` — update a tournament
- `POST /api/tournaments/register` — register for a tournament
- `POST /api/tournaments/manage` — manage tournament registrations and approvals
- `GET /api/documents` — list published documents
- `GET /api/notifications` — list published notifications
- `POST /api/create` or `/api/content/create` — create new document/notification content
- `PUT /api/:id` or `/api/content/:id` — update content items

## 🎯 Why This Project Matters

Golf Club Manager is built to reduce administrative overhead for club organizers while improving member engagement. It centralizes event planning, approval workflows, member directories, and club announcements in a unified interface.

## 🌱 Future Roadmap

- Add file uploads for documents, tournament media, and member resources
- Implement email notifications for event registration, approvals, and announcements
- Add real-time member updates or chat using WebSockets
- Build analytics and reporting dashboards for tournaments and membership activity
- Add frontend and backend automated tests
- Improve accessibility and mobile responsiveness
- Add internationalization (i18n) support
- Extend role management with audit logs and admin activity tracking

## 📌 Notes

The architecture separates frontend, backend, and database concerns so the app can scale naturally and be extended with new features without tight coupling. Docker Compose provides a consistent, reproducible environment for developers.
