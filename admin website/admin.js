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

function setButtonLoading(button, loading) {
    if (!button) return;
    button.disabled = loading;
    button.dataset.originalText = button.dataset.originalText || button.textContent;
    button.textContent = loading ? 'Saving...' : button.dataset.originalText;
}

// ---- Local Authentication (works without Vercel KV) ----
function getStoredAdminSession() {
    try {
        const raw = localStorage.getItem('esutAdminSession');
        if (!raw) return null;
        const session = JSON.parse(raw);
        if (session && session.username === ADMIN_USERNAME && session.expiresAt > Date.now()) {
            return session;
        }
        return null;
    } catch (e) {
        return null;
    }
}

function setStoredAdminSession() {
    const token = `esut_local_${Date.now()}_${Math.random().toString(36).slice(2, 16)}`;
    localStorage.setItem('esutAdminSession', JSON.stringify({
        username: ADMIN_USERNAME,
        token,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    }));
    return token;
}

function clearStoredAdminSession() {
    localStorage.removeItem('esutAdminSession');
}

function isAdminAuthenticated() {
    return !!getStoredAdminSession();
}

// ---- API Auth (Vercel KV, with local fallback) ----
async function apiAuth(action, payload = {}) {
    try {
        const response = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, ...payload })
        });
        return await response.json();
    } catch (error) {
        console.error('Auth API error:', error);
        return { success: false, error: error.message };
    }
}

function getSessionToken() {
    const session = getStoredAdminSession();
    return session ? session.token : null;
}

function setSessionToken(token) {
    // Token is managed internally via localStorage session
}

function clearSessionToken() {
    clearStoredAdminSession();
}

async function verifySession() {
    const token = getSessionToken();
    if (!token) return false;
    const localSession = getStoredAdminSession();
    if (localSession) return true;
    try {
        const result = await apiAuth('verify', { token });
        return result.success && result.valid;
    } catch (e) {
        return false;
    }
}

if (document.body.id === 'login-page') {
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');

    verifySession().then(valid => {
        if (valid) window.location.href = 'dashboard.html';
    });

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const submitBtn = loginForm.querySelector('button[type="submit"]');

        setButtonLoading(submitBtn, true);

        // Try API first, fall back to local credential check
        let apiResult = await apiAuth('login', { username, password });

        if (apiResult.success && apiResult.token) {
            setStoredAdminSession();
            window.location.href = 'dashboard.html';
            return;
        }

        // Local fallback: check credentials directly
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            setStoredAdminSession();
            window.location.href = 'dashboard.html';
            return;
        }

        setButtonLoading(submitBtn, false);
        document.getElementById('loginMessage').textContent = apiResult.error || 'Invalid username or password.';
        document.getElementById('loginMessage').style.color = '#b42318';
    });
}

