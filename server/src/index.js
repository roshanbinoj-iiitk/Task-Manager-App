require('dotenv').config();

const { createApp } = require('./app');
const { connectToDatabase } = require('./config/db');

const PORT = process.env.PORT || 4000;

async function start() {
	if (!process.env.JWT_SECRET) {
		throw new Error('JWT_SECRET is required');
	}

	await connectToDatabase(process.env.MONGODB_URI);

	const app = createApp();
	app.listen(PORT, () => {
		console.log(`API listening on http://localhost:${PORT}`);
	});
}

start().catch((err) => {
	console.error(err);
	process.exit(1);
});
