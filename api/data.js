import { kv } from '@vercel/kv';

const DATA_KEY = 'esut_department_data';

const defaultData = {
    news: [
        { id: 'news-default-1', title: 'Orientation Programme for New Students', date: '2026-10-15', category: 'Announcement', summary: 'Welcome ceremony scheduled for all newly admitted students.' },
        { id: 'news-default-2', title: 'Departmental Seminar Series', date: '2026-10-22', category: 'Seminar', summary: 'Recent advances in cognitive and behavioural psychology.' }
    ],
    events: [
        { id: 'event-default-1', title: 'Faculty Research Workshop', date: '2026-11-10', venue: 'Faculty Hall', description: 'A workshop on academic writing and research practice.' }
    ],
    courses: [
        { id: 'course-default-1', level: '100 Level', code: 'PSY 101', title: 'Introduction to Psychology', description: 'Foundation course on human behaviour and mental processes.' },
        { id: 'course-default-2', level: '200 Level', code: 'PSY 201', title: 'Physiological Psychology', description: 'Study of the biological basis of human behaviour.' }
    ],
    staff: [
        { id: 'staff-hod-1', name: 'Dr. Prof. Agu Solomon Amaechi', role: 'Head of Department', category: 'Academic', email: 'hod.psychology@esut.edu.ng', photo: 'staff/HOD- DR.PROF AGU SOLOMON AMAECHI.jpg' },
        { id: 'staff-prof-1', name: 'Prof. E. C. Onyeneje', role: 'Professor', category: 'Academic', email: '', photo: 'staff/PROF. E. C. ONYENEJE.png' },
        { id: 'staff-prof-2', name: 'Prof. Ike Onyishi', role: 'Professor', category: 'Academic', email: '', photo: 'staff/PROF. IKE ONYISHI.jpg' },
        { id: 'staff-prof-3', name: 'Prof. Mrs. Obiageli Omeje', role: 'Professor', category: 'Academic', email: '', photo: 'staff/Prof. Mrs. OBIAGELI OMEJE.png' },
        { id: 'staff-prof-4', name: 'Prof. Regina Eya', role: 'Professor', category: 'Academic', email: '', photo: 'staff/PROF. REGINA EYA.png' },
        { id: 'staff-assoc-1', name: 'Assoc. Prof. Elvis Anthony Benjamin', role: 'Associate Professor', category: 'Academic', email: '', photo: 'staff/ASSOC. PROF ELVIS ANTHONY BENJAMIN.png' },
        { id: 'staff-assoc-2', name: 'Assoc. Prof. Tobias Obidra Odor', role: 'Associate Professor', category: 'Academic', email: '', photo: 'staff/ASSOC. PROF TOBIAS OBIDRA ODOR.png' },
        { id: 'staff-dr-1', name: 'Dr. Adaobi Chika Eze', role: 'Senior Lecturer', category: 'Academic', email: '', photo: 'staff/DR. ADAOBI CHIKA EZE.png' },
        { id: 'staff-dr-2', name: 'Dr. Anthonia Chiozie Nwatu', role: 'Senior Lecturer', category: 'Academic', email: '', photo: 'staff/DR. ANTHONIA CHIOZIE NWATU.png' },
        { id: 'staff-dr-3', name: 'Dr. Benedict Chidi Ugwuanyi', role: 'Senior Lecturer', category: 'Academic', email: '', photo: 'staff/DR. BENEDICT CHIDI UGWUANYI.png' },
        { id: 'staff-dr-4', name: 'Dr. Bernard Keneschukwu Anikene', role: 'Senior Lecturer', category: 'Academic', email: '', photo: 'staff/DR. BERNARD KENESCHUKWU ANIKENE.png' },
        { id: 'staff-dr-5', name: 'Dr. Chimezie Chikwendu', role: 'Senior Lecturer', category: 'Academic', email: '', photo: 'staff/DR. CHIMEZIE CHIKWENDU.png' },
        { id: 'staff-dr-6', name: 'Dr. Hycianth Ejike Mgbenkemdi', role: 'Senior Lecturer', category: 'Academic', email: '', photo: 'staff/DR. HYCIANTH EJIKE MGBENKEMDI.png' },
        { id: 'staff-dr-7', name: 'Dr. Raphael Ugwu Anike', role: 'Senior Lecturer', category: 'Academic', email: '', photo: 'staff/DR. RAPHAEL UGWU ANIKE.png' },
        { id: 'staff-dr-8', name: 'Dr. Uche James Abor', role: 'Senior Lecturer', category: 'Academic', email: '', photo: 'staff/DR. UCHE JAMES ABOR.png' },
        { id: 'staff-other-1', name: 'Jacinta Nwakego Nwachukwu', role: 'Staff Member', category: 'Administrative', email: '', photo: 'staff/JACINTA NWAKEGO NWACHUKWU.png' },
        { id: 'staff-other-2', name: 'Jude Chukwudi Ekwo', role: 'Staff Member', category: 'Administrative', email: '', photo: 'staff/JUDE CHUKWUDI EKWO.png' },
        { id: 'staff-other-3', name: 'Louisa Ifeoma Anikwe', role: 'Staff Member', category: 'Administrative', email: '', photo: 'staff/LOUISA IFEOMA ANIKWE.png' },
        { id: 'staff-other-4', name: 'Michael Arinze Eze', role: 'Staff Member', category: 'Administrative', email: '', photo: 'staff/MICHAEL ARINZE EZE.png' },
        { id: 'staff-other-5', name: 'Pamela Adaobi Ogbozor', role: 'Staff Member', category: 'Administrative', email: '', photo: 'staff/PAMELA ADAOBI OGBOZOR.png' }
    ]
};

function generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

async function getData() {
    try {
        const data = await kv.get(DATA_KEY);
        if (!data) {
            await kv.set(DATA_KEY, defaultData);
            return defaultData;
        }
        return data;
    } catch (error) {
        console.error('KV get error:', error);
        return defaultData;
    }
}

async function saveData(data) {
    try {
        await kv.set(DATA_KEY, data);
        return true;
    } catch (error) {
        console.error('KV set error:', error);
        return false;
    }
}

export default async function handler(request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }

    if (request.method === 'GET') {
        const data = await getData();
        return response.status(200).json({ success: true, data });
    }

    if (request.method === 'POST') {
        const { type, item, action } = request.body;

        const data = await getData();

        if (action === 'delete' && type && item?.id) {
            data[type] = data[type].filter(entry => entry.id !== item.id);
            await saveData(data);
            return response.status(200).json({ success: true, data });
        }

        if (action === 'update' && type && item?.id) {
            const index = data[type].findIndex(entry => entry.id === item.id);
            if (index !== -1) {
                data[type][index] = { ...data[type][index], ...item };
                await saveData(data);
                return response.status(200).json({ success: true, data });
            }
            return response.status(404).json({ success: false, error: 'Item not found' });
        }

        if (type && item) {
            const newItem = { ...item, id: item.id || generateId(type.slice(0, -1)) };
            data[type].push(newItem);
            await saveData(data);
            return response.status(200).json({ success: true, data, item: newItem });
        }

        return response.status(400).json({ success: false, error: 'Invalid request' });
    }

    return response.status(405).json({ success: false, error: 'Method not allowed' });
}