if (document.body.id === 'dashboard-page') {
    const saveBtn = document.getElementById('saveBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    verifySession().then(async valid => {
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

        saveBtn.addEventListener('click', async () => {
            setButtonLoading(saveBtn, true);
            await saveData(currentData);
            saveBtn.textContent = 'Saved';
            setTimeout(() => { saveBtn.textContent = 'Save Updates'; }, 1200);
            setButtonLoading(saveBtn, false);
        });

        logoutBtn.addEventListener('click', async () => {
            const token = getSessionToken();
            await apiAuth('logout', { token });
            clearSessionToken();
            window.location.href = 'index.html';
        });

        const photoFileInput = document.getElementById('staffPhotoFile');
        const photoPreview = document.getElementById('staffPhotoPreview');
        const photoHiddenInput = document.getElementById('staffPhoto');

        photoFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file.');
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                photoPreview.src = event.target.result;
                photoPreview.classList.add('show');
                photoHiddenInput.value = event.target.result;
            };
            reader.readAsDataURL(file);
        });

        const galleryFileInput = document.getElementById('galleryImageFile');
        const galleryPreview = document.getElementById('galleryImagePreview');
        const galleryHiddenInput = document.getElementById('galleryImage');

        galleryFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file.');
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
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

        items.forEach((item) => {
            const li = document.createElement('li');
            const meta = document.createElement('div');
            meta.className = 'item-meta';

            if (type === 'news') {
                meta.innerHTML = `<strong>${item.title}</strong><span>${item.category} • ${item.date}</span>`;
            }
            if (type === 'events') {
                const eventDate = new Date(`${item.date}T00:00:00`);
                const expiryDate = item.expiryDate ? new Date(`${item.expiryDate}T23:59:59`) : eventDate;
                const today = new Date();
                const todaysDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                let status = 'Past';
                if (todaysDate < eventDate) status = 'Upcoming';
                else if (todaysDate <= expiryDate) status = 'Ongoing';
                meta.innerHTML = `<strong>${item.title}</strong><span>${item.date} • ${item.expiryDate || 'No expiry'} • ${item.venue}</span><span class="event-status-pill status-${status.toLowerCase()}">${status}</span>`;
            }
            if (type === 'courses') {
                meta.innerHTML = `<strong>${item.code} - ${item.title}</strong><span>${item.level}</span>`;
            }
            if (type === 'staff') {
                meta.innerHTML = `<strong>${item.name}</strong><span>${item.role} • ${item.email}</span>`;
            }
            if (type === 'gallery') {
                meta.innerHTML = `<strong>${item.description}</strong><span>${item.image ? 'Image uploaded' : 'No image'}</span>`;
                const img = document.createElement('img');
                img.src = item.image || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="40"><rect fill="%23ddd" width="100%" height="100%"/></svg>';
                img.style.width = '60px';
                img.style.height = '40px';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '4px';
                img.style.marginRight = '12px';
                li.insertBefore(img, meta);
            }

            // Edit button
            const editBtn = document.createElement('button');
            editBtn.type = 'button';
            editBtn.className = 'edit-btn';
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => openEditForm(type, item));

            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', async () => {
                deleteBtn.disabled = true;
                deleteBtn.textContent = 'Deleting...';
                await deleteItem(type, item.id);
                currentData = await getData();
                renderDashboard();
            });

            const btnGroup = document.createElement('div');
            btnGroup.className = 'btn-group';
            btnGroup.appendChild(editBtn);
            btnGroup.appendChild(deleteBtn);

            li.appendChild(meta);
            li.appendChild(btnGroup);
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

    // ===== EDIT / CANCEL HELPERS =====
    function openEditForm(type, item) {
        const forms = { news: document.getElementById('newsForm'), events: document.getElementById('eventForm'), courses: document.getElementById('courseForm'), staff: document.getElementById('staffForm'), gallery: document.getElementById('galleryForm') };
        const form = forms[type];
        if (!form) return;
        form.dataset.editingId = item.id;
        form.dataset.editingType = type;
        if (type === 'news') {
            document.getElementById('newsTitle').value = item.title || '';
            document.getElementById('newsDate').value = item.date || '';
            document.getElementById('newsCategory').value = item.category || 'Announcement';
            document.getElementById('newsSummary').value = item.summary || '';
            form.querySelector('button[type="submit"]').textContent = 'Update News';
        }
        if (type === 'events') {
            document.getElementById('eventTitle').value = item.title || '';
            document.getElementById('eventDate').value = item.date || '';
            document.getElementById('eventExpiryDate').value = item.expiryDate || '';
            document.getElementById('eventVenue').value = item.venue || '';
            document.getElementById('eventDescription').value = item.description || '';
            form.querySelector('button[type="submit"]').textContent = 'Update Event';
        }
        if (type === 'courses') {
            document.getElementById('courseLevel').value = item.level || '100 Level';
            document.getElementById('courseCode').value = item.code || '';
            document.getElementById('courseTitle').value = item.title || '';
            document.getElementById('courseDescription').value = item.description || '';
            form.querySelector('button[type="submit"]').textContent = 'Update Course';
        }
        if (type === 'staff') {
            document.getElementById('staffName').value = item.name || '';
            document.getElementById('staffRole').value = item.role || '';
            document.getElementById('staffEmail').value = item.email || '';
            document.getElementById('staffCategory').value = item.category || 'Academic';
            document.getElementById('staffPhoto').value = item.photo || '';
            const preview = document.getElementById('staffPhotoPreview');
            if (item.photo) { preview.src = item.photo; preview.classList.add('show'); }
            form.querySelector('button[type="submit"]').textContent = 'Update Staff';
        }
        if (type === 'gallery') {
            document.getElementById('galleryDescription').value = item.description || '';
            document.getElementById('galleryImage').value = item.image || '';
            const preview = document.getElementById('galleryImagePreview');
            if (item.image) { preview.src = item.image; preview.classList.add('show'); }
            form.querySelector('button[type="submit"]').textContent = 'Update Gallery';
        }
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function cancelEdit(form) {
        delete form.dataset.editingId;
        delete form.dataset.editingType;
        form.reset();
        const preview = form.querySelector('.photo-preview');
        if (preview) { preview.src = ''; preview.classList.remove('show'); }
        const submitBtn = form.querySelector('button[type="submit"]');
        const type = form.id.replace('Form', '');
        const btnText = { news: 'Add News', event: 'Add Event', course: 'Add Course', staff: 'Add Staff', gallery: 'Add to Gallery' };
        if (submitBtn && btnText[type]) submitBtn.textContent = btnText[type];
    }

    function addCancelButtons() {
        const formConfigs = [
            { id: 'newsForm', btnText: 'Add News' },
            { id: 'eventForm', btnText: 'Add Event' },
            { id: 'courseForm', btnText: 'Add Course' },
            { id: 'staffForm', btnText: 'Add Staff' },
            { id: 'galleryForm', btnText: 'Add to Gallery' }
        ];
        formConfigs.forEach(({ id, btnText }) => {
            const form = document.getElementById(id);
            if (!form || form.querySelector('.cancel-edit-btn')) return;
            const cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.className = 'secondary-btn cancel-edit-btn';
            cancelBtn.textContent = 'Cancel Edit';
            cancelBtn.style.display = 'none';
            cancelBtn.style.marginLeft = '10px';
            cancelBtn.addEventListener('click', () => {
                cancelEdit(form);
                cancelBtn.style.display = 'none';
                form.querySelector('button[type="submit"]').textContent = btnText;
            });
            const submitBtn = form.querySelector('button[type="submit"]);
            submitBtn.parentNode.insertBefore(cancelBtn, submitBtn.nextSibling);
        });
    }

    async function handleNewsSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const editingId = form.dataset.editingId;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');

        setButtonLoading(submitBtn, true);

        const itemData = {
            title: formData.get('title').toString().trim(),
            date: formData.get('date').toString(),
            category: formData.get('category').toString(),
            summary: formData.get('summary').toString().trim()
        };

        if (editingId) {
            itemData.id = editingId;
            await updateItem('news', itemData);
        } else {
            await addItem('news', itemData);
        }

        currentData = await getData();
        form.reset();
        delete form.dataset.editingId;
        delete form.dataset.editingType;
        submitBtn.textContent = 'Add News';
        renderDashboard();
        setButtonLoading(submitBtn, false);
    }

    async function handleEventSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const editingId = form.dataset.editingId;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');

        setButtonLoading(submitBtn, true);

        const itemData = {
            title: formData.get('title').toString().trim(),
            date: formData.get('date').toString(),
            expiryDate: formData.get('expiryDate').toString(),
            venue: formData.get('venue').toString().trim(),
            description: formData.get('description').toString().trim()
        };

        if (editingId) {
            itemData.id = editingId;
            await updateItem('events', itemData);
        } else {
            await addItem('events', itemData);
        }

        currentData = await getData();
        form.reset();
        delete form.dataset.editingId;
        delete form.dataset.editingType;
        submitBtn.textContent = 'Add Event';
        renderDashboard();
        setButtonLoading(submitBtn, false);
    }

    async function handleCourseSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const editingId = form.dataset.editingId;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');

        setButtonLoading(submitBtn, true);

        const itemData = {
            level: formData.get('level').toString(),
            code: formData.get('code').toString().trim(),
            title: formData.get('title').toString().trim(),
            description: formData.get('description').toString().trim()
        };

        if (editingId) {
            itemData.id = editingId;
            await updateItem('courses', itemData);
        } else {
            await addItem('courses', itemData);
        }

        currentData = await getData();
        form.reset();
        delete form.dataset.editingId;
        delete form.dataset.editingType;
        submitBtn.textContent = 'Add Course';
        renderDashboard();
        setButtonLoading(submitBtn, false);
    }

    async function handleStaffSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const editingId = form.dataset.editingId;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const photoHiddenInput = document.getElementById('staffPhoto');
        const photoPreview = document.getElementById('staffPhotoPreview');

        setButtonLoading(submitBtn, true);

        const photoValue = photoHiddenInput.value || formData.get('photo').toString().trim();

        const itemData = {
            name: formData.get('name').toString().trim(),
            role: formData.get('role').toString().trim(),
            category: formData.get('category').toString().trim() || 'Academic',
            email: formData.get('email').toString().trim(),
            photo: photoValue
        };

        if (editingId) {
            itemData.id = editingId;
            await updateItem('staff', itemData);
        } else {
            await addItem('staff', itemData);
        }

        currentData = await getData();
        form.reset();
        photoPreview.src = '';
        photoPreview.classList.remove('show');
        photoHiddenInput.value = '';
        delete form.dataset.editingId;
        delete form.dataset.editingType;
        submitBtn.textContent = 'Add Staff';
        renderDashboard();
        setButtonLoading(submitBtn, false);
    }

    async function handleGallerySubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const editingId = form.dataset.editingId;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const imageHiddenInput = document.getElementById('galleryImage');
        const imagePreview = document.getElementById('galleryImagePreview');

        setButtonLoading(submitBtn, true);

        const imageValue = imageHiddenInput.value || formData.get('image').toString().trim();

        const itemData = {
            description: formData.get('description').toString().trim(),
            image: imageValue
        };

        if (editingId) {
            itemData.id = editingId;
            await updateItem('gallery', itemData);
        } else {
            await addItem('gallery', itemData);
        }

        currentData = await getData();
        form.reset();
        imagePreview.src = '';
        imagePreview.classList.remove('show');
        imageHiddenInput.value = '';
        delete form.dataset.editingId;
        delete form.dataset.editingType;
        submitBtn.textContent = 'Add to Gallery';
        renderDashboard();
        setButtonLoading(submitBtn, false);
    }

    addCancelButtons();
}

window.addEventListener('esutDataChanged', async (event) => {
    if (document.body.id === 'dashboard-page') {
        currentData = event.detail;
        renderDashboard();
    }
});