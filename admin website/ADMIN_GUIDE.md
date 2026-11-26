ADMIN SETUP GUIDE
================

Current state:
- Site is static (HTML/CSS/JS) - no backend.
- Admin modal exists but is just demo (no auth/storage).

To make admin actually update site (recommended: build admin in a separate folder like esut-admin/):
Option 1: Use Netlify CMS / Decap CMS (easy, free) - add config.yml, admin/index.html
Option 2: Use Firebase (auth + realtime DB) - store news/events/courses in DB, load via JS
Option 3: Build simple Node.js + Express + JSON file storage (local or hosted)

Quick minimal approach (JSON + GitHub/Netlify):
- Create data.json with news, events, courses, staff
- Load data.json via fetch in pages
- Add admin page to edit data.json (needs backend to write)

For local-only editing:
- Use a small local server (live-server) + JSON file editor
- Or integrate with CMS

Recommendation:
- Keep current static site
- Add data.json
- Add admin.html with forms
- Use a lightweight backend (e.g. json-server for dev) or static CMS

Files needed to extend:
- data.json (content)
- admin.html (editing UI)
- scripts/load-content.js (render from JSON)
- scripts/admin-editor.js (edit/save)

Next steps:
1. Create data.json with current structure
2. Modify pages to load from JSON instead of hardcoded
3. Build admin interface
4. Connect to storage (Netlify/JSON Server)

This way admins can add/edit news, events, courses, staff, timetable info.
ADMIN SETUP GUIDE
================

Current state:
- Site is static (HTML/CSS/JS) - no backend.
- Admin modal exists but is just demo (no auth/storage).

To make admin actually update site (recommended: build admin in a separate folder like esut-admin/):
Option 1: Use Netlify CMS / Decap CMS (easy, free) - add config.yml, admin/index.html
Option 2: Use Firebase (auth + realtime DB) - store news/events/courses in DB, load via JS
Option 3: Build simple Node.js + Express + JSON file storage (local or hosted)

Quick minimal approach (JSON + GitHub/Netlify):
- Create data.json with news, events, courses, staff
- Load data.json via fetch in pages
- Add admin page to edit data.json (needs backend to write)

For local-only editing:
- Use a small local server (live-server) + JSON file editor
- Or integrate with CMS

Recommendation:
- Keep current static site
- Add data.json
- Add admin.html with forms
- Use a lightweight backend (e.g. json-server for dev) or static CMS

Files needed to extend:
- data.json (content)
- admin.html (editing UI)
- scripts/load-content.js (render from JSON)
- scripts/admin-editor.js (edit/save)

Next steps:
1. Create data.json with current structure
2. Modify pages to load from JSON instead of hardcoded
3. Build admin interface
4. Connect to storage (Netlify/JSON Server)

This way admins can add/edit news, events, courses, staff, timetable info.
/** Admin separate setup **/
Build admin in separate folder (e.g. esut-admin) not in same folder as public site.
- public site: esut website/ (static)
- admin: esut-admin/ (can be Netlify CMS or custom app)
Admin updates data (JSON/DB) and deploys/publishes changes to main site.
Admin updates data (JSON/DB) and deploys/publishes changes to main site.
