import { kv } from '@vercel/kv';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'iamadmin22#';
const SESSION_SECRET = process.env.SESSION_SECRET || 'esut-psychology-secret-key';

function generateSessionToken() {
    return `esut_session_${Date.now()}_${Math.random().toString(36).slice(2, 16)}`;
}

async function createSession() {
    const token = generateSessionToken();
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await kv.set(`session:${token}`, { username: ADMIN_USERNAME, expiresAt });
    return token;
}

async function validateSession(token) {
    if (!token) return false;
    const session = await kv.get(`session:${token}`);
    if (!session) return false;
    if (session.expiresAt < Date.now()) {
        await kv.del(`session:${token}`);
        return false;
    }
    return session.username === ADMIN_USERNAME;
}

async function deleteSession(token) {
    await kv.del(`session:${token}`);
}

export default async function handler(request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.setHeader('Access-Control-Allow-Credentials', 'true');

    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }

    if (request.method !== 'POST') {
        return response.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const { action, username, password, token } = request.body;

    if (action === 'login') {
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            const sessionToken = await createSession();
            return response.status(200).json({ success: true, token: sessionToken });
        }
        return response.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    if (action === 'verify') {
        const isValid = await validateSession(token);
        return response.status(200).json({ success: true, valid: isValid });
    }

    if (action === 'logout') {
        await deleteSession(token);
        return response.status(200).json({ success: true });
    }

    return response.status(400).json({ success: false, error: 'Invalid action' });
}