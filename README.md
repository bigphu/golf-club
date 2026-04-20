# ⛳ Golf Club Manager

A modern management platform for golf clubs that connects members, administrators, tournaments, and club content in one polished web app.

**Frontend:** React + Vite + Tailwind CSS
**Backend:** Node.js + Express + MySQL
**Deployment:** Docker Compose for local and containerized development

## 📋 Overview

Golf Club Manager is built to streamline golf club operations by combining:

- membership requests and approval flows
- tournament creation, registration, and roster management
- document and notification publishing
- member directory and profile management

The app supports two user roles:

- **Member:** view tournaments, register for events, access documents, and update profile details
- **Admin:** manage membership requests, create tournaments, publish content, and control user access

## ✨ Features

- Secure user registration and login with JWT
- Role-based authorization for protected workflows
- Member directory with profile browsing
- Tournament dashboard with creation, editing, registration, and roster views
- Content hub for documents and notifications
- Create/edit content with markdown-style support
- Membership request review and approval
- Responsive UI with reusable React components
- Full Docker Compose setup for backend, frontend, and MySQL

## 🛠️ Technology Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- React Router DOM
- React Markdown + remark-gfm
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
- Backend and frontend containers with network bridging

## 🚀 Installation

### Option 1: Docker Compose

1. Install and run Docker Desktop.
2. From project root:
   ```bash
   docker compose up --build
   ```
3. Frontend: `http://localhost:3000`
4. Backend API: `http://localhost:5000/api`

### Option 2: Run Locally

#### Backend

1. `cd backend`
2. `npm install`
3. Create `.env` from `sample-env.txt`
4. `npm start`

#### Frontend

1. `cd frontend`
2. `npm install`
3. Create `.env` from `sample-env.txt`
4. `npm run dev`

### Database Setup

If using Docker, the MySQL container loads SQL automatically from `mysql/init/`.

For manual setup, run:

1. `mysql/init/01_schema.sql`
2. `mysql/init/02_procedures.sql`
3. `mysql/init/03_triggers.sql`
4. `mysql/init/04_seed_data.sql`

## 📦 Project Structure

### Root
- `docker-compose.yaml` - service definitions for MySQL, backend, frontend
- `README.md` - project documentation
- `assets/` - documentation and presentation images
- `mysql/init/` - database schema and initialization scripts

### Backend
- `backend/Dockerfile` - backend container build file
- `backend/package.json` - backend dependencies and scripts
- `backend/server.js` - Express server entry point
- `backend/config/db.js` - database connection helper
- `backend/controllers/` - request handlers and business logic
- `backend/middlewares/authMiddleware.js` - JWT and role guard middleware
- `backend/models/` - database access abstractions
- `backend/routes/` - API route definitions
- `backend/sample-env.txt` - example environment variables

### Frontend
- `frontend/Dockerfile` - frontend container build file
- `frontend/package.json` - frontend dependencies and scripts
- `frontend/sample-env.txt` - example API environment variable
- `frontend/src/main.jsx` - React entry point
- `frontend/src/App.jsx` - route configuration
- `frontend/src/context/AuthContext.jsx` - authentication state management
- `frontend/src/services/api.js` - API request helper
- `frontend/src/pages/` - page components and layouts
- `frontend/src/components/` - reusable UI components
- `frontend/src/hooks/` - custom hooks
- `frontend/src/utils/` - utility functions

## 🧩 API Endpoints

- `POST /api/register` - register a new user
- `POST /api/login` - authenticate user and return token
- `GET /api/profile` - get current user profile
- `PUT /api/profile` - update profile
- `GET /api/users` - member directory
- `GET /api/requests` - membership requests
- `POST /api/requests/manage` - approve/reject requests
- `GET /api/tournaments` - tournament list
- `POST /api/tournaments/create` - create tournament
- `GET /api/tournaments/:id` - tournament detail
- `PUT /api/tournaments/:id` - update tournament
- `POST /api/tournaments/register` - register for tournament
- `POST /api/tournaments/manage` - manage tournament applications
- `GET /api/documents` - list documents
- `GET /api/notifications` - list notifications
- `POST /api/create` or `/api/content/create` - add new document/notification
- `PUT /api/:id` or `/api/content/:id` - update content item

> Content routes support both direct `/api/documents` access and `/api/content/...` creation paths.

## 🔮 Future Plans

- Add file upload support for documents and tournament resources
- Add real-time notifications or chat for members
- Add analytics dashboard for tournament and user statistics
- Implement email reminders for registration and approvals
- Expand role management with audit trails
- Add automated tests for frontend and backend
- Improve mobile responsiveness and accessibility
- Support multi-language / i18n

## 🤝 Notes

- Designed for easy expansion with separate frontend, backend, and database layers.
- Docker Compose makes full-stack setup fast and repeatable.
- Ideal for club administration, event management, and member communication.
