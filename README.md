# ESUT Department of Psychology Website

Official website for the Department of Psychology at Enugu State University of Science and Technology (ESUT).

## 📋 Overview

This is a static HTML/CSS/JavaScript website for the ESUT Department of Psychology. It includes:

- **Home page** with hero section, HOD profile, stats, and features
- **Staff page** with all department staff members arranged by rank
- **About page** with department motto, mission, philosophy, and objectives
- **Programs page** with undergraduate and postgraduate programme information
- **Academics page** with detailed course structure by level and semester
- **Course Descriptions page** with full syllabus for all courses
- **News & Events page** with announcements and current/past events
- **Contact page** with department contact information and contact form
- **Admin website** (separate sub-app) for managing news, events, courses, staff, and photo gallery

## 🚀 Deployment to Vercel

### Option 1: GitHub + Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: ESUT Psychology Department website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/esut-psychology.git
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the static HTML/CSS/JS setup
   - Click "Deploy"

3. **Your site will be live at:** `https://esut-psychology.vercel.app`

### Option 2: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

## 🔧 Backend Setup (Vercel KV)

For production with real-time data sync across all devices:

1. **Create Vercel KV Database:**
   - In Vercel Dashboard, go to Storage → Create Database → KV
   - Connect it to your project

2. **Set Environment Variables in Vercel:**
   - Go to Project Settings → Environment Variables
   - Add from `.env.example`:
     - `KV_REST_API_URL` (auto-populated when KV is connected)
     - `KV_REST_API_TOKEN` (auto-populated)
     - `ADMIN_USERNAME` (your secure admin username)
     - `ADMIN_PASSWORD` (your secure admin password)
     - `SESSION_SECRET` (generate a random 32+ character string)

3. **Redeploy** - Changes take effect on next deployment

## 📁 Project Structure

```
esut website/
├── index.html              # Home page
├── about.html              # About Us
├── academics.html          # Academics/Course structure
├── programs.html           # Academic Programs
├── course-descriptions.html# Course Descriptions
├── news.html               # News & Events
├── staff.html              # Staff Profiles
├── contact.html            # Contact
├── style.css               # Main stylesheet
├── responsive.css          # Mobile responsive styles
├── app.js                  # Main JavaScript
├── site-data.js            # Site data (news, events, courses, staff, gallery) + API client
├── vercel.json             # Vercel deployment config
├── package.json            # Node dependencies (@vercel/kv)
├── .gitignore              # Git ignore rules
├── .env.example            # Environment variables template
├── README.md               # This file
├── staff/                  # Staff photos (20 images)
├── Enugu-State-University-of-Science-and-Technology-logo.jpg
├── api/                    # Vercel Serverless Functions (Backend API)
│   ├── data.js             # Data CRUD API (news, events, courses, staff, gallery)
│   └── auth.js             # Authentication API (login, verify, logout)
└── admin website/          # Admin sub-application
    ├── index.html          # Admin login
    ├── dashboard.html      # Admin dashboard
    ├── admin.js            # Admin logic (API-based)
    ├── admin.css           # Admin styles
    └── ADMIN_GUIDE.md
```

## 🔐 Admin Website Integration

The admin website (in `admin website/`) works together with the main website via a **shared backend API**:

### How It Works (Production)

1. **Shared Backend (Vercel KV/Redis):**
   - Both main website and admin website read/write to the same Vercel KV database
   - Data persists across all browsers, devices, and sessions
   - Real-time sync: changes in admin reflect immediately on main site

2. **Authentication:**
   - Admin logs in at `admin website/index.html`
   - JWT-like session tokens stored in `localStorage` (HTTP-only cookie alternative)
   - Sessions validated via `/api/auth` endpoint
   - 24-hour session expiry

3. **Data Flow:**
   - Admin adds/edits news, events, courses, staff, or gallery images in dashboard
   - Data saved to Vercel KV via `/api/data` endpoint
   - Main website fetches from KV on page load (with 30s cache)
   - `esutDataChanged` event notifies open admin tabs to refresh
   - Changes reflect immediately across all devices/browsers

4. **Fallback (Local Development):**
   - On `localhost`, uses `localStorage` instead of API
   - No Vercel KV required for local development
   - Seamless transition to production

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/data` | GET | Fetch all data (news, events, courses, staff, gallery) |
| `/api/data` | POST | Create/update/delete items |
| `/api/auth` | POST | Login, verify session, logout |

## 🎨 Design System

- **Primary Color:** `#701500` (Deep Red/Burgundy)
- **Secondary Color:** `#f67665` (Soft Red/Coral)
- **Gold Accent:** `#d9b15a`
- **Pink Accent:** `#ff70a6`
- **Font:** Poppins (via Google Fonts)
- **Icons:** Font Awesome 6.4.0

