import { kv } from '@vercel/kv';

const SESSION_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const DATA_KEY = 'esut_department_data';

export default async function handler(request, response) {
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (request.method === 'OPTIONS') return response.status(200).end();
    if (request.method !== 'POST') return response.status(405).json({ success: false, error: 'Method not allowed' });

    const authorization = request.headers.authorization || '';
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
    if (!token || token.startsWith('esut_local_')) {
        return response.status(401).json({ success: false, error: 'Please sign in again to publish changes.' });
    }

    try {
        const session = await kv.get(`session:${token}`);
        if (!session || session.username !== SESSION_USERNAME || session.expiresAt <= Date.now()) {
            return response.status(401).json({ success: false, error: 'Your admin session has expired. Please sign in again.' });
        }

        const data = request.body && request.body.data;
        const collections = ['news', 'events', 'courses', 'staff', 'gallery'];
        if (!data || typeof data !== 'object' || collections.some(key => !Array.isArray(data[key]))) {
            return response.status(400).json({ success: false, error: 'Invalid website content data.' });
        }
        if (Buffer.byteLength(JSON.stringify(data), 'utf8') > 3500000) {
            return response.status(413).json({ success: false, error: 'Content is too large to save. Please use smaller images.' });
        }

        await kv.set(DATA_KEY, data);
        return response.status(200).json({ success: true });
    } catch (error) {
        console.error('Content save error:', error);
        return response.status(503).json({ success: false, error: 'Shared storage is unavailable. Check your Vercel KV connection and try again.' });
    }
}
