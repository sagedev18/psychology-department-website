import { kv } from '@vercel/kv';

const DATA_KEY = 'esut_department_data';
const defaultData = {
    news: [
        { id: 'news-default-1', title: 'Orientation Programme for New Students', date: '2026-10-15', category: 'Announcement', summary: 'Welcome ceremony scheduled for all newly admitted students.' },
        { id: 'news-default-2', title: 'Departmental Seminar Series', date: '2026-10-22', category: 'Seminar', summary: 'Recent advances in cognitive and behavioural psychology.' }
    ],
    events: [{ id: 'event-default-1', title: 'Faculty Research Workshop', date: '2026-11-10', venue: 'Faculty Hall', description: 'A workshop on academic writing and research practice.' }],
    courses: [
        { id: 'course-default-1', level: '100 Level', code: 'PSY 101', title: 'Introduction to Psychology', description: 'Foundation course on human behaviour and mental processes.' },
        { id: 'course-default-2', level: '200 Level', code: 'PSY 201', title: 'Physiological Psychology', description: 'Study of the biological basis of human behaviour.' }
    ],
    staff: [],
    gallery: []
};

async function getData() {
    const stored = await kv.get(DATA_KEY);
    if (!stored) {
        await kv.set(DATA_KEY, defaultData);
        return defaultData;
    }
    return {
        ...defaultData,
        ...stored,
        news: Array.isArray(stored.news) ? stored.news : defaultData.news,
        events: Array.isArray(stored.events) ? stored.events : defaultData.events,
        courses: Array.isArray(stored.courses) ? stored.courses : defaultData.courses,
        staff: Array.isArray(stored.staff) ? stored.staff : defaultData.staff,
        gallery: Array.isArray(stored.gallery) ? stored.gallery : defaultData.gallery
    };
}

export default async function handler(request, response) {
    response.setHeader('Cache-Control', 'no-store, max-age=0');
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (request.method === 'OPTIONS') return response.status(200).end();
    if (request.method !== 'GET') return response.status(405).json({ success: false, error: 'Method not allowed' });

    try {
        return response.status(200).json({ success: true, data: await getData() });
    } catch (error) {
        console.error('KV read error:', error);
        return response.status(503).json({ success: false, error: 'Shared content storage is unavailable. Connect Vercel KV to this deployment and retry.' });
    }
}