## 📱 Responsive Design

The website is fully responsive with:
- Mobile-friendly navigation (hamburger menu)
- Responsive staff card grid (auto-fit columns)
- Scalable typography using `clamp()`
- Touch-friendly buttons and forms

## 🛠️ Recent Updates

### Home Page (index.html)
- ✅ Added HOD photo (rectangular, not circular) with real image from `staff/` folder
- ✅ Added HOD name and "View All Staff" button
- ✅ Added admin modal for site-wide admin access
- ✅ Added `site-data.js` integration for news display
- ✅ **Animated counting statistics** (1000+ Students, 30+ Staff, 15+ Years, 100+ Projects)

### Staff Page (staff.html)
- ✅ Removed Academic/Admin split — all staff in one unified grid
- ✅ Removed filter buttons (Academic/Administrative)
- ✅ Staff arranged by rank: PROF → ASSOC → DR → Others (alphabetically within each group)
- ✅ Each staff card: rectangular photo (260px) + name + role below
- ✅ Hover animations: card lift, photo zoom, name color change
- ✅ Staggered fade-in reveal on load
- ✅ HOD featured section restored above grid with contact details and quote
- ✅ HOD removed from staff list (no duplication)
- ✅ Uses `site-data.js` for staff data (admin changes reflect immediately)
- ✅ Broken image fallback to ESUT logo
- ✅ Lazy loading for all staff photos

### News & Events Page (news.html)
- ✅ Fixed announcements display from admin data
- ✅ **Photo Gallery management** — upload images with descriptions from admin
- ✅ Gallery displays on news page with hover overlay

### All Pages
- ✅ Added admin modal to every page (index, about, academics, programs, contact, news, staff, course-descriptions)
- ✅ Removed BOM characters from all HTML files
- ✅ Removed leading blank lines from course-descriptions.html
- ✅ Added `site-data.js` to pages that were missing it
- ✅ Fixed inconsistent staff data (misspelled "Industrial", different roles)
- ✅ Removed duplicate/conflicting CSS blocks

### Styles (style.css)
- ✅ Staff cards: 260px photo height, compact info section, hover effects
- ✅ Gallery grid: responsive auto-fit columns (min 240px)
- ✅ HOD photo: rectangular with gold border, scale-on-hover
- ✅ Admin modal styling
- ✅ Removed conflicting `.gallery-item:hover` rotation
- ✅ Removed duplicate `.staff-card` CSS blocks

### Backend & Admin (NEW)
- ✅ Vercel Serverless Functions for API (`/api/data`, `/api/auth`)
- ✅ Vercel KV (Redis) integration for persistent data storage
- ✅ API-based authentication with session tokens
- ✅ Cross-device data synchronization
- ✅ Real-time updates via custom events
- ✅ Local development fallback to localStorage
- ✅ Loading states and error handling in admin dashboard
- ✅ Image upload as base64 for staff photos
- ✅ **Photo Gallery CRUD** in admin dashboard
- ✅ **Admin warning banner** on overview page
- ✅ **Mobile-responsive admin dashboard** with sidebar toggle

## 📦 Files to Upload to GitHub

Upload all files EXCEPT those listed in `.gitignore`. Key files to include:

```
HTML files: index.html, about.html, academics.html, programs.html,
            course-descriptions.html, news.html, staff.html, contact.html
CSS files: style.css, responsive.css, admin website/admin.css
JS files: app.js, site-data.js, admin website/admin.js
Images: Enugu-State-University-of-Science-and-Technology-logo.jpg, staff/ folder
Config: vercel.json, package.json, .gitignore, .env.example, README.md
Admin: admin website/index.html, admin website/dashboard.html
API: api/data.js, api/auth.js
```

## 🐛 Troubleshooting

**Admin changes not showing on main site?**
- Make sure Vercel KV is connected and environment variables are set
- Check browser console for API errors
- Refresh the main website page after making admin changes
- Verify `/api/data` returns updated data

**Images not loading?**
- Verify image paths match exactly (case-sensitive)
- Check `staff/` folder contains all image files
- Broken images fall back to ESUT logo automatically

**Mobile menu not working?**
- Ensure Font Awesome CDN is loading (for hamburger icon)
- Check `app.js` is loaded after all HTML content

**Admin login fails?**
- Verify `ADMIN_USERNAME` and `ADMIN_PASSWORD` in Vercel Environment Variables
- Check Vercel KV is connected (required for sessions)
- Clear browser localStorage and try again

## 📄 License

© 2026 Department of Psychology, ESUT. All Rights Reserved.