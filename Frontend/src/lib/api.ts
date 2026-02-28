const BASE = import.meta.env.VITE_API_URL || 'http://localhost:9090';

export const token = {
    get: () => localStorage.getItem('eco_token'),
    set: (t: string) => localStorage.setItem('eco_token', t),
    clear: () => localStorage.removeItem('eco_token'),
};

async function req<T>(path: string, opts: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
        ...(opts.body && !(opts.body instanceof FormData)
            ? { 'Content-Type': 'application/json' }
            : {}),
        ...(token.get() ? { Authorization: `Bearer ${token.get()}` } : {}),
    };
    const res = await fetch(`${BASE}${path}`, { ...opts, headers });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message ?? 'Request failed');
    return json.data as T;
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export const login = (identifier: string, password: string) =>
    req<{ user: any; roleRecord: any; token: string }>(
        '/api/auth/login',
        { method: 'POST', body: JSON.stringify({ identifier, password }) }
    );

export const register = (payload: any) =>
    req<{ user: any; roleRecord: any; token: string }>(
        '/api/auth/register',
        { method: 'POST', body: JSON.stringify(payload) }
    );

export const getMe = () =>
    req<{ user: any; roleRecord: any }>('/api/auth/me');

// ── Student profile ──────────────────────────────────────────────────────────
export const getProfile = () => req<any>('/api/students/profile');

export const updateProfile = (data: {
    firstName?: string;
    lastName?: string;
    city?: string;
    address?: string;
    avatarUrl?: string;
}) => req<any>('/api/students/profile', { method: 'PUT', body: JSON.stringify(data) });

export const uploadAvatar = (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return req<{ avatarUrl: string }>('/api/students/avatar', { method: 'PUT', body: form });
};

// ── Quizzes ──────────────────────────────────────────────────────────────────
export const getQuizzes = (params?: { topic?: string; difficulty?: string }) => {
    const q = new URLSearchParams(params as any).toString();
    return req<any[]>(`/api/quizzes${q ? '?' + q : ''}`);
};

export const getQuiz = (id: string) => req<any>(`/api/quizzes/${id}`);

export const submitQuiz = (
    id: string,
    answers: Record<string, number>,
    timeTaken: number
) =>
    req<any>(`/api/quizzes/${id}/submit`, {
        method: 'POST',
        body: JSON.stringify({ answers, timeTaken }),
    });

export const getMyAttempts = () => req<any[]>('/api/quizzes/my/attempts');

// ── Challenges ───────────────────────────────────────────────────────────────
export const getChallenges = () => req<any[]>('/api/challenges');

export const submitChallenge = (
    id: string,
    notes: string,
    files: File[],
    geo?: { lat: number; lng: number } | null
) => {
    const form = new FormData();
    form.append('notes', notes);
    files.forEach((f) => form.append('media', f));
    if (geo) {
        form.append('geoLat', String(geo.lat));
        form.append('geoLng', String(geo.lng));
    }
    return req<any>(`/api/challenges/${id}/submit`, { method: 'POST', body: form });
};

export const getMySubmissions = () =>
    req<any[]>('/api/challenges/submissions/my');

// ── EcoMap ───────────────────────────────────────────────────────────────────
export const getEcoMapPins = (instituteId?: string) => {
    const params = instituteId ? `?instituteId=${instituteId}` : '';
    return req<any[]>(`/api/ecomap/pins${params}`);
};

export const getEcoMapStats = () =>
    req<any>('/api/ecomap/stats');

// ── Store ─────────────────────────────────────────────────────────────────────
export const getOwnedItems = () => req<string[]>('/api/store/owned');

export const purchaseItem = (itemId: string, cost: number) =>
    req<{ coins: number; ownedItems: string[] }>(
        '/api/store/purchase',
        { method: 'POST', body: JSON.stringify({ itemId, cost }) }
    );

// ── Gamification ──────────────────────────────────────────────────────────────
export const getQuests = () => req<any[]>('/api/gamification/quests');

export const claimQuest = (id: string) =>
    req<any>(`/api/gamification/quests/${id}/claim`, { method: 'POST' });

export const purchaseShield = () =>
    req<{ coins: number; streakShields: number }>(
        '/api/gamification/shields/purchase',
        { method: 'POST' }
    );

// ── Leaderboard ───────────────────────────────────────────────────────────────
export const getLeaderboard = (category = 'total', limit = 20) =>
    req<{ entries: any[]; myRank: any; total: number }>(
        `/api/leaderboard?category=${category}&limit=${limit}`
    );

// ── Teacher ───────────────────────────────────────────────────────────────────
export const getTeacherOverview = () => req<any>('/api/teacher/overview');
export const getTeacherStudents = () => req<any[]>('/api/teacher/students');
export const getPendingSubmissions = () =>
    req<any[]>('/api/challenges/submissions/pending');

export const reviewSubmission = (
    id: string,
    status: 'APPROVED' | 'REJECTED',
    reviewNotes?: string
) =>
    req<any>(`/api/challenges/submissions/${id}/review`, {
        method: 'PUT',
        body: JSON.stringify({ status, reviewNotes }),
    });

export const createQuiz = (quiz: any) =>
    req<any>('/api/quizzes', { method: 'POST', body: JSON.stringify(quiz) });

// ── Teacher: Challenge Management ─────────────────────────────────────────────
export const createChallenge = (data: {
  title: string;
  description: string;
  type: string;
  difficulty: string;
  points: number;
  duration: string;
  requirements: string[];
  tips: string[];
  icon: string;
  color: string;
  isPublished: boolean;
}) =>
  req<any>('/api/challenges', {
    method: 'POST',
    body: JSON.stringify({
      ...data,
      difficulty: data.difficulty.toUpperCase(),   // backend expects EASY/MEDIUM/HARD
      type: data.type.toUpperCase(),               // backend expects PHOTO/ACTION/SOCIAL/LEARNING/GAME
    }),
  });

export const updateChallenge = (id: string, data: any) =>
  req<any>(`/api/challenges/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteChallenge = (id: string) =>
  req<void>(`/api/challenges/${id}`, { method: 'DELETE' });

// ── Teacher: Own Content ──────────────────────────────────────────────────────
export const getTeacherQuizzes = () => req<any[]>('/api/teacher/quizzes');

export const getTeacherChallenges = () => req<any[]>('/api/teacher/challenges');

// ── Teacher: Quiz Management ──────────────────────────────────────────────────
export const deleteQuiz = (id: string) =>
  req<void>(`/api/quizzes/${id}`, { method: 'DELETE' });

export const publishQuiz = (id: string) =>
  req<any>(`/api/quizzes/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ isPublished: true }),
  });
