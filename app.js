function openAdminDashboard() {
    document.getElementById('adminModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeAdminDashboard() {
    document.getElementById('adminModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('newsManager').style.display = 'none';
    document.getElementById('adminLoginForm').reset();
}

function handleAdminLogin(e) {
    e.preventDefault();
    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value.trim();
    const msgEl = document.getElementById('adminLoginMessage');

    if (username === 'admin' && password === 'iamadmin22#') {
        try {
            localStorage.setItem('esutAdminSession', JSON.stringify({
                username: 'admin',
                token: `esut_modal_${Date.now()}_${Math.random().toString(36).slice(2, 16)}`,
                expiresAt: Date.now() + 24 * 60 * 60 * 1000
            }));
        } catch (e) {}
        document.querySelector('.admin-login').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        if (msgEl) { msgEl.textContent = ''; }
    } else {
        if (msgEl) {
            msgEl.textContent = 'Invalid username or password.';
            msgEl.style.color = '#b42318';
        }
    }
}

function showNewsManager() {
    const news = document.getElementById('newsManager');
    news.style.display = news.style.display === 'none' ? 'block' : 'none';
}

/* ---------------------------------------------------------------------------
 * Site-wide search (homepage) and live course filter (course descriptions)
 * ------------------------------------------------------------------------ */

var PAGE_INDEX = [
    {t:"Home", u:"index.html", k:"home department of psychology esut"},
    {t:"About Us", u:"about.html", k:"about history mission vision hod welcome"},
    {t:"Programs", u:"programs.html", k:"program programmes undergraduate ics postgraduate pgd msc phd"},
    {t:"Academics", u:"academics.html", k:"academics curriculum course structure levels semesters"},
    {t:"Course Descriptions", u:"course-descriptions.html", k:"course descriptions syllabus contents outcomes"},
    {t:"News & Events", u:"news.html", k:"news events announcements updates"},
    {t:"Staff", u:"staff.html", k:"staff faculty academic administrative"},
    {t:"Contact", u:"contact.html", k:"contact address email phone location"}
];

var COURSE_INDEX = [
        {c:"GST 111", t:"Communication in English", l:100, u:"course-descriptions.html#course-GST-111"},
        {c:"PSY 101", t:"Introduction to Psychology", l:100, u:"course-descriptions.html#course-PSY-101"},
        {c:"PSY 103", t:"Learning Processes I", l:100, u:"course-descriptions.html#course-PSY-103"},
        {c:"PSY 105", t:"Ethics in Psychology", l:100, u:"course-descriptions.html#course-PSY-105"},
        {c:"ESUT-PSY107", t:"Information and Communication Psychology", l:100, u:"course-descriptions.html#course-ESUT-PSY107"},
        {c:"ESUT-PSY109", t:"Psychology of Suicide Markers and Prevention", l:100, u:"course-descriptions.html#course-ESUT-PSY109"},
        {c:"ESUT-PSY 111", t:"Psychology of Social Judgment and Decision Making", l:100, u:"course-descriptions.html#course-ESUT-PSY-111"},
        {c:"AIPSY 101", t:"Digital Methods and Data Foundations for Psychology", l:100, u:"course-descriptions.html#course-AIPSY-101"},
        {c:"GSD 121", t:"Foundations of Innovative Thinking", l:100, u:"course-descriptions.html#course-GSD-121"},
        {c:"GST 112", t:"Nigerian Peoples and Culture", l:100, u:"course-descriptions.html#course-GST-112"},
        {c:"PSY 102", t:"Determinants of Behaviour", l:100, u:"course-descriptions.html#course-PSY-102"},
        {c:"PSY 104", t:"Quantitative Methods in Psychology", l:100, u:"course-descriptions.html#course-PSY-104"},
        {c:"ESUT-PSY106", t:"Psychology of African Belief System", l:100, u:"course-descriptions.html#course-ESUT-PSY106"},
        {c:"ESUT-PSY108", t:"Psychology of Harmony", l:100, u:"course-descriptions.html#course-ESUT-PSY108"},
        {c:"ESUT-PSY 110", t:"Psychology of Sexual Deviance and Prevention", l:100, u:"course-descriptions.html#course-ESUT-PSY-110"},
        {c:"ESUT-PSY 112", t:"Psychology of Adolescence and Reproductive Health", l:100, u:"course-descriptions.html#course-ESUT-PSY-112"},
        {c:"ESUT-PSY 114", t:"Psychology of Peace and Conflict Management", l:100, u:"course-descriptions.html#course-ESUT-PSY-114"},
        {c:"AIPSY 102", t:"Artificial Intelligence, Digital Ethics and Data Protection for Psychologists", l:100, u:"course-descriptions.html#course-AIPSY-102"},
        {c:"ENT 211", t:"Entrepreneurship and Innovation", l:200, u:"course-descriptions.html#course-ENT-211"},
        {c:"PSY 201", t:"General Experimental Psychology", l:200, u:"course-descriptions.html#course-PSY-201"},
        {c:"PSY 203", t:"Industrial/Organisational Psychology", l:200, u:"course-descriptions.html#course-PSY-203"},
        {c:"PSY 205", t:"Developmental Psychology I: Childhood and Adolescence", l:200, u:"course-descriptions.html#course-PSY-205"},
        {c:"PSY 207", t:"Psychology of Personality and Assessment", l:200, u:"course-descriptions.html#course-PSY-207"},
        {c:"PSY 209", t:"Health Psychology", l:200, u:"course-descriptions.html#course-PSY-209"},
        {c:"ESUT-EDU 205", t:"Introduction to Online Learning", l:200, u:"course-descriptions.html#course-ESUT-EDU-205"},
        {c:"ESUT-PSY 211", t:"Psychology of Inter-Communal Relations", l:200, u:"course-descriptions.html#course-ESUT-PSY-211"},
        {c:"AIPSY 201", t:"Applied Machine Learning for Behavioral Data", l:200, u:"course-descriptions.html#course-AIPSY-201"},
        {c:"GSD 221", t:"Seeing Innovation Whole: Disruption and Nondisruptive Creation", l:200, u:"course-descriptions.html#course-GSD-221"},
        {c:"GST 212", t:"Philosophy, Logic and Human Existence", l:200, u:"course-descriptions.html#course-GST-212"},
        {c:"SSC 202", t:"Introduction to Computer and its Application", l:200, u:"course-descriptions.html#course-SSC-202"},
        {c:"PSY 202", t:"Physiological Psychology", l:200, u:"course-descriptions.html#course-PSY-202"},
        {c:"PSY 204", t:"Introduction to Social Psychology", l:200, u:"course-descriptions.html#course-PSY-204"},
        {c:"PSY 206", t:"Developmental Psychology II: Adulthood and Aging", l:200, u:"course-descriptions.html#course-PSY-206"},
        {c:"PSY 208", t:"Positive Psychology", l:200, u:"course-descriptions.html#course-PSY-208"},
        {c:"ESUT-ENV 202", t:"Environmental Awareness and Protection", l:200, u:"course-descriptions.html#course-ESUT-ENV-202"},
        {c:"ESUT-PSY 210", t:"Psychology of Personnel and Human Resource Management", l:200, u:"course-descriptions.html#course-ESUT-PSY-210"},
        {c:"AIPSY 202", t:"Computational Psychometrics and Quantitative Methods", l:200, u:"course-descriptions.html#course-AIPSY-202"},
        {c:"SSC 301", t:"Innovation in the Social Sciences", l:300, u:"course-descriptions.html#course-SSC-301"},
        {c:"PSY 301", t:"Clinical Psychology", l:300, u:"course-descriptions.html#course-PSY-301"},
        {c:"PSY 303", t:"Gender Psychology", l:300, u:"course-descriptions.html#course-PSY-303"},
        {c:"PSY 305", t:"Psychological Testing and Test Construction", l:300, u:"course-descriptions.html#course-PSY-305"},
        {c:"PSY 307", t:"Statistical Methods in Psychology", l:300, u:"course-descriptions.html#course-PSY-307"},
        {c:"PSY 309", t:"Cognitive Psychology", l:300, u:"course-descriptions.html#course-PSY-309"},
        {c:"ESUT-PSY 311", t:"Psychology of Relations and Marital Life", l:300, u:"course-descriptions.html#course-ESUT-PSY-311"},
        {c:"ESUT-PSY 313", t:"Psychology of Work, Family and Life Interface", l:300, u:"course-descriptions.html#course-ESUT-PSY-313"},
        {c:"AIPSY 301", t:"Natural Language Processing and Affective Computing for Mental Health", l:300, u:"course-descriptions.html#course-AIPSY-301"},
        {c:"AIPSY 303", t:"Digital Mental-Health Tools and Behavioral Sensing", l:300, u:"course-descriptions.html#course-AIPSY-303"},
        {c:"GSD 321", t:"Building Market-Creating Innovation", l:300, u:"course-descriptions.html#course-GSD-321"},
        {c:"GST 312", t:"Peace and Conflict Resolution", l:300, u:"course-descriptions.html#course-GST-312"},
        {c:"ENT 312", t:"Venture Creation", l:300, u:"course-descriptions.html#course-ENT-312"},
        {c:"SSC 302", t:"Research Method I", l:300, u:"course-descriptions.html#course-SSC-302"},
        {c:"PSY 302", t:"Psychology of Mental Challenge", l:300, u:"course-descriptions.html#course-PSY-302"},
        {c:"PSY 304", t:"Psychology of Substance Use Disorder", l:300, u:"course-descriptions.html#course-PSY-304"},
        {c:"PSY 306", t:"Research Methods in Psychology", l:300, u:"course-descriptions.html#course-PSY-306"},
        {c:"PSY 308", t:"Environmental Psychology", l:300, u:"course-descriptions.html#course-PSY-308"},
        {c:"PSY 310", t:"Field Experience", l:300, u:"course-descriptions.html#course-PSY-310"},
        {c:"AIPSY 302", t:"Generative AI and Agentic Systems for Psychological Practice", l:300, u:"course-descriptions.html#course-AIPSY-302"},
        {c:"SSC 401", t:"Research Method II", l:400, u:"course-descriptions.html#course-SSC-401"},
        {c:"PSY 401", t:"Psychology of Terrorism and Trauma Management", l:400, u:"course-descriptions.html#course-PSY-401"},
        {c:"PSY 403", t:"Practicum in Psychotherapy", l:400, u:"course-descriptions.html#course-PSY-403"},
        {c:"PSY 405", t:"Forensic Psychology", l:400, u:"course-descriptions.html#course-PSY-405"},
        {c:"PSY 407", t:"Psychology of Social Change", l:400, u:"course-descriptions.html#course-PSY-407"},
        {c:"ESUT-PSY 409", t:"Marketing and Consumer Psychology", l:400, u:"course-descriptions.html#course-ESUT-PSY-409"},
        {c:"ESUT-PSY 411", t:"Psychology of Security Personnel Management", l:400, u:"course-descriptions.html#course-ESUT-PSY-411"},
        {c:"ESUT-PSY 413", t:"Child Abuse", l:400, u:"course-descriptions.html#course-ESUT-PSY-413"},
        {c:"AIPSY 401", t:"Responsible Artificial Intelligence in Mental Health and Human-Centered Systems", l:400, u:"course-descriptions.html#course-AIPSY-401"},
        {c:"AIPSY 403", t:"Technology Law, AI Governance and the Wellbeing-Technology Innovation Venture", l:400, u:"course-descriptions.html#course-AIPSY-403"},
        {c:"GSD 421", t:"Disruption Capstone: Strategy, Ethics and the Graduate Thesis", l:400, u:"course-descriptions.html#course-GSD-421"},
        {c:"PSY 402", t:"Advanced Psycho-biological Study of Behaviour and Psychopharmacology", l:400, u:"course-descriptions.html#course-PSY-402"},
        {c:"PSY 404", t:"Advanced Clinical Psychology", l:400, u:"course-descriptions.html#course-PSY-404"},
        {c:"PSY 406", t:"Research Project", l:400, u:"course-descriptions.html#course-PSY-406"},
        {c:"ESUT-PSY 408", t:"Psychology of Occupational, Vocational and Career Development", l:400, u:"course-descriptions.html#course-ESUT-PSY-408"},
        {c:"ESUT-PSY 410", t:"Psychology of Industrial Relations", l:400, u:"course-descriptions.html#course-ESUT-PSY-410"},
        {c:"ESUT-PSY 412", t:"Psychology of Death, Grief and Bereavement", l:400, u:"course-descriptions.html#course-ESUT-PSY-412"},
        {c:"ESUT-PSY 414", t:"Psychology of Ageing and Life Satisfaction", l:400, u:"course-descriptions.html#course-ESUT-PSY-414"},
        {c:"AIPSY 402", t:"Data Security, Privacy Engineering and Online Safety for Psychology", l:400, u:"course-descriptions.html#course-AIPSY-402"},
        {c:"AIPSY 404", t:"Applied Psychological-AI Capstone: Build, Deploy and Defend", l:400, u:"course-descriptions.html#course-AIPSY-404"}
    ];

/* ---------------------------------------------------------------------------
 * Course index is injected between app_part1.js and app_part2.js at build.
 * ------------------------------------------------------------------------ */

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
}

function performSearch() {
    var input = document.getElementById('homeSearch');
    var resultsDiv = document.getElementById('searchResults');
    if (!input || !resultsDiv) return;
    var raw = input.value.trim();
    var query = raw.toLowerCase();
    resultsDiv.innerHTML = '';
    if (!query) {
        resultsDiv.innerHTML = '<div class="search-result-item">Please enter a search term.</div>';
        return;
    }
    var terms = query.split(/\s+/);
    var matches = [];

    PAGE_INDEX.forEach(function (p) {
        var hay = (p.t + ' ' + (p.k || '')).toLowerCase();
        if (terms.every(function (t) { return hay.indexOf(t) !== -1; })) {
            matches.push({ title: p.t, url: p.u, type: 'Page', level: null });
        }
    });
    COURSE_INDEX.forEach(function (c) {
        var hay = (c.c + ' ' + c.t).toLowerCase();
        if (terms.every(function (t) { return hay.indexOf(t) !== -1; })) {
            matches.push({ title: c.c + ' — ' + c.t, url: c.u, type: 'Course', level: c.l });
        }
    });

    if (matches.length === 0) {
        resultsDiv.innerHTML = '<div class="search-result-item">No results found for &ldquo;' + escapeHtml(raw) + '&rdquo;. Try a course code (e.g. PSY 101, AIPSY 401) or a keyword.</div>';
        return;
    }
    var shown = matches.slice(0, 12);
    var html = shown.map(function (m) {
        var badge = m.level ? m.type + ' &middot; Level ' + m.level : m.type;
        return '<div class="search-result-item"><a href="' + m.url + '" style="color:var(--primary); font-weight:600;">' + escapeHtml(m.title) + '</a> <small style="color:var(--secondary);">(' + badge + ')</small></div>';
    }).join('');
    if (matches.length > shown.length) {
        html += '<div class="search-result-item"><small>&hellip;and ' + (matches.length - shown.length) + ' more. Keep typing to narrow down.</small></div>';
    }
    resultsDiv.innerHTML = html;
}

function initHomeSearch() {
    var input = document.getElementById('homeSearch');
    if (!input) return;
    input.addEventListener('input', performSearch);
    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); performSearch(); }
    });
}

