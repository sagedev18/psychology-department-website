(function () {
    const THEME_KEY = 'esutAdminTheme';
    const root = document.documentElement;
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    let savedTheme = 'light';
    try {
        savedTheme = localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
    } catch (error) {
        // Keep the dashboard usable if browser storage is disabled.
    }

    function setTheme(theme) {
        const isDark = theme === 'dark';
        root.dataset.adminTheme = isDark ? 'dark' : 'light';
        toggle.setAttribute('aria-pressed', String(isDark));
        toggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
        toggle.querySelector('.theme-toggle-icon').textContent = isDark ? '☀' : '☾';
        toggle.querySelector('.theme-toggle-label').textContent = isDark ? 'Light mode' : 'Dark mode';
        try {
            localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
        } catch (error) {
            // Theme still changes for this page view when storage is unavailable.
        }
    }

    setTheme(savedTheme);
    toggle.addEventListener('click', () => {
        setTheme(root.dataset.adminTheme === 'dark' ? 'light' : 'dark');
    });
})();
