(function () {
    const THEME_KEY = 'esutAdminTheme';
    const root = document.documentElement;
    const toggle = document.getElementById('themeToggle');

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

    // Keep admin edits in the shared Vercel KV data store so public pages on
    // every device load the same content. Never report a local-only write as saved.
    const store = window.ESUTData;
    if (!store || document.body.id !== 'dashboard-page') return;

    const originalLoad = store.load.bind(store);
    const dataKey = store.KEY || 'esut_department_data';
    let noticeTimer;

    function showNotice(text, state) {
        let notice = document.getElementById('syncStatus');
        if (!notice) {
            notice = document.createElement('div');
            notice.id = 'syncStatus';
            notice.className = 'sync-status';
            notice.setAttribute('role', 'status');
            notice.setAttribute('aria-live', 'polite');
            document.body.appendChild(notice);
        }
        notice.dataset.state = state;
        notice.textContent = text;
        notice.hidden = false;
        clearTimeout(noticeTimer);
        if (state !== 'error') noticeTimer = setTimeout(() => { notice.hidden = true; }, 4500);
    }

    function getSession() {
        try { return JSON.parse(localStorage.getItem('esutAdminSession') || 'null'); }
        catch (error) { return null; }
    }

    async function readRemote() {
        const response = await fetch('/api/data', { cache: 'no-store' });
        if (!response.ok) throw new Error(`Content service returned ${response.status}`);
        const result = await response.json();
        if (!result.success || !result.data) throw new Error('Content service returned invalid data');
        const data = result.data;
        ['news', 'events', 'courses', 'staff', 'gallery'].forEach(key => {
            if (!Array.isArray(data[key])) data[key] = [];
        });
        return data;
    }

    async function writeRemote(data) {
        const session = getSession();
        if (!session || !session.token || session.token.startsWith('esut_local_')) {
            throw new Error('Your session is not connected to the shared content service. Please log out and sign in again after Vercel KV is configured.');
        }
        const response = await fetch('/api/save-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`
            },
            body: JSON.stringify({ data })
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result.success) throw new Error(result.error || `Save failed (${response.status})`);
        try { localStorage.setItem(dataKey, JSON.stringify(data)); } catch (error) {}
        window.dispatchEvent(new CustomEvent('esutDataChanged', { detail: data }));
        showNotice('Changes saved and published to the website.', 'success');
        return data;
    }

    store.load = async function () {
        try { return await readRemote(); }
        catch (error) {
            showNotice(`Could not load shared website data: ${error.message}`, 'error');
            return originalLoad();
        }
    };
    store.save = async function (data) { return writeRemote(data); };
    store.add = async function (type, item) {
        const data = await store.load();
        if (!Array.isArray(data[type])) throw new Error(`Unknown content type: ${type}`);
        const newItem = { ...item, id: item.id || store.createId(type.slice(0, -1)) };
        data[type].push(newItem);
        await writeRemote(data);
        return newItem;
    };
    store.update = async function (type, item) {
        const data = await store.load();
        if (!Array.isArray(data[type])) throw new Error(`Unknown content type: ${type}`);
        const index = data[type].findIndex(entry => entry.id === item.id);
        if (index < 0) throw new Error('The item could not be found in shared website data. Refresh and try again.');
        data[type][index] = { ...data[type][index], ...item };
        await writeRemote(data);
        return data[type][index];
    };
    store.delete = async function (type, id) {
        const data = await store.load();
        if (!Array.isArray(data[type])) throw new Error(`Unknown content type: ${type}`);
        data[type] = data[type].filter(entry => entry.id !== id);
        await writeRemote(data);
        return true;
    };
})();
