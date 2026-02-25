# JobSphere

A production-ready MERN stack job portal (SaaS) with role-based auth, job search, applications, and company dashboards.

## Tech Stack

- **Frontend:** React 18, Vite, TailwindCSS, Context API, React Router, Axios, React Hot Toast
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Auth:** JWT Access + Refresh tokens, bcrypt
- **File upload:** Multer + Cloudinary
- **Security:** Helmet, CORS, express-rate-limit

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- (Optional) Cloudinary account for avatar/resume/logo uploads

## Setup

### 1. Clone and install dependencies

```bash
cd REsciprokLLpProject
npm run install:all
```

Or manually:

```bash
npm install
cd server && npm install
cd ../client && npm install
```

### 2. Environment variables

**Server** – copy and edit `server/.env.example` to `server/.env`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jobsphere
JWT_ACCESS_SECRET=your-access-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

**Client** – optional. Vite proxies `/api` to `http://localhost:5000` by default. To point to another API:

```env
# client/.env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run the app

From the project root:

```bash
npm run dev
```

This starts:

- **Backend:** http://localhost:5000  
- **Frontend:** http://localhost:5173  

Open http://localhost:5173 in the browser.

### Run backend or frontend only

```bash
npm run dev:server   # backend only
npm run dev:client   # frontend only
```

### Production build

```bash
npm run build       # build client
npm start           # run server only (serve client build separately or use a static server)
```

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/auth/register | Register (user or company) |
| POST   | /api/auth/login | Login |
| POST   | /api/auth/refresh | Refresh access token |
| POST   | /api/auth/logout | Logout |
| GET    | /api/auth/me | Current user (protected) |
| GET    | /api/users/profile | Get profile (protected) |
| PUT    | /api/users/profile | Update profile (protected) |
| POST   | /api/users/upload-avatar | Upload avatar (protected) |
| POST   | /api/users/upload-resume | Upload resume (user only) |
| GET    | /api/companies/me | My company (company only) |
| PUT    | /api/companies/me | Update company (company only) |
| POST   | /api/companies/me/upload-logo | Upload logo (company only) |
| GET    | /api/companies/:id | Get company by ID (public) |
| GET    | /api/jobs | List jobs (search, location, skills, pagination) |
| GET    | /api/jobs/:id | Get job (public) |
| GET    | /api/jobs/company/mine | My company jobs (company only) |
| POST   | /api/jobs | Create job (company only) |
| PUT    | /api/jobs/:id | Update job (company only) |
| DELETE | /api/jobs/:id | Delete job (company only) |
| POST   | /api/applications | Apply to job (user only) |
| GET    | /api/applications/me | My applications (user only) |
| DELETE | /api/applications/:id | Withdraw application (user only) |
| GET    | /api/applications/job/:jobId | Applicants for job (company only) |
| PATCH  | /api/applications/:id/status | Accept/Reject (company only) |

## Project structure

```
REsciprokLLpProject/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── api/            # Axios instance + services
│   │   ├── components/
│   │   ├── context/        # AuthContext
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/         # ProtectedRoute
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/                 # Express backend
│   ├── config/             # db, env, cloudinary
│   ├── controllers/
│   ├── middleware/         # auth, role, error, validate
│   ├── models/             # User, Company, Job, Application
│   ├── routes/
│   ├── utils/              # asyncHandler, jwt, upload
│   ├── app.js
│   └── server.js
├── package.json            # Root scripts (dev, install:all)
└── README.md
```

## Features

- **Auth:** Register as user or company, login, logout, refresh token rotation, protected routes, role-based access
- **User:** Update profile, upload avatar & resume, browse/search jobs, apply, withdraw, view applications
- **Company:** Company profile, logo, post/edit/delete jobs, view applicants, accept/reject applications
- **UI:** Landing page, job search filters, dashboards, toasts, loading skeletons, responsive layout

## License

MIT