function initCourseFilter() {
    var input = document.getElementById('courseSearchInput');
    if (!input) return;
    var status = document.getElementById('courseSearchStatus');
    var clearBtn = document.getElementById('courseSearchClear');
    var suggestions = document.getElementById('courseSuggestions');
    var articles = Array.prototype.slice.call(document.querySelectorAll('.course-description-item'));
    var sections = Array.prototype.slice.call(document.querySelectorAll('.level-section'));

    function showSuggestions(terms) {
        if (!suggestions || !terms.length) {
            suggestions.style.display = 'none';
            suggestions.innerHTML = '';
            return;
        }
        var matches = [];
        articles.forEach(function (a) {
            var code = (a.querySelector('.course-code') || {}).textContent || '';
            var title = (a.querySelector('.course-title') || {}).textContent || '';
            var hay = (code + ' ' + title).toLowerCase();
            var show = terms.every(function (t) { return hay.indexOf(t) !== -1; });
            if (show) matches.push({ code: code, title: title, el: a });
        });
        if (matches.length === 0) {
            suggestions.style.display = 'none';
            suggestions.innerHTML = '';
            return;
        }
        suggestions.innerHTML = matches.slice(0, 8).map(function (m) {
            return '<a class="course-suggestion-item" href="#course-' + m.code.replace(/\s+/g, '-') + '" onclick="event.preventDefault(); gotoCourse(\'' + m.code.replace(/'/g, "\\'") + '\'); return false;">' +
                '<strong>' + escapeHtml(m.code) + '</strong><span>' + escapeHtml(m.title) + '</span></a>';
        }).join('');
        suggestions.style.display = 'block';
    }

    function apply() {
        var raw = input.value.trim();
        var terms = raw.toLowerCase().split(/\s+/).filter(Boolean);
        var count = 0;
        articles.forEach(function (a) {
            var code = (a.querySelector('.course-code') || {}).textContent || '';
            var title = (a.querySelector('.course-title') || {}).textContent || '';
            var meta = (a.querySelector('.course-meta') || {}).textContent || '';
            var hay = (code + ' ' + title + ' ' + meta).toLowerCase();
            var show = terms.every(function (t) { return hay.indexOf(t) !== -1; });
            a.style.display = show ? '' : 'none';
            if (show) count++;
        });
        sections.forEach(function (s) {
            var any = Array.prototype.some.call(s.querySelectorAll('.course-description-item'), function (a) {
                return a.style.display !== 'none';
            });
            s.style.display = any ? '' : 'none';
        });
        showSuggestions(terms);
        if (!status) return;
        if (!terms.length) { status.textContent = ''; return; }
        status.textContent = count === 0
            ? 'No courses match \u201C' + raw + '\u201D.'
            : count + (count === 1 ? ' course matches \u201C' : ' courses match \u201C') + raw + '\u201D.';
    }

    input.addEventListener('input', apply);
    input.addEventListener('focus', function () { apply(); });
    input.addEventListener('blur', function () { setTimeout(function () { suggestions.style.display = 'none'; }, 200); });
    input.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { input.value = ''; apply(); suggestions.style.display = 'none'; }
    });
    if (clearBtn) {
        clearBtn.addEventListener('click', function () { input.value = ''; apply(); suggestions.style.display = 'none'; input.focus(); });
    }
}

