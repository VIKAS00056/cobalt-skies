# ⚡ COBALT SKIES – National College Fest Web Platform

![Cobalt Skies Header](https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=80)

**COBALT SKIES 2026** is a modern, responsive, national-level college fest management and ticketing web platform. Built with a futuristic **Cobalt Blue & Cyberpunk Dark Navy** aesthetic, it empowers thousands of collegiate students to explore cultural spectacles, participate in competitive esports tournaments, register team squads, and make secure online UPI payments via Razorpay.

---

## 🌟 Key Features

### 1. 🌌 Futuristic Aesthetic & UI/UX Design
- **Theme Palette**: Deep Space Navy (`#050B18`), Iconic Cobalt Blue (`#0047AB`), Electric Cyan (`#00F0FF`), and Neon Glow accents.
- **Glassmorphism**: Translucent backdrop-filtered panels and glowing borders.
- **Micro-Interactions**: Hover states, smooth card scaling, dynamic status badges, and confetti celebration on successful registrations.
- **Live Countdown**: Animated Days, Hours, Minutes, and Seconds countdown timer ticking toward festival blastoff on **November 20, 2026**.

### 2. 🎪 Festival Events (Technical & Cultural)
- Dedicated Events portal with instant search, category filtering (Technical, Cultural, Literary, Fine Arts, Management, Music & Dance, Workshop).
- Solo vs. Team format filters and entry fee sorting.
- Dynamic Event Details page featuring high-res banners, comprehensive guidelines, judging criteria, eligibility, and cash prize tiers.

### 3. 🎮 Dedicated Arcade & Esports Coliseum
- **Completely Separate Section**: Gaming tournaments are segregated from general cultural events with a distinct cyber/arcade neon visual style.
- PC LAN brackets (Valorant 240Hz), Mobile Squad Warzones (BGMI), Console Duels (PS5 EA FC 25 & Tekken 8), and physical arenas (Neon Laser Tag, Blitz Chess).
- Slot fill meters and tournament format rules.

### 4. 💳 Razorpay UPI Payment & Registration Engine
- **Server-Side Fee Integrity**: Entry fees are strictly computed on the backend from database models—never trusting client-side parameters.
- **UPI Support**: Native integration for Google Pay, PhonePe, Paytm, BHIM, and UPI QR codes via Razorpay Orders API.
- **Signature Verification**: Cryptographic HMAC-SHA256 signature verification protects against tampering.
- **Webhook Reconciliation**: Handles `payment.captured` and `payment.failed` webhook callbacks.
- **Duplicate Registration Prevention**: Automatically blocks duplicate paid registrations by the same student for the same event.
- **Integrated Test Mode**: Includes an interactive UPI simulation gateway when Razorpay test keys are not configured, ensuring seamless local evaluation without payment errors.

### 5. 🎟️ Digital Gate Pass & Receipt Generator
- Generates unique festival IDs (e.g., `CS26-EVT-8921` or `CS26-GAM-4091`).
- Interactive printable E-Ticket modal featuring festival security seals, verification QR code payload, and one-click print-to-PDF support.

### 6. 🛡️ Role-Based Admin Management Console
- Protected by JWT authentication and admin role enforcement (`/admin`).
- **Command Dashboard**: Total users, total events, total games, registration counts, verified revenue in INR (₹), and live registration feed.
- **Event & Game Management**: Complete CRUD operations, poster management, fee updates, team roster configurations, and live registration toggle.
- **Registration Management**: Inspect attendees, review team rosters, export full attendee lists to CSV, and cancel registrations.
- **Payments Ledger**: Comprehensive audit trail of transaction IDs, Razorpay order IDs, status filters, and revenue export.
- **User Management**: View delegates, institutions, contact info, and suspend/reactivate accounts.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v7, Framer Motion, Lucide React, Canvas Confetti |
| **Backend** | Node.js (ES Modules), Express.js, Mongoose, Helmet, CORS, Morgan, Express Rate Limit |
| **Database** | MongoDB & MongoDB Atlas (with automatic zero-setup Embedded In-Memory MongoDB fallback) |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs password hashing, RBAC middleware |
| **Payment Gateway** | Razorpay SDK, UPI QR, HMAC-SHA256 signature verification, Webhook listeners |

---

## 📂 Project Directory Structure

