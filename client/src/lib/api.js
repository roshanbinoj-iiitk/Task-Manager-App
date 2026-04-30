const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

async function apiRequest(path, { method = 'GET', body, token } = {}) {
	const headers = { Accept: 'application/json' };
	if (body !== undefined) headers['Content-Type'] = 'application/json';
	if (token) headers.Authorization = `Bearer ${token}`;

	const res = await fetch(`${API_URL}${path}`, {
		method,
		headers,
		body: body !== undefined ? JSON.stringify(body) : undefined,
	});

	if (res.status === 204) return null;

	let data;
	try {
		data = await res.json();
	} catch {
		data = null;
	}

	if (!res.ok) {
		const message = data?.message || `Request failed (${res.status})`;
		const err = new Error(message);
		err.status = res.status;
		err.data = data;
		throw err;
	}

	return data;
}

export function authSignup(payload) {
	return apiRequest('/api/auth/signup', { method: 'POST', body: payload });
}

export function authLogin(payload) {
	return apiRequest('/api/auth/login', { method: 'POST', body: payload });
}

export function authMe(token) {
	return apiRequest('/api/auth/me', { token });
}

export function listTasks(token) {
	return apiRequest('/api/tasks', { token });
}

export function createTask(token, payload) {
	return apiRequest('/api/tasks', { method: 'POST', token, body: payload });
}

export function updateTask(token, id, payload) {
	return apiRequest(`/api/tasks/${id}`, { method: 'PUT', token, body: payload });
}

export function deleteTask(token, id) {
	return apiRequest(`/api/tasks/${id}`, { method: 'DELETE', token });
}
