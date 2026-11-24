# 🏠 StayFinder — PG & Room Finder for Students

> **Find Your Perfect Student Accommodation**

A full-stack web application that connects students looking for PGs and hostels with property owners. Built with Node.js, Express.js, MongoDB, and Vanilla JavaScript.

---

## 📋 Table of Contents
1. [Problem Statement](#problem-statement)
2. [Objectives](#objectives)
3. [Technology Stack](#technology-stack)
4. [System Architecture](#system-architecture)
5. [Database Schema](#database-schema)
6. [Features](#features)
7. [Project Structure](#project-structure)
8. [Installation Guide](#installation-guide)
9. [API Documentation](#api-documentation)
10. [Testing Guide](#testing-guide)
11. [Future Scope](#future-scope)

---

## 💡 Problem Statement

Students moving to a new city for college face a major challenge: finding safe, affordable, and convenient accommodation near their institution. Traditional methods involve visiting brokers who charge heavy commissions, relying on word-of-mouth, or browsing unverified listings on general platforms.

**StayFinder** solves this by providing a dedicated, trusted platform where:
- Students can search and filter verified PGs/hostels near their college
- Property owners can list and manage their properties
- Administrators ensure quality by approving listings before they go live

---

## 🎯 Objectives

- Build a modern, responsive web application for student accommodation search
- Implement secure JWT-based authentication with role-based access control
- Create three separate panels: Student, Owner, and Admin
- Allow property owners to list properties with images and details
- Enable students to search, filter, save, and enquire about properties
- Provide admins with approval workflow to maintain quality
- Demonstrate full-stack development skills with clean, maintainable code

---

## 🛠️ Technology Stack

| Category | Technology |
|---|---|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT) |
| **Password Security** | bcryptjs (hashing with salt rounds) |
| **File Uploads** | Multer (local storage) |
| **API Style** | REST API |
| **Fonts** | Google Fonts (Inter, Plus Jakarta Sans) |

---

## 🏗️ System Architecture

```
                    ┌─────────────────────────────┐
                    │      FRONTEND (Browser)      │
                    │  HTML + CSS + JavaScript     │
                    │  index.html, explore.html,   │
                    │  property-details.html, etc. │
                    └──────────────┬───────────────┘
                                   │ HTTP/REST API
                                   ▼
                    ┌─────────────────────────────┐
                    │    BACKEND (Node.js)         │
                    │    Express.js Server         │
                    │                             │
                    │  Routes → Controllers       │
                    │  Middleware (Auth, Upload)  │
                    └──────────────┬───────────────┘
                                   │ Mongoose ODM
                                   ▼
                    ┌─────────────────────────────┐
                    │    DATABASE (MongoDB Atlas)  │
                    │  Users, Properties,         │
                    │  Enquiries, Favourites      │
                    └─────────────────────────────┘
```

**Request Flow:**
1. User fills a form on the frontend
2. JavaScript sends a `fetch()` API request with JWT token
3. Express receives the request, runs Auth middleware
4. Controller processes the request, interacts with MongoDB via Mongoose
5. Response is sent back as JSON
6. Frontend renders the data

---

## 🗄️ Database Schema

### User Model
| Field | Type | Description |
|---|---|---|
| name | String | Full name |
| email | String | Unique, lowercase |
| password | String | bcrypt hashed, hidden in queries |
| phone | String | 10-digit |
| role | String | `student`, `owner`, `admin` |
| college | String | College name (students) |
| city | String | User's city |
| isActive | Boolean | Account status |

### Property Model
| Field | Type | Description |
|---|---|---|
| name | String | Property name |
| type | String | PG, Hostel, Independent Room, Flat |
| description | String | Detailed description |
| city, locality, address | String | Location details |
| nearbyCollege | String | Nearest college/landmark |
| monthlyRent | Number | Monthly cost in ₹ |
| securityDeposit | Number | Deposit amount in ₹ |
| sharingType | String | Single, Double, Triple |
| genderPreference | String | Boys, Girls, Unisex |
| hasAC | Boolean | Air conditioning |
| hasFood | Boolean | Meals included |
| amenities | [String] | Array of amenities |
| contactNumber | String | Owner's contact |
| images | [String] | Array of image paths |
| status | String | `pending`, `approved`, `rejected` |
| isAvailable | Boolean | Currently accepting |
| owner | ObjectId | Reference to User |

### Enquiry Model
| Field | Type | Description |
|---|---|---|
| property | ObjectId | Referenced property |
| student | ObjectId | Student who enquired |
| owner | ObjectId | Property owner |
| name, email, phone | String | Contact details |
| message | String | Enquiry message |
| status | String | pending, responded, closed |

### Favourite Model
| Field | Type | Description |
|---|---|---|
| student | ObjectId | Student user |
| property | ObjectId | Saved property |
| (unique index) | — | Prevents duplicates |

---

## ✨ Features

### 👨‍🎓 Student Features
- Browse all approved properties
- Search by city, locality, college name
- Filter by gender, type, sharing, budget, AC, food
- Sort by price (low-high, high-low)
- View full property details with photo gallery
- Save/favourite properties
- Send enquiries directly to owners
- View enquiry history
- Manage personal profile

### 🏠 Owner Features
- Register and manage account
- Dashboard with property statistics
- Add new property listings with up to 10 images
- Edit property details
- Delete listings
- Toggle property availability
- View student enquiries
- Properties go through admin approval

### 👨‍💼 Admin Features
- Secure admin-only dashboard
- View platform statistics (users, properties, enquiries)
- Review pending property submissions
- Approve or reject listings
- View all registered students and owners
- Deactivate/activate user accounts
- View all enquiries

---

## 📁 Project Structure

```
StayFinder/
├── frontend/
│   ├── index.html              ← Home page
│   ├── explore.html            ← Browse all properties
│   ├── property-details.html   ← Single property view
│   ├── login.html              ← Login page
│   ├── register.html           ← Registration page
│   ├── student-dashboard.html  ← Student panel
│   ├── owner-dashboard.html    ← Owner panel
│   ├── admin-dashboard.html    ← Admin panel
│   ├── css/
│   │   └── style.css           ← Complete design system
│   └── js/
│       ├── api.js              ← All API call functions
│       └── main.js             ← Shared utilities
│
├── backend/
│   ├── config/
│   │   └── database.js         ← MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   ← Login, register, profile
│   │   ├── propertyController.js ← Property CRUD
│   │   ├── enquiryController.js  ← Enquiry management
│   │   ├── favouriteController.js ← Saved properties
│   │   └── adminController.js  ← Admin operations
│   ├── middleware/
│   │   ├── auth.js             ← JWT verification, role check
│   │   └── upload.js           ← Multer image upload config
│   ├── models/
│   │   ├── User.js             ← User schema + password hashing
│   │   ├── Property.js         ← Property schema
│   │   ├── Enquiry.js          ← Enquiry schema
│   │   └── Favourite.js        ← Favourite schema
│   ├── routes/
│   │   ├── authRoutes.js       ← /api/auth endpoints
│   │   ├── propertyRoutes.js   ← /api/properties endpoints
│   │   ├── enquiryRoutes.js    ← /api/enquiries endpoints
│   │   ├── favouriteRoutes.js  ← /api/favourites endpoints
│   │   └── adminRoutes.js      ← /api/admin endpoints
│   ├── uploads/                ← Uploaded images stored here
│   ├── server.js               ← Main server entry point
│   ├── seed.js                 ← Create sample data
│   ├── .env                    ← Your environment variables
│   ├── .env.example            ← Template for .env
│   └── package.json
│
└── README.md
```

---

## 🚀 Installation Guide

### Prerequisites
- Node.js (v16 or higher) — Download from https://nodejs.org
- MongoDB Atlas account — Free at https://cloud.mongodb.com

### Step 1: Get MongoDB Connection String
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster (M0 Sandbox)
3. Click **Connect → Connect your application**
4. Copy the connection string (looks like: `mongodb+srv://...`)
5. Replace `<password>` with your actual password

### Step 2: Setup Backend

```bash
# Navigate to backend folder
cd StayFinder/backend

# Install all packages
npm install

# Edit the .env file and add your MongoDB URI
# Open .env in notepad and change MONGODB_URI

# Create admin account and sample data
node seed.js

# Start the development server
npm run dev
```

The backend will run on **http://localhost:5000**

### Step 3: Setup Frontend

The frontend is pure HTML/CSS/JS — no build step needed!

**Option A: Use Live Server (Recommended)**
1. Install VS Code extension: **Live Server** by Ritwick Dey
2. Right-click `index.html` → "Open with Live Server"
3. It will open at **http://127.0.0.1:5500**

**Option B: Double-click HTML files**
- Simply open any `.html` file in your browser
- Note: Some API calls may not work due to CORS in this mode

### Step 4: Test the Application

| Account | Email | Password | Role |
|---|---|---|---|
| Admin | admin@stayfinder.com | Admin@123 | Full admin access |
| Owner | owner@example.com | Owner@123 | Property owner |
| Student | Register at /register.html | Your choice | Student |

---

## 📡 API Documentation

**Base URL:** `http://localhost:5000/api`

**Authentication:** Add header `Authorization: Bearer <token>`

### Auth Endpoints
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /auth/register | No | Register new user |
| POST | /auth/login | No | Login and get token |
| GET | /auth/profile | Yes | Get own profile |
| PUT | /auth/profile | Yes | Update profile |

### Property Endpoints
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /properties | No | Get approved properties (with filters) |
| GET | /properties/:id | No | Get single property |
| POST | /properties | Owner | Create new property |
| PUT | /properties/:id | Owner | Update property |
| DELETE | /properties/:id | Owner/Admin | Delete property |
| GET | /properties/my-listings | Owner | Get owner's listings |
| PATCH | /properties/:id/availability | Owner | Toggle availability |

**Filter Query Params (GET /properties):**
- `city`, `locality`, `search` — text search
- `genderPreference` — Boys, Girls, Unisex
- `sharingType` — Single, Double, Triple
- `hasAC`, `hasFood` — true/false
- `minRent`, `maxRent` — price range
- `sortBy` — price_asc, price_desc

### Enquiry Endpoints
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /enquiries | Student | Submit enquiry |
| GET | /enquiries/my-enquiries | Student | Student's enquiries |
| GET | /enquiries/owner-enquiries | Owner | Enquiries for owner |
| GET | /enquiries | Admin | All enquiries |

### Favourite Endpoints
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /favourites | Student | Get saved properties |
| POST | /favourites | Student | Save a property |
| DELETE | /favourites/:propertyId | Student | Remove from saved |

### Admin Endpoints (admin role required)
| Method | Endpoint | Description |
|---|---|---|
| GET | /admin/stats | Dashboard statistics |
| GET | /admin/properties | All properties |
| PATCH | /admin/properties/:id/approve | Approve listing |
| PATCH | /admin/properties/:id/reject | Reject listing |
| GET | /admin/users | All users |
| PATCH | /admin/users/:id/toggle-status | Activate/deactivate user |

---

## 🧪 Testing Guide

### Manual Testing Checklist

**Authentication:**
- [ ] Register as a student
- [ ] Register as an owner
- [ ] Login as admin (admin@stayfinder.com / Admin@123)
- [ ] Logout and verify token is cleared
- [ ] Try accessing owner dashboard as student → should redirect

**Properties:**
- [ ] Submit a property as owner
- [ ] Check it appears as "pending" in owner dashboard
- [ ] Log in as admin and approve the property
- [ ] Verify approved property appears on explore page
- [ ] Search/filter properties on explore page
- [ ] View property details page

**Enquiries:**
- [ ] Send enquiry on a property (as student)
- [ ] Check enquiry appears in student dashboard
- [ ] Check enquiry appears in owner dashboard

**Favourites:**
- [ ] Click the heart icon on a property
- [ ] Check it appears in student saved properties

**Admin:**
- [ ] View dashboard stats
- [ ] Approve a pending property
- [ ] Reject a pending property
- [ ] View all students and owners

---

## 🔮 Future Scope

1. **Email Notifications** — Send email to owners when enquiry is received
2. **Google Maps Integration** — Show property location on map
3. **Review & Rating System** — Students rate properties after moving in
4. **Advanced Search** — Radius-based location search
5. **Chat System** — Real-time messaging between students and owners
6. **Cloudinary Integration** — Cloud-based image storage
7. **Mobile App** — React Native app for iOS and Android
8. **Subscription Plans** — Premium listings for owners
9. **Document Verification** — Owner identity verification system
10. **Analytics Dashboard** — Detailed stats for owners

---

## 👨‍💻 Viva Questions & Answers

**Q: What is REST API?**
A: REST (Representational State Transfer) API is a way for the frontend and backend to communicate using standard HTTP methods: GET (read), POST (create), PUT (update), DELETE (remove). Data is exchanged in JSON format.

**Q: Why do we use JWT for authentication?**
A: JWT (JSON Web Token) is a secure way to prove who you are without sending your password every time. After login, the server generates a token that is stored in the browser. Every future request includes this token so the server knows who you are.

**Q: What is bcrypt? Why is it used?**
A: bcrypt is a password hashing algorithm. When a user registers, we never store their actual password — instead, we store a hashed (scrambled) version. When they login, we hash the entered password and compare the hashes. This means even if the database is stolen, passwords are safe.

**Q: What is role-based authorization?**
A: Different users (student/owner/admin) can only access what they're permitted to. This is enforced on the BACKEND — not just by hiding buttons on the frontend. For example, even if someone manually calls the approve API, the server checks their role from the database.

**Q: What is Mongoose? Why use it with MongoDB?**
A: Mongoose is an Object Document Mapper (ODM) for MongoDB. It lets you define schemas (blueprints) for your data with validation rules. Without Mongoose, you could store inconsistent data. With it, MongoDB behaves more like a structured database.

**Q: Explain the MVC pattern used in this project.**
A: MVC = Model-View-Controller.
- **Model** (models/) — Defines data structure (User, Property)
- **View** — The frontend HTML files
- **Controller** (controllers/) — Business logic (what happens when API is called)
This separation makes code organized and easy to maintain.

---

*Built as a college academic project. StayFinder — Helping students find their home away from home.*