function gotoCourse(code) {
    var el = document.getElementById('course-' + code.replace(/\s+/g, '-'));
    if (!el) {
        // try with spaces replaced by nothing
        el = document.getElementById('course-' + code.replace(/\s+/g, ''));
    }
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('course-highlight');
        setTimeout(function () { el.classList.remove('course-highlight'); }, 1500);
    }
}

function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/* Mobile menu */
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navBar = document.getElementById('navBar');
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navBar.querySelector('.nav-menu').classList.toggle('active');
    });
}

/* Header: shadow on scroll + hide when scrolling down, reveal when scrolling up */
const header = document.querySelector('.header');
let lastScrollY = window.scrollY;

if (header) {
    const handleHeaderScroll = () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 40) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }

        if (currentScroll > lastScrollY && currentScroll > 120) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }

        lastScrollY = currentScroll;
    };

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();
}

window.addEventListener('click', (e) => {
    if (e.target === document.getElementById('adminModal')) {
        closeAdminDashboard();
    }
});

/* Rolling counter animation for stats section */
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    // Fallback: animate immediately if already in viewport
    counters.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            animateCounter(el);
        }
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0 });

    counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
    const target = +el.getAttribute('data-count');
    const suffix = el.getAttribute('data-suffix') || '+';
    const duration = 1500;
    const step = target / (duration / 16);
    let current = 0;

    const update = () => {
        current += step;
        if (current < target) {
            el.textContent = Math.floor(current) + suffix;
            requestAnimationFrame(update);
        } else {
            el.textContent = target + suffix;
        }
    };
    update();
}