```
Cobalt Skies/
├── backend/
│   ├── src/
│   │   ├── config/             # MongoDB connection & Razorpay initialization
│   │   ├── controllers/        # Auth, Events, Games, Registrations, Payments, Admin
│   │   ├── middleware/         # Auth, Admin role verification, Rate limiting, Error handling
│   │   ├── models/             # User, Event, Game, Registration, Payment Mongoose schemas
│   │   ├── routes/             # Express API routes
│   │   ├── utils/              # Token generation, Receipt generator, Seed data
│   │   ├── scripts/            # Database seed script & E2E integration test suite
│   │   └── server.js           # Server entry point
│   ├── .env.example            # Backend environment variables template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/             # Images and visual branding
│   │   ├── components/         # Navbar, Footer, CountdownTimer, Cards, Modals
│   │   │   ├── common/         # ReceiptModal, ProtectedRoute, AdminRoute, Toast
│   │   │   ├── events/         # EventCard, EventFilters
│   │   │   ├── games/          # GameCard, GameFilters
│   │   │   └── registration/   # 2-Step Registration & UPI Payment Modal
│   │   ├── context/            # AuthContext, NotificationContext
│   │   ├── layouts/            # MainLayout, AdminLayout with AdminSidebar
│   │   ├── pages/              # Home, Events, Games, Login, Signup, Dashboard, Admin views
│   │   ├── services/           # API fetch wrappers (auth, event, game, payment, admin)
│   │   ├── App.jsx             # React Router configuration
│   │   ├── main.jsx            # React root mount
│   │   └── index.css           # Tailwind directives and cyber styles
│   ├── index.html              # HTML shell with Razorpay SDK script tag
│   ├── vite.config.js          # Vite config with API proxy
│   ├── tailwind.config.js      # Custom theme colors and glow shadows
│   ├── .env.example            # Frontend environment variables template
│   └── package.json
│
├── package.json                # Root orchestration scripts
└── README.md                   # Documentation & guide
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js** v18+ (tested on Node v20/v24)
- **npm** or **pnpm**
- *(Optional)* MongoDB installed locally or a free MongoDB Atlas connection URI. If omitted, the backend automatically uses an embedded in-memory MongoDB server for instant local evaluation!

---

### Step 1: Install Dependencies

#### Install Backend:
```bash
cd backend
npm install
```

#### Install Frontend:
```bash
cd ../frontend
npm install
```

---

### Step 2: Configure Environment Variables

#### Backend Configuration (`backend/.env`):
Copy `backend/.env.example` to `backend/.env`:
```bash
cd backend
cp .env.example .env
```
Default configuration values:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Leave blank to use instant embedded in-memory MongoDB:
MONGODB_URI=

JWT_SECRET=cobalt_skies_jwt_secret_key_2026_super_secure_fest_platform
JWT_EXPIRE=7d

# Default Administrator Account (Auto-created on seed)
ADMIN_EMAIL=admin@cobaltskies.com
ADMIN_PASSWORD=AdminPassword@2026

# Razorpay Credentials (Leave demo keys or supply your Razorpay Test keys)
RAZORPAY_KEY_ID=rzp_test_DEMO_KEY
RAZORPAY_KEY_SECRET=your_key_secret_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

#### Frontend Configuration (`frontend/.env`):
Copy `frontend/.env.example` to `frontend/.env`:
```bash
cd frontend
cp .env.example .env
```
Default configuration:
```env
VITE_API_URL=/api
VITE_FEST_NAME=COBALT SKIES
VITE_FEST_YEAR=2026
```

---

### Step 3: Run the Application

#### Option A: Run Backend Server
```bash
cd backend
npm start
```
*The backend automatically connects to MongoDB, seeds the Chief Administrator account, 8 fest events, 6 esports tournaments, and sample participant registrations, then listens on `http://localhost:5000`.*

#### Option B: Run Frontend Development Server
In a separate terminal:
```bash
cd frontend
npm run dev
```
Open your browser at: **`http://localhost:5173`**

---

## 🔑 Default Accounts & Credentials

The platform comes pre-seeded with sample credentials for immediate testing:

| Role | Email Address | Password | Permissions |
|---|---|---|---|
| **Chief Fest Administrator** | `admin@cobaltskies.com` | `AdminPassword@2026` | Full CRUD access to events, games, registrations, payments ledger, and user management (`/admin`) |
| **Demo Participant** | `aarav@example.com` | `Password@123` | User dashboard access, registered event passes, and receipt downloads |

*(You can also use the **Demo Quick-Fill Buttons** on the Login page to sign in with one click!)*

---

## 💳 Razorpay UPI Payment Configuration

