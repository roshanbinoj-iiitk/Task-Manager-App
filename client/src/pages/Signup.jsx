import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
	const { signup } = useAuth();
	const navigate = useNavigate();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	async function onSubmit(e) {
		e.preventDefault();
		setError('');
		setLoading(true);
		try {
			await signup({ name, email, password });
			navigate('/', { replace: true });
		} catch (err) {
			setError(err.message || 'Signup failed');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4">
			<div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6">
				<h1 className="text-xl font-semibold text-slate-900">Create account</h1>
				<p className="mt-1 text-sm text-slate-600">
					Already have an account?{' '}
					<Link to="/login" className="underline">
						Login
					</Link>
				</p>

				<form className="mt-6 space-y-4" onSubmit={onSubmit}>
					<div>
						<label className="block text-sm text-slate-700">Name</label>
						<input
							type="text"
							autoComplete="name"
							required
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
						/>
					</div>
					<div>
						<label className="block text-sm text-slate-700">Email</label>
						<input
							type="email"
							autoComplete="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
						/>
					</div>
					<div>
						<label className="block text-sm text-slate-700">Password</label>
						<input
							type="password"
							autoComplete="new-password"
							required
							minLength={6}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
						/>
					</div>

					{error ? (
						<div className="text-sm text-red-600">{error}</div>
					) : null}

					<button
						type="submit"
						disabled={loading}
						className="w-full rounded-md bg-slate-900 text-white px-3 py-2 text-sm hover:bg-slate-800 disabled:opacity-60"
					>
						{loading ? 'Creating…' : 'Create account'}
					</button>
				</form>
			</div>
		</div>
	);
}
