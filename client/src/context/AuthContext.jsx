import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authLogin, authMe, authSignup } from '../lib/api';

const AuthContext = createContext(null);

const STORAGE_KEY = 'taskmgr_token';

export function AuthProvider({ children }) {
	const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY));
	const [user, setUser] = useState(null);
	const [ready, setReady] = useState(false);

	const logout = useCallback(() => {
		localStorage.removeItem(STORAGE_KEY);
		setToken(null);
		setUser(null);
	}, []);

	const login = useCallback(async ({ email, password }) => {
		const data = await authLogin({ email, password });
		localStorage.setItem(STORAGE_KEY, data.token);
		setToken(data.token);
		setUser(data.user);
		return data;
	}, []);

	const signup = useCallback(async ({ name, email, password }) => {
		const data = await authSignup({ name, email, password });
		localStorage.setItem(STORAGE_KEY, data.token);
		setToken(data.token);
		setUser(data.user);
		return data;
	}, []);

	useEffect(() => {
		let cancelled = false;

		async function hydrate() {
			if (!token) {
				setReady(true);
				return;
			}
			try {
				const data = await authMe(token);
				if (!cancelled) setUser(data.user);
			} catch {
				if (!cancelled) logout();
			} finally {
				if (!cancelled) setReady(true);
			}
		}

		hydrate();
		return () => {
			cancelled = true;
		};
	}, [token, logout]);

	const value = useMemo(
		() => ({ token, user, ready, login, signup, logout }),
		[token, user, ready, login, signup, logout]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within AuthProvider');
	return ctx;
}