initCounters();

/* Smooth scroll to anchor with sticky header offset */
function smoothScrollTo(targetId, offset = 160) {
    const el = document.getElementById(targetId);
    if (!el) return;
    const header = document.querySelector('.header');
    const headerHeight = header ? header.offsetHeight : 160;
    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Handle all anchor link clicks
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const targetId = href.substring(1);
            e.preventDefault();
            smoothScrollTo(targetId);
        });
    });
});

initHomeSearch();



async function addNews(e) {
    e.preventDefault();
    const title = document.getElementById('newsTitle').value.trim();
    const summary = document.getElementById('newsSummary').value.trim();
    const category = document.getElementById('newsCategory').value;
    const date = new Date().toISOString().split('T')[0];

    if (!title || !summary) {
        const msgEl = document.getElementById('adminLoginMessage');
        if (msgEl) { msgEl.textContent = 'Please fill in all fields.'; msgEl.style.color = '#b42318'; }
        return;
    }

    try {
        const data = await window.ESUTData.load();
        const newItem = {
            id: 'news-' + Date.now(),
            title: title,
            date: date,
            category: category,
            summary: summary
        };
        data.news = data.news || [];
        data.news.push(newItem);
        await window.ESUTData.save(data);

        const msgEl = document.getElementById('adminLoginMessage');
        if (msgEl) { msgEl.textContent = 'News/Announcement added successfully!'; msgEl.style.color = '#701500'; }
        document.getElementById('newsForm').reset();

        // Refresh home page news list if on home page
        const homeNewsList = document.getElementById('homeNewsList');
        if (homeNewsList) {
            const recentNews = (data.news || []).slice(0, 3);
            homeNewsList.innerHTML = recentNews.map(item => `
                <div class="announcement-card">
                    <div class="announcement-date"><span class="date-day">${new Date(item.date).getDate()}</span><span class="date-month">${new Date(item.date).toLocaleString('en-US', { month: 'short' })}</span></div>
                    <div class="announcement-content">
                        <h3>${item.title}</h3>
                        <p>${item.summary}</p>
                        <span class="announcement-tag">${item.category}</span>
                    </div>
                </div>
            `).join('');
        }

        // Refresh news page list if on news page
        const newsListContainer = document.getElementById('newsListContainer');
        if (newsListContainer) {
            newsListContainer.innerHTML = (data.news || []).map(item => `
                <div class="announcement-card">
                    <div class="announcement-date"><span class="date-day">${new Date(item.date).getDate()}</span><span class="date-month">${new Date(item.date).toLocaleString('en-US', { month: 'short' })}</span></div>
                    <div class="announcement-content">
                        <h3>${item.title}</h3>
                        <p>${item.summary}</p>
                        <span class="announcement-tag">${item.category}</span>
                    </div>
                </div>
            `).join('');
        }
    } catch (err) {
        const msgEl = document.getElementById('adminLoginMessage');
        if (msgEl) { msgEl.textContent = 'Error saving news: ' + err.message; msgEl.style.color = '#b42318'; }
    }
}
