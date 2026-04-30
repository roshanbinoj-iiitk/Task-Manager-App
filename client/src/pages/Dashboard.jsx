import { useEffect, useMemo, useState } from 'react';
import { createTask, deleteTask, listTasks, updateTask } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const STATUS_OPTIONS = [
	{ value: 'todo', label: 'To do' },
	{ value: 'in-progress', label: 'In progress' },
	{ value: 'done', label: 'Done' },
];

export default function Dashboard() {
	const { token } = useAuth();
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [creating, setCreating] = useState(false);

	const stats = useMemo(() => {
		const counts = { todo: 0, 'in-progress': 0, done: 0 };
		for (const t of tasks) counts[t.status] = (counts[t.status] || 0) + 1;
		return counts;
	}, [tasks]);

	useEffect(() => {
		let cancelled = false;
		async function load() {
			setLoading(true);
			setError('');
			try {
				const data = await listTasks(token);
				if (!cancelled) setTasks(data.tasks);
			} catch (err) {
				if (!cancelled) setError(err.message || 'Failed to load tasks');
			} finally {
				if (!cancelled) setLoading(false);
			}
		}
		load();
		return () => {
			cancelled = true;
		};
	}, [token]);

	async function onCreate(e) {
		e.preventDefault();
		setCreating(true);
		setError('');
		try {
			const data = await createTask(token, { title, description });
			setTasks((prev) => [data.task, ...prev]);
			setTitle('');
			setDescription('');
		} catch (err) {
			setError(err.message || 'Failed to create task');
		} finally {
			setCreating(false);
		}
	}

	async function onChangeStatus(taskId, nextStatus) {
		setTasks((prev) =>
			prev.map((t) => (t._id === taskId ? { ...t, status: nextStatus } : t))
		);
		try {
			await updateTask(token, taskId, { status: nextStatus });
		} catch (err) {
			setError(err.message || 'Failed to update task');
			// reload from server to get back to consistent state
			const data = await listTasks(token);
			setTasks(data.tasks);
		}
	}

	async function onDelete(taskId) {
		const prev = tasks;
		setTasks((t) => t.filter((x) => x._id !== taskId));
		try {
			await deleteTask(token, taskId);
		} catch (err) {
			setError(err.message || 'Failed to delete task');
			setTasks(prev);
		}
	}

	return (
		<div className="mx-auto max-w-5xl px-4 py-8">
			<div className="flex items-start justify-between gap-4 flex-wrap">
				<div>
					<h1 className="text-2xl font-semibold text-slate-900">Your tasks</h1>
					<p className="mt-1 text-sm text-slate-600">
						Keep track of what you need to do.
					</p>
				</div>
				<div className="flex items-center gap-2 text-sm">
					<div className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-800">
						To do: {stats.todo}
					</div>
					<div className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-800">
						In progress: {stats['in-progress']}
					</div>
					<div className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-800">
						Done: {stats.done}
					</div>
				</div>
			</div>

			<div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-1">
					<div className="bg-white border border-slate-200 rounded-xl p-4">
						<h2 className="font-semibold text-slate-900">Create task</h2>
						<form className="mt-4 space-y-3" onSubmit={onCreate}>
							<div>
								<label className="block text-sm text-slate-700">Title</label>
								<input
									type="text"
									required
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
								/>
							</div>
							<div>
								<label className="block text-sm text-slate-700">Description</label>
								<textarea
									rows={3}
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
								/>
							</div>
							<button
								type="submit"
								disabled={creating}
								className="w-full rounded-md bg-slate-900 text-white px-3 py-2 text-sm hover:bg-slate-800 disabled:opacity-60"
							>
								{creating ? 'Creating…' : 'Add task'}
							</button>
						</form>
					</div>
					{error ? (
						<div className="mt-3 text-sm text-red-600">{error}</div>
					) : null}
				</div>

				<div className="lg:col-span-2">
					<div className="bg-white border border-slate-200 rounded-xl">
						<div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
							<h2 className="font-semibold text-slate-900">All tasks</h2>
							<div className="text-xs text-slate-600">{tasks.length} total</div>
						</div>

						{loading ? (
							<div className="p-6 text-sm text-slate-600">Loading tasks…</div>
						) : tasks.length === 0 ? (
							<div className="p-6 text-sm text-slate-600">
								No tasks yet. Add your first one.
							</div>
						) : (
							<ul className="divide-y divide-slate-200">
								{tasks.map((task) => (
									<li key={task._id} className="p-4">
										<div className="flex items-start justify-between gap-4">
											<div>
												<div className="font-medium text-slate-900">{task.title}</div>
												{task.description ? (
													<div className="mt-1 text-sm text-slate-600 whitespace-pre-wrap">
														{task.description}
													</div>
												) : null}
												<div className="mt-2 text-xs text-slate-500">
													Created {new Date(task.createdAt).toLocaleString()}
												</div>
											</div>

											<div className="flex items-center gap-2">
												<select
													value={task.status}
													onChange={(e) => onChangeStatus(task._id, e.target.value)}
													className="text-sm rounded-md border border-slate-300 px-2 py-1.5"
												>
													{STATUS_OPTIONS.map((o) => (
														<option key={o.value} value={o.value}>
															{o.label}
														</option>
													))}
												</select>
												<button
													type="button"
													onClick={() => onDelete(task._id)}
													className="text-sm px-3 py-1.5 rounded-md border border-slate-300 hover:bg-slate-50"
												>
													Delete
												</button>
											</div>
										</div>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