1. Log into your [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Navigate to **Settings → API Keys** and generate a **Test Key ID & Key Secret**.
3. Place them in `backend/.env`:
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxxx
   RAZORPAY_KEY_SECRET=xxxxxx
   ```
4. **Webhook Setup (Optional)**:
   - In Razorpay Dashboard, go to **Settings → Webhooks**.
   - Add endpoint URL: `https://your-domain.com/api/payments/webhook`.
   - Subscribe to events: `payment.captured`, `payment.failed`.
   - Set secret in `backend/.env` as `RAZORPAY_WEBHOOK_SECRET`.
5. **Zero-Configuration Test Mode**:
   - If real Razorpay keys are not provided, the platform automatically activates its **Interactive UPI Test Simulator**. Users can select Google Pay, PhonePe, Paytm, or BHIM UPI, scan the QR code, and complete verified test registrations with official digital receipts!

---

## 🧪 Automated End-to-End Test Suite

Run the full automated integration test suite validating authentication, rate limiting, event retrieval, payment verification, and admin CSV exports:

```bash
cd backend
# With backend server running on port 5000:
node src/scripts/test-e2e.js
```

Expected Output:
```
--- Starting COBALT SKIES End-to-End Test Suite ---
✅ PASS: Health check endpoint returns 200 healthy
✅ PASS: Fetch events returns 8 items
✅ PASS: Fetch games returns 6 items
✅ PASS: Admin login succeeds with JWT token
✅ PASS: Participant registration succeeds with JWT token
✅ PASS: Participant login succeeds
✅ PASS: Payment order creation returns valid orderId and registrationId
✅ PASS: Payment verification marks registration as PAID with QR payload
✅ PASS: Participant can retrieve confirmed event pass (1 items)
✅ PASS: Admin stats returns totalRegistrations = 3, revenue = ₹550
✅ PASS: Normal participant blocked from admin routes (HTTP 403)
✅ PASS: Admin can export registrations CSV with proper headers

--- Test Suite Summary: ALL PASSED 🎉 ---
```

---

## 📚 REST API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new student participant account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/profile` | Private | Retrieve logged-in profile |
| `PUT` | `/api/auth/profile` | Private | Update user details or password |
| `POST` | `/api/auth/forgot-password` | Public | Password reset request |

### 🎪 Fest Events (`/api/events`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/events` | Public | List events with search, category, type & sort filters |
| `GET` | `/api/events/:identifier`| Public | Fetch single event by slug or MongoDB ObjectId |
| `POST` | `/api/events` | Admin | Create new fest event with rules, poster, and fees |
| `PUT` | `/api/events/:id` | Admin | Update existing event |
| `DELETE` | `/api/events/:id` | Admin | Delete event |

### 🎮 Gaming Tournaments (`/api/games`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/games` | Public | List all arcade & esports tournaments |
| `GET` | `/api/games/:identifier` | Public | Fetch single game by slug or ID |
| `POST` | `/api/games` | Admin | Create gaming tournament |
| `PUT` | `/api/games/:id` | Admin | Update tournament details |
| `DELETE` | `/api/games/:id` | Admin | Delete game |

### 💳 Registrations & Payments (`/api/registrations`, `/api/payments`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/payments/create-order` | Private | Generate Razorpay Order ID & create pending pass |
| `POST` | `/api/payments/verify` | Private | Verify cryptographic signature and confirm registration |
| `POST` | `/api/payments/webhook` | Public | Razorpay webhook listener |
| `GET` | `/api/registrations/my-registrations` | Private | Get user's event & game entry passes |
| `GET` | `/api/registrations/:identifier` | Private | Get single registration receipt with QR payload |

### 🛡️ Admin Console (`/api/admin`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/stats` | Admin | Aggregated stats: revenue, tickets, counts, top events |
| `GET` | `/api/admin/users` | Admin | Search and inspect registered student accounts |
| `PATCH` | `/api/admin/users/:id/toggle-block` | Admin | Suspend or reactivate user account |
| `GET` | `/api/admin/payments` | Admin | View complete payments audit ledger |
| `GET` | `/api/admin/export/registrations` | Admin | Download attendee registration roster as CSV |
| `GET` | `/api/admin/export/payments` | Admin | Download revenue and payment records as CSV |

---

## 🌐 Production Deployment Guide

### 1. Database (MongoDB Atlas)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Whitelist your server IP address (or `0.0.0.0/0` for cloud deployment).
3. Copy your connection string into `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/cobalt_skies?retryWrites=true&w=majority
   ```

### 2. Backend Deployment (Render / Railway / AWS EC2)
1. Set the root directory to `backend`.
2. Build command: `npm install`
3. Start command: `node src/server.js`
4. Add all environment variables from `backend/.env`.

### 3. Frontend Deployment (Vercel / Netlify / Firebase Hosting)
1. Build command: `npm run build`
2. Output directory: `dist`
3. Set environment variable:
   ```env
   VITE_API_URL=https://your-backend-domain.com/api
   ```
4. Configure SPA rewrite rules so client-side routing works smoothly:
   - For Vercel: Add `vercel.json` with rewrite to `index.html`.
   - For Netlify: Add `_redirects` file with `/* /index.html 200`.

---

## 🏆 Project Showcase Checklist

- [x] Full-stack architecture (React 18 + Vite + Node.js + Express + MongoDB)
- [x] National-level fest aesthetic in Cobalt Blue & Space Navy
- [x] Responsive layout across Desktop, Tablet, and Mobile devices
- [x] Live days, hours, minutes, seconds countdown timer
- [x] Dedicated, segregated Arcade & Esports section
- [x] Server-side fee calculation (never trusts frontend amounts)
- [x] UPI QR and payment gateway integration with Razorpay
- [x] Cryptographic HMAC-SHA256 signature verification & webhooks
- [x] Printable digital E-Ticket & Receipt generator with QR code
- [x] Role-protected Admin Command Console
- [x] CSV exports for attendee registrations and revenue audits
- [x] Seed data & automated End-to-End integration test suite

---

*Designed and engineered with pride for collegiate innovators and champions. Welcome to COBALT SKIES 2026!*
