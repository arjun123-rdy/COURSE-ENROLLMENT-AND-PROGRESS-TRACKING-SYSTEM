# 🎓 LearnHub — Course Enrollment & Progress Tracking System

A full-stack MERN application for browsing, enrolling in, and tracking progress through online courses.

---

## ✨ Features

- **Authentication** — Register, login with JWT, bcrypt password hashing, protected routes
- **Course Catalog** — Browse, search, and filter courses by category and level
- **Enrollment System** — One-click enroll with duplicate prevention
- **Progress Tracking** — Mark lessons complete, see live progress bars
- **Student Dashboard** — View enrolled courses, progress, completion status
- **Admin Panel** — Full CRUD for courses and lessons (admin role only)
- **Responsive UI** — Mobile-friendly dark theme with smooth animations

---

## 🛠 Tech Stack

| Layer      | Tech                                  |
|------------|---------------------------------------|
| Frontend   | React 18, React Router 6, Axios       |
| Backend    | Node.js, Express.js                   |
| Database   | MongoDB (Mongoose ODM)                |
| Auth       | JWT, bcryptjs                         |
| UI         | Custom CSS (Catppuccin dark theme)    |
| Toasts     | react-hot-toast                       |

---

## 📁 Project Structure

```
course-enrollment-system/
├── client/                     # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js / .css
│   │   │   ├── CourseCard.js / .css
│   │   │   └── LoadingSpinner.js / .css
│   │   ├── pages/
│   │   │   ├── Home.js / .css
│   │   │   ├── Courses.js / .css
│   │   │   ├── CourseDetail.js / .css
│   │   │   ├── Dashboard.js / .css
│   │   │   ├── AdminPanel.js / .css
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── Auth.css
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
│
├── server/                     # Express backend
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── enrollmentController.js
│   │   └── progressController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Enrollment.js
│   │   └── Progress.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── enrollmentRoutes.js
│   │   └── progressRoutes.js
│   ├── server.js
│   ├── seed.js
│   ├── .env
│   └── package.json
│
├── package.json                # Root (runs both)
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ — https://nodejs.org
- **MongoDB** — Local install or free [MongoDB Atlas](https://cloud.mongodb.com) cluster
- **npm** v9+

---

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd course-enrollment-system

# Install root dependencies (concurrently)
npm install

# Install all dependencies at once
npm run install:all
```

Or manually:
```bash
cd client && npm install
cd ../server && npm install
```

---

### 2. Configure Environment

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/course_enrollment
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

**Using MongoDB Atlas (cloud)?** Replace `MONGO_URI` with your connection string:
```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/course_enrollment
```

---

### 3. Seed Sample Data

```bash
npm run seed
```

This creates:
- **6 sample courses** across different categories
- **Admin account**: `admin@learnhub.com` / `admin123`
- **Student account**: `student@learnhub.com` / `student123`

---

### 4. Run the Application

```bash
# Run both frontend & backend simultaneously
npm run dev
```

Or separately:
```bash
# Terminal 1 — Backend (port 5000)
npm run server

# Terminal 2 — Frontend (port 3000)
npm run client
```

Open **http://localhost:3000** in your browser.

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint              | Description        | Auth     |
|--------|-----------------------|--------------------|----------|
| POST   | /api/auth/register    | Register new user  | Public   |
| POST   | /api/auth/login       | Login & get token  | Public   |
| GET    | /api/auth/me          | Get current user   | Required |

### Courses
| Method | Endpoint              | Description         | Auth       |
|--------|-----------------------|---------------------|------------|
| GET    | /api/courses          | Get all courses     | Public     |
| GET    | /api/courses/:id      | Get single course   | Public     |
| POST   | /api/courses          | Create course       | Admin only |
| PUT    | /api/courses/:id      | Update course       | Admin only |
| DELETE | /api/courses/:id      | Delete course       | Admin only |

### Enrollment
| Method | Endpoint              | Description           | Auth     |
|--------|-----------------------|-----------------------|----------|
| POST   | /api/enroll           | Enroll in a course    | Required |
| GET    | /api/enroll/:userId   | Get user enrollments  | Required |
| DELETE | /api/enroll/:courseId | Unenroll from course  | Required |

### Progress
| Method | Endpoint                      | Description              | Auth     |
|--------|-------------------------------|--------------------------|----------|
| PUT    | /api/progress/update          | Mark lesson complete     | Required |
| GET    | /api/progress/:userId         | Get all user progress    | Required |
| GET    | /api/progress/:userId/:courseId | Get course progress    | Required |

---

## 👤 User Roles

| Role    | Capabilities                                    |
|---------|-------------------------------------------------|
| Student | Browse, enroll, track progress, view dashboard  |
| Admin   | All student abilities + full course CRUD        |

---

## 🎨 UI Overview

| Page          | Route          | Description                              |
|---------------|----------------|------------------------------------------|
| Home          | `/`            | Landing page with hero & featured courses|
| Courses       | `/courses`     | Browse & filter all courses              |
| Course Detail | `/courses/:id` | Lessons list, enroll button, progress    |
| Dashboard     | `/dashboard`   | My courses, progress bars, stats         |
| Admin Panel   | `/admin`       | Course management table (admin only)     |
| Login         | `/login`       | Email/password login with demo buttons   |
| Register      | `/register`    | Create account with password strength    |

---

## 🔐 Security Notes

- Passwords hashed with **bcrypt** (12 rounds)
- Auth via **JWT** with configurable expiry
- Protected routes check token on every request
- Admin routes verify `role === 'admin'` server-side
- Duplicate enrollment prevented at DB level (compound unique index)

---

## 🚢 Deployment

### Backend (Render / Railway / Heroku)
1. Set environment variables from `.env`
2. Set `NODE_ENV=production`
3. Set `CLIENT_URL` to your frontend URL
4. Deploy `server/` folder; start command: `node server.js`

### Frontend (Vercel / Netlify)
1. Build: `cd client && npm run build`
2. Deploy the `client/build` folder
3. Set `REACT_APP_API_URL` or configure proxy

### MongoDB Atlas
1. Create free M0 cluster at https://cloud.mongodb.com
2. Whitelist `0.0.0.0/0` for all IPs (or your server IP)
3. Use connection string as `MONGO_URI`

---

## 📦 npm Scripts

| Command             | Description                              |
|---------------------|------------------------------------------|
| `npm run dev`       | Run client + server concurrently         |
| `npm run server`    | Run backend only (with nodemon)          |
| `npm run client`    | Run React frontend only                  |
| `npm run seed`      | Seed database with sample data           |
| `npm run build`     | Build React for production               |
| `npm run install:all` | Install all dependencies               |

---

## 🐛 Troubleshooting

**MongoDB connection error?**
- Ensure MongoDB is running: `mongod` (local) or check Atlas cluster status
- Double-check `MONGO_URI` in `server/.env`

**Port already in use?**
- Change `PORT` in `server/.env` and update the proxy in `client/package.json`

**CORS error?**
- Ensure `CLIENT_URL` in server `.env` matches your React dev server URL (`http://localhost:3000`)

**401 errors after login?**
- Clear `localStorage` in browser dev tools and re-login
- Check that `JWT_SECRET` is set in `.env`

---

Built with ❤️ using the MERN Stack
