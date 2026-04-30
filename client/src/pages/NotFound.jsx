import { Link } from 'react-router-dom';

export default function NotFound() {
	return (
		<div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4">
			<div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6">
				<h1 className="text-xl font-semibold text-slate-900">Not found</h1>
				<p className="mt-2 text-sm text-slate-600">That page doesn’t exist.</p>
				<Link
					to="/"
					className="inline-block mt-4 text-sm px-3 py-1.5 rounded-md bg-slate-900 text-white hover:bg-slate-800"
				>
					Go home
				</Link>
			</div>
		</div>
	);
}
