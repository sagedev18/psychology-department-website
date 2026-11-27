const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'iamadmin22#';
const dataStore = window.ESUTData;

const getData = () => dataStore.load();
const saveData = (data) => dataStore.save(data);
const addItem = (type, item) => dataStore.add(type, item);
const updateItem = (type, item) => dataStore.update(type, item);
const deleteItem = (type, id) => dataStore.delete(type, id);
const generateId = (prefix) => dataStore.createId(prefix);

let currentData = null;

function showMessage(id, text, isError) {
    const node = document.getElementById(id);
    if (!node) return;
    node.textContent = text;
    node.style.color = isError ? '#b42318' : '#701500';
}

function setButtonLoading(button, loading) {
    if (!button) return;
    button.disabled = loading;
    if (!button.dataset.originalText) button.dataset.originalText = button.textContent;
    button.textContent = loading ? 'Saving...' : button.dataset.originalText;
}

async function apiAuth(action, payload) {
    try {
        const response = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.assign({ action: action }, payload || {}))
        });
        return await response.json();
    } catch (error) {
        console.error('Auth API error:', error);
        return { success: false, error: error.message };
    }
}

function getSessionToken() {
    return localStorage.getItem('esutAdminToken');
}

function setSessionToken(token) {
    localStorage.setItem('esutAdminToken', token);
}

function clearSessionToken() {
    localStorage.removeItem('esutAdminToken');
}

async function verifySession() {
    const token = getSessionToken();
    if (!token) return false;
    const result = await apiAuth('verify', { token: token });
    return result.success && result.valid;
}

if (document.body.id === 'login-page') {
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');

    verifySession().then(function(valid) {
        if (valid) window.location.href = 'dashboard.html';
    });

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const submitBtn = loginForm.querySelector('button[type="submit"]');

        setButtonLoading(submitBtn, true);
        showMessage('loginMessage', '');

        const result = await apiAuth('login', { username: username, password: password });

        setButtonLoading(submitBtn, false);

        if (result.success && result.token) {
            setSessionToken(result.token);
            window.location.href = 'dashboard.html';
            return;
        }

        showMessage('loginMessage', result.error || 'Invalid username or password.', true);
    });
}

