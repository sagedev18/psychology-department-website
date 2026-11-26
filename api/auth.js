import { kv } from '@vercel/kv';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'iamadmin22#';
const SESSION_TTL_SECONDS = 60 * 60 * 24;

function createToken() {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

export default async function handler(request, response) {
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (request.method === 'OPTIONS') return response.status(200).end();
    if (request.method !== 'POST') return response.status(405).json({ success: false, error: 'Method not allowed' });

    const body = request.body || {};
    if (body.action === 'login') {
        if (body.username !== ADMIN_USERNAME || body.password !== ADMIN_PASSWORD) {
            return response.status(401).json({ success: false, error: 'Invalid username or password.' });
        }
        try {
            const token = createToken();
            const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
            await kv.set(`session:${token}`, { username: ADMIN_USERNAME, expiresAt }, { ex: SESSION_TTL_SECONDS });
            return response.status(200).json({ success: true, token, expiresAt });
        } catch (error) {
            console.error('Admin session storage error:', error);
            return response.status(503).json({ success: false, error: 'Admin session storage is unavailable. Check the Vercel KV connection.' });
        }
    }

    if (body.action === 'verify' || body.action === 'logout') {
        try {
            const token = typeof body.token === 'string' ? body.token : '';
            if (body.action === 'logout') {
                if (token) await kv.del(`session:${token}`);
                return response.status(200).json({ success: true });
            }
            const current = token ? await kv.get(`session:${token}`) : null;
            const valid = !!current && current.username === ADMIN_USERNAME && current.expiresAt > Date.now();
            if (!valid && token) await kv.del(`session:${token}`);
            return response.status(200).json({ success: true, valid });
        } catch (error) {
            console.error('Admin session verification error:', error);
            return response.status(503).json({ success: false, error: 'Admin session storage is unavailable.' });
        }
    }
    return response.status(400).json({ success: false, error: 'Invalid action' });
}
