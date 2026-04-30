const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

function createApp() {
	const app = express();

	const corsOptions = process.env.CLIENT_ORIGIN
		? { origin: process.env.CLIENT_ORIGIN }
		: { origin: true };

	app.use(cors(corsOptions));
	app.use(express.json({ limit: '1mb' }));
	app.use(morgan('dev'));

	app.get('/api/health', (req, res) => {
		res.json({ ok: true });
	});

	app.use('/api/auth', authRoutes);
	app.use('/api/tasks', taskRoutes);

	app.use((req, res) => {
		res.status(404).json({ message: 'Not found' });
	});

	// eslint-disable-next-line no-unused-vars
	app.use((err, req, res, next) => {
		console.error(err);
		res.status(500).json({ message: 'Internal server error' });
	});

	return app;
}

module.exports = { createApp };