if (document.body.id === 'dashboard-page') {
    const saveBtn = document.getElementById('saveBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    verifySession().then(async function(valid) {
        if (!valid) {
            clearSessionToken();
            window.location.href = 'index.html';
            return;
        }
        await initDashboard();
    });

    async function initDashboard() {
        currentData = await getData();
        setupEventListeners();
        renderDashboard();
    }

    function setupEventListeners() {
        document.getElementById('newsForm').addEventListener('submit', handleNewsSubmit);
        document.getElementById('eventForm').addEventListener('submit', handleEventSubmit);
        document.getElementById('courseForm').addEventListener('submit', handleCourseSubmit);
        document.getElementById('staffForm').addEventListener('submit', handleStaffSubmit);
        document.getElementById('galleryForm').addEventListener('submit', handleGallerySubmit);

        saveBtn.addEventListener('click', async function() {
            setButtonLoading(saveBtn, true);
            await saveData(currentData);
            saveBtn.textContent = 'Saved';
            setTimeout(function() { saveBtn.textContent = 'Save Updates'; }, 1200);
            setButtonLoading(saveBtn, false);
        });

        logoutBtn.addEventListener('click', async function() {
            const token = getSessionToken();
            await apiAuth('logout', { token: token });
            clearSessionToken();
            window.location.href = 'index.html';
        });

        const photoFileInput = document.getElementById('staffPhotoFile');
        const photoPreview = document.getElementById('staffPhotoPreview');
        const photoHiddenInput = document.getElementById('staffPhoto');

        photoFileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file.');
                return;
            }
            const reader = new FileReader();
            reader.onload = function(event) {
                photoPreview.src = event.target.result;
                photoPreview.classList.add('show');
                photoHiddenInput.value = event.target.result;
            };
            reader.readAsDataURL(file);
        });

        const galleryFileInput = document.getElementById('galleryImageFile');
        const galleryPreview = document.getElementById('galleryImagePreview');
        const galleryHiddenInput = document.getElementById('galleryImage');

        galleryFileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file.');
                return;
            }
            const reader = new FileReader();
            reader.onload = function(event) {
                galleryPreview.src = event.target.result;
                galleryPreview.classList.add('show');
                galleryHiddenInput.value = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    function renderStats() {
        document.getElementById('newsCount').textContent = currentData.news.length;
        document.getElementById('eventCount').textContent = currentData.events.length;
        document.getElementById('courseCount').textContent = currentData.courses.length;
        document.getElementById('staffCount').textContent = currentData.staff.length;
        document.getElementById('galleryCount').textContent = currentData.gallery.length;
    }

    function renderList(targetId, items, type) {
        const list = document.getElementById(targetId);
        list.innerHTML = '';

        if (!items.length) {
            const empty = document.createElement('li');
            empty.innerHTML = '<span class="item-meta"><strong>No entries yet</strong><span>Add content using the form above.</span></span>';
            list.appendChild(empty);
            return;
        }

        items.forEach(function(item) {
            const li = document.createElement('li');
            const meta = document.createElement('div');
            meta.className = 'item-meta';

            if (type === 'news') {
                meta.innerHTML = '<strong>' + item.title + '</strong><span>' + item.category + ' | ' + item.date + '</span>';
            }
            if (type === 'events') {
                const eventDate = new Date(item.date + 'T00:00:00');
                const expiryDate = item.expiryDate ? new Date(item.expiryDate + 'T23:59:59') : eventDate;
                const today = new Date();
                const todaysDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                let status = 'Past';
                if (todaysDate < eventDate) status = 'Upcoming';
                else if (todaysDate <= expiryDate) status = 'Ongoing';
                meta.innerHTML = '<strong>' + item.title + '</strong><span>' + item.date + ' | ' + (item.expiryDate || 'No expiry') + ' | ' + item.venue + '</span><span class="event-status-pill status-' + status.toLowerCase() + '">' + status + '</span>';
            }
            if (type === 'courses') {
                meta.innerHTML = '<strong>' + item.code + ' - ' + item.title + '</strong><span>' + item.level + '</span>';
            }
            if (type === 'staff') {
                meta.innerHTML = '<strong>' + item.name + '</strong><span>' + item.role + ' | ' + item.email + '</span>';
            }
            if (type === 'gallery') {
                meta.innerHTML = '<strong>' + item.description + '</strong><span>' + (item.image ? 'Image uploaded' : 'No image') + '</span>';
                const img = document.createElement('img');
                img.src = item.image || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="40"><rect fill="%23ddd" width="100%" height="100%"/></svg>';
                img.style.width = '60px';
                img.style.height = '40px';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '4px';
                img.style.marginRight = '12px';
                li.insertBefore(img, meta);
            }

            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'delete-btn';
            button.textContent = 'Delete';
            button.addEventListener('click', async function() {
                button.disabled = true;
                button.textContent = 'Deleting...';
                await deleteItem(type, item.id);
                currentData = await getData();
                renderDashboard();
            });

            li.appendChild(meta);
            li.appendChild(button);
            list.appendChild(li);
        });
    }

    function renderDashboard() {
        renderStats();
        renderList('newsList', currentData.news, 'news');
        renderList('eventList', currentData.events, 'events');
        renderList('courseList', currentData.courses, 'courses');
        renderList('staffList', currentData.staff, 'staff');
        renderList('galleryList', currentData.gallery, 'gallery');
    }

    async function handleNewsSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const submitBtn = event.currentTarget.querySelector('button[type="submit"]');

        setButtonLoading(submitBtn, true);

        await addItem('news', {
            title: formData.get('title').toString().trim(),
            date: formData.get('date').toString(),
            category: formData.get('category').toString(),
            summary: formData.get('summary').toString().trim()
        });

        currentData = await getData();
        event.currentTarget.reset();
        renderDashboard();
        setButtonLoading(submitBtn, false);
    }

    async function handleEventSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const submitBtn = event.currentTarget.querySelector('button[type="submit"]');

        setButtonLoading(submitBtn, true);

        await addItem('events', {
            title: formData.get('title').toString().trim(),
            date: formData.get('date').toString(),
            expiryDate: formData.get('expiryDate').toString(),
            venue: formData.get('venue').toString().trim(),
            description: formData.get('description').toString().trim()
        });

        currentData = await getData();
        event.currentTarget.reset();
        renderDashboard();
        setButtonLoading(submitBtn, false);
    }

    async function handleCourseSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const submitBtn = event.currentTarget.querySelector('button[type="submit"]');

        setButtonLoading(submitBtn, true);

        await addItem('courses', {
            level: formData.get('level').toString(),
            code: formData.get('code').toString().trim(),
            title: formData.get('title').toString().trim(),
            description: formData.get('description').toString().trim()
        });

        currentData = await getData();
        event.currentTarget.reset();
        renderDashboard();
        setButtonLoading(submitBtn, false);
    }

    async function handleStaffSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const submitBtn = event.currentTarget.querySelector('button[type="submit"]');
        const photoHiddenInput = document.getElementById('staffPhoto');
        const photoPreview = document.getElementById('staffPhotoPreview');

        setButtonLoading(submitBtn, true);

        const photoValue = photoHiddenInput.value || formData.get('photo').toString().trim();

        await addItem('staff', {
            name: formData.get('name').toString().trim(),
            role: formData.get('role').toString().trim(),
            category: formData.get('category').toString().trim() || 'Academic',
            email: formData.get('email').toString().trim(),
            photo: photoValue
        });

        currentData = await getData();
        event.currentTarget.reset();
        photoPreview.src = '';
        photoPreview.classList.remove('show');
        photoHiddenInput.value = '';
        renderDashboard();
        setButtonLoading(submitBtn, false);
    }

    async function handleGallerySubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const submitBtn = event.currentTarget.querySelector('button[type="submit"]');
        const imageHiddenInput = document.getElementById('galleryImage');
        const imagePreview = document.getElementById('galleryImagePreview');

        setButtonLoading(submitBtn, true);

        const imageValue = imageHiddenInput.value || formData.get('image').toString().trim();

        await addItem('gallery', {
            description: formData.get('description').toString().trim(),
            image: imageValue
        });

        currentData = await getData();
        event.currentTarget.reset();
        imagePreview.src = '';
        imagePreview.classList.remove('show');
        imageHiddenInput.value = '';
        renderDashboard();
        setButtonLoading(submitBtn, false);
    }
}

window.addEventListener('esutDataChanged', async function(event) {
    if (document.body.id === 'dashboard-page') {
        currentData = event.detail;
        renderDashboard();
    }
});