const Task = require('../models/Task');

async function listTasks(req, res) {
	const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
	return res.json({ tasks });
}

async function createTask(req, res) {
	const { title, description, status, dueDate } = req.body || {};

	if (!title || typeof title !== 'string' || !title.trim()) {
		return res.status(400).json({ message: 'title is required' });
	}

	const task = await Task.create({
		user: req.user.id,
		title: title.trim(),
		description: typeof description === 'string' ? description : '',
		status,
		dueDate,
	});

	return res.status(201).json({ task });
}

async function getTask(req, res) {
	const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
	if (!task) {
		return res.status(404).json({ message: 'Task not found' });
	}
	return res.json({ task });
}

async function updateTask(req, res) {
	const updates = {};
	const { title, description, status, dueDate } = req.body || {};

	if (title !== undefined) {
		if (typeof title !== 'string' || !title.trim()) {
			return res.status(400).json({ message: 'title must be a non-empty string' });
		}
		updates.title = title.trim();
	}
	if (description !== undefined) {
		if (typeof description !== 'string') {
			return res.status(400).json({ message: 'description must be a string' });
		}
		updates.description = description;
	}
	if (status !== undefined) {
		updates.status = status;
	}
	if (dueDate !== undefined) {
		updates.dueDate = dueDate;
	}

	const task = await Task.findOneAndUpdate(
		{ _id: req.params.id, user: req.user.id },
		updates,
		{ new: true, runValidators: true }
	);

	if (!task) {
		return res.status(404).json({ message: 'Task not found' });
	}

	return res.json({ task });
}

async function deleteTask(req, res) {
	const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
	if (!task) {
		return res.status(404).json({ message: 'Task not found' });
	}
	return res.status(204).send();
}

module.exports = {
	listTasks,
	createTask,
	getTask,
	updateTask,
	deleteTask,
};
