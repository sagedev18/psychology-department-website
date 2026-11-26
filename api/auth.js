import { createClient } from 'redis';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'iamadmin22#';
const SESSION_TTL_SECONDS = 60 * 60 * 24;

let redisClient;
async function getRedis() {
    if (!process.env.REDIS_URL) throw new Error('REDIS_URL is not configured');
    if (!redisClient) {
        redisClient = createClient({ url: process.env.REDIS_URL });
        redisClient.on('error', error => console.error('Redis error:', error));
    }
    if (!redisClient.isOpen) await redisClient.connect();
    return redisClient;
}

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
            const redis = await getRedis();
            const token = createToken();
            const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
            await redis.set(`session:${token}`, JSON.stringify({ username: ADMIN_USERNAME, expiresAt }), { EX: SESSION_TTL_SECONDS });
            return response.status(200).json({ success: true, token, expiresAt });
        } catch (error) {
            console.error('Admin session storage error:', error);
            return response.status(503).json({ success: false, error: 'Admin session storage is unavailable. Check the Vercel Redis connection.' });
        }
    }

    if (body.action === 'verify' || body.action === 'logout') {
        try {
            const redis = await getRedis();
            const token = typeof body.token === 'string' ? body.token : '';
            if (body.action === 'logout') {
                if (token) await redis.del(`session:${token}`);
                return response.status(200).json({ success: true });
            }
            const raw = token ? await redis.get(`session:${token}`) : null;
            const session = raw ? JSON.parse(raw) : null;
            const valid = !!session && session.username === ADMIN_USERNAME && session.expiresAt > Date.now();
            if (!valid && token) await redis.del(`session:${token}`);
            return response.status(200).json({ success: true, valid });
        } catch (error) {
            console.error('Admin session verification error:', error);
            return response.status(503).json({ success: false, error: 'Admin session storage is unavailable.' });
        }
    }
    return response.status(400).json({ success: false, error: 'Invalid action' });
}
