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
- **Admin website** (separate sub-app) for managing news, events, courses, and staff

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
├── site-data.js            # Site data (news, events, courses, staff)
├── vercel.json             # Vercel deployment config
├── .gitignore              # Git ignore rules
├── README.md               # This file
├── staff/                  # Staff photos (20 images)
├── Enugu-State-University-of-Science-and-Technology-logo.jpg
└── admin website/          # Admin sub-application
    ├── index.html          # Admin login
    ├── dashboard.html      # Admin dashboard
    ├── admin.js            # Admin logic
    ├── admin.css           # Admin styles
    └── ADMIN_GUIDE.md
```

## 🔐 Admin Website Integration

The admin website (in `admin website/`) is a separate sub-application that works together with the main website:

### How It Works

1. **Shared Data:** Both the main website and admin website use `site-data.js` and `localStorage` (key: `esut_department_data`). Since they're on the same domain, `localStorage` is shared between them.

2. **Admin Flow:**
   - Admin logs in at `admin website/index.html` (username: `admin`, password: `admin123`)
   - Admin adds/edits news, events, courses, or staff in the dashboard
   - Data is saved to `localStorage` via `site-data.js`
   - Main website reads from the same `localStorage` on page load
   - Changes reflect immediately when main website pages are refreshed

3. **Accessing Admin from Main Site:**
   - Every page has an admin modal (click to open, or use the login link)
   - Admin modal provides quick access to news management and full dashboard

### Demo Credentials

- **Username:** `admin`
- **Password:** `admin123`

> ⚠️ **Note:** This is a demo setup using `localStorage`. Data persists in the browser but is not shared across different browsers or devices. For production use with real data persistence, consider integrating with a backend (Firebase, Netlify CMS, or custom API).

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

## 📦 Files to Upload to GitHub

Upload all files EXCEPT those listed in `.gitignore`. Key files to include:

```
HTML files: index.html, about.html, academics.html, programs.html,
            course-descriptions.html, news.html, staff.html, contact.html
CSS files: style.css, responsive.css, admin website/admin.css
JS files: app.js, site-data.js, admin website/admin.js
Images: Enugu-State-University-of-Science-and-Technology-logo.jpg, staff/ folder
Config: vercel.json, .gitignore, README.md
Admin: admin website/index.html, admin website/dashboard.html
```

## 🐛 Troubleshooting

**Admin changes not showing on main site?**
- Make sure both sites are on the same domain (for localStorage sharing)
- Refresh the main website page after making admin changes
- Check browser console for errors

**Images not loading?**
- Verify image paths match exactly (case-sensitive)
- Check `staff/` folder contains all image files
- Broken images fall back to ESUT logo automatically

**Mobile menu not working?**
- Ensure Font Awesome CDN is loading (for hamburger icon)
- Check `app.js` is loaded after all HTML content

## 📄 License

© 2026 Department of Psychology, ESUT. All Rights Reserved.
