import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
	const { ready, user } = useAuth();

	if (!ready) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-sm text-slate-600">Loading…</div>
			</div>
		);
	}

	if (!user) return <Navigate to="/login" replace />;
	return <Outlet />;
}
