import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
	const { user, logout } = useAuth();

	return (
		<header className="border-b border-slate-200 bg-white">
			<div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
				<Link to="/" className="font-semibold text-slate-900">
					Task Manager
				</Link>
				<div className="flex items-center gap-3">
					{user ? (
						<>
							<div className="text-sm text-slate-700">{user.name}</div>
							<button
								type="button"
								onClick={logout}
								className="text-sm px-3 py-1.5 rounded-md border border-slate-300 hover:bg-slate-50"
							>
								Logout
							</button>
						</>
					) : (
						<div className="flex items-center gap-2">
							<Link
								to="/login"
								className="text-sm px-3 py-1.5 rounded-md border border-slate-300 hover:bg-slate-50"
							>
								Login
							</Link>
							<Link
								to="/signup"
								className="text-sm px-3 py-1.5 rounded-md bg-slate-900 text-white hover:bg-slate-800"
							>
								Sign up
							</Link>
						</div>
					)}
				</div>
			</div>
		</header>
	);
}
