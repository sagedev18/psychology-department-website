(function () {
    const THEME_KEY = 'esutAdminTheme';
    const root = document.documentElement;
    const toggle = document.getElementById('themeToggle');

    function showNotice(text, state, persistent = false) {
        let notice = document.getElementById('syncStatus');
        if (!notice) {
            notice = document.createElement('div');
            notice.id = 'syncStatus';
            notice.className = 'sync-status';
            notice.setAttribute('role', state === 'error' ? 'alert' : 'status');
            notice.setAttribute('aria-live', 'polite');
            document.body.appendChild(notice);
        }
        notice.dataset.state = state;
        notice.textContent = text;
        notice.hidden = false;
        clearTimeout(notice._hideTimer);
        if (!persistent) notice._hideTimer = setTimeout(() => { notice.hidden = true; }, 6000);
    }

    if (toggle) {
        let savedTheme = 'light';
        try { savedTheme = localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light'; } catch (error) {}
        function setTheme(theme) {
            const dark = theme === 'dark';
            root.dataset.adminTheme = dark ? 'dark' : 'light';
            toggle.setAttribute('aria-pressed', String(dark));
            toggle.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} mode`);
            toggle.querySelector('.theme-toggle-icon').textContent = dark ? '☀' : '☾';
            toggle.querySelector('.theme-toggle-label').textContent = dark ? 'Light mode' : 'Dark mode';
            try { localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light'); } catch (error) {}
        }
        setTheme(savedTheme);
        toggle.addEventListener('click', () => setTheme(root.dataset.adminTheme === 'dark' ? 'light' : 'dark'));
    }

    const store = window.ESUTData;
    if (!store || document.body.id !== 'dashboard-page') return;

    const dataKey = store.KEY || 'esut_department_data';
    const sessionKey = 'esutAdminSession';
    const collections = ['news', 'events', 'courses', 'staff', 'gallery'];
    let noticeTimer;

    function session() {
        try { return JSON.parse(localStorage.getItem(sessionKey) || 'null'); }
        catch (error) { return null; }
    }
    function requireSessionToken() {
        const current = session();
        if (!current || !current.token || current.token.startsWith('esut_local_')) {
            throw new Error('You are signed in with a local-only session. Log out and sign in again after shared Vercel KV storage is connected.');
        }
        return current.token;
    }
    async function readRemote() {
        const response = await fetch('/api/data', { cache: 'no-store' });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result.success || !result.data) {
            throw new Error(result.error || `Shared content service is unavailable (${response.status}).`);
        }
        collections.forEach(key => { if (!Array.isArray(result.data[key])) result.data[key] = []; });
        try { localStorage.setItem(dataKey, JSON.stringify(result.data)); } catch (error) {}
        return result.data;
    }
    async function writeRemote(data) {
        const token = requireSessionToken();
        const response = await fetch('/api/save-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ data })
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result.success) throw new Error(result.error || `Save failed (${response.status}).`);
        try { localStorage.setItem(dataKey, JSON.stringify(data)); } catch (error) {}
        window.dispatchEvent(new CustomEvent('esutDataChanged', { detail: data }));
        showNotice('Saved and published. Refresh the public site to see the changes.', 'success');
        return data;
    }
    function reportFailure(error) {
        const message = error && error.message ? error.message : 'The change could not be saved.';
        showNotice(`Not saved: ${message}`, 'error', true);
        document.querySelectorAll('.admin-form button[type="submit"], #saveBtn').forEach(button => {
            if (button.disabled || /saving|adding|updating|deleting/i.test(button.textContent)) {
                button.disabled = false;
                if (button.dataset.originalText) button.textContent = button.dataset.originalText;
            }
        });
    }

    // Always use shared remote data for dashboard operations; don't quietly fall back
    // to browser-local data that no public visitor can see.
    store.load = readRemote;
    store.save = writeRemote;
    store.add = async function (type, item) {
        const data = await readRemote();
        if (!collections.includes(type)) throw new Error(`Unknown content type: ${type}`);
        const added = { ...item, id: item.id || store.createId(type.slice(0, -1)) };
        data[type].push(added);
        await writeRemote(data);
        return added;
    };
    store.update = async function (type, item) {
        const data = await readRemote();
        if (!collections.includes(type)) throw new Error(`Unknown content type: ${type}`);
        const index = data[type].findIndex(entry => entry.id === item.id);
        if (index < 0) throw new Error('Could not find this item in the shared website data. Refresh and retry.');
        data[type][index] = { ...data[type][index], ...item };
        await writeRemote(data);
        return data[type][index];
    };
    store.delete = async function (type, id) {
        const data = await readRemote();
        if (!collections.includes(type)) throw new Error(`Unknown content type: ${type}`);
        data[type] = data[type].filter(entry => entry.id !== id);
        await writeRemote(data);
        return true;
    };

    window.addEventListener('unhandledrejection', event => {
        reportFailure(event.reason);
    });

    // Verify the live deployment/storage before enabling editing, and surface the
    // exact setup problem instead of making local-only changes that appear to vanish.
    readRemote().then(() => {
        try { requireSessionToken(); }
        catch (error) { showNotice(error.message, 'error', true); }
    }).catch(error => reportFailure(error));
})();
