const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';
const dataStore = window.ESUTData;

const getData = () => dataStore.load();
const saveData = (data) => dataStore.save(data);
const generateId = (prefix) => dataStore.createId(prefix);

function showMessage(id, text, isError = false) {
    const node = document.getElementById(id);
    if (!node) return;
    node.textContent = text;
    node.style.color = isError ? '#b42318' : '#701500';
}

if (document.body.id === 'login-page') {
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            sessionStorage.setItem('esutAdminSession', 'active');
            window.location.href = 'dashboard.html';
            return;
        }

        showMessage('loginMessage', 'Invalid username or password.', true);
    });
}

if (document.body.id === 'dashboard-page') {
    const session = sessionStorage.getItem('esutAdminSession');
    if (!session) {
        window.location.href = 'index.html';
    }

    const data = getData();
    const saveBtn = document.getElementById('saveBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    function renderStats() {
        document.getElementById('newsCount').textContent = data.news.length;
        document.getElementById('eventCount').textContent = data.events.length;
        document.getElementById('courseCount').textContent = data.courses.length;
        document.getElementById('staffCount').textContent = data.staff.length;
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

                if (todaysDate < eventDate) {
                    status = 'Upcoming';
                } else if (todaysDate <= expiryDate) {
                    status = 'Ongoing';
                }

                meta.innerHTML = `
                    <strong>${item.title}</strong>
                    <span>${item.date} • ${item.expiryDate || 'No expiry'} • ${item.venue}</span>
                    <span class="event-status-pill status-${status.toLowerCase()}">${status}</span>
                `;
            }

            if (type === 'courses') {
                meta.innerHTML = `<strong>${item.code} - ${item.title}</strong><span>${item.level}</span>`;
            }

            if (type === 'staff') {
                meta.innerHTML = `<strong>${item.name}</strong><span>${item.role} • ${item.email}</span>`;
            }

            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'delete-btn';
            button.textContent = 'Delete';
            button.addEventListener('click', () => {
                const index = data[type].findIndex((entry) => entry.id === item.id);
                if (index !== -1) {
                    data[type].splice(index, 1);
                    saveData(data);
                    renderDashboard();
                }
            });

            li.appendChild(meta);
            li.appendChild(button);
            list.appendChild(li);
        });
    }

    function renderDashboard() {
        renderStats();
        renderList('newsList', data.news, 'news');
        renderList('eventList', data.events, 'events');
        renderList('courseList', data.courses, 'courses');
        renderList('staffList', data.staff, 'staff');
    }

    document.getElementById('newsForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        data.news.push({
            id: generateId('news'),
            title: formData.get('title').toString().trim(),
            date: formData.get('date').toString(),
            category: formData.get('category').toString(),
            summary: formData.get('summary').toString().trim()
        });
        saveData(data);
        event.currentTarget.reset();
        renderDashboard();
    });

    document.getElementById('eventForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        data.events.push({
            id: generateId('event'),
            title: formData.get('title').toString().trim(),
            date: formData.get('date').toString(),
            expiryDate: formData.get('expiryDate').toString(),
            venue: formData.get('venue').toString().trim(),
            description: formData.get('description').toString().trim()
        });
        saveData(data);
        event.currentTarget.reset();
        renderDashboard();
    });

    document.getElementById('courseForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        data.courses.push({
            id: generateId('course'),
            level: formData.get('level').toString(),
            code: formData.get('code').toString().trim(),
            title: formData.get('title').toString().trim(),
            description: formData.get('description').toString().trim()
        });
        saveData(data);
        event.currentTarget.reset();
        renderDashboard();
    });

    // Photo file upload handler - convert to base64
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

    document.getElementById('staffForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const photoValue = photoHiddenInput.value || formData.get('photo').toString().trim();
        data.staff.push({
            id: generateId('staff'),
            name: formData.get('name').toString().trim(),
            role: formData.get('role').toString().trim(),
            category: formData.get('category').toString().trim() || 'Academic',
            email: formData.get('email').toString().trim(),
            photo: photoValue
        });
        saveData(data);
        event.currentTarget.reset();
        photoPreview.src = '';
        photoPreview.classList.remove('show');
        photoHiddenInput.value = '';
        renderDashboard();
    });

    saveBtn.addEventListener('click', () => {
        saveData(data);
        saveBtn.textContent = 'Saved';
        setTimeout(() => {
            saveBtn.textContent = 'Save Updates';
        }, 1200);
    });

    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('esutAdminSession');
        window.location.href = 'index.html';
    });

    renderDashboard();
}
