const mongoose = require('mongoose');

async function connectToDatabase(mongoUri) {
	if (!mongoUri) {
		throw new Error('MONGODB_URI is required');
	}

	if (mongoUri.includes('<') || mongoUri.includes('>')) {
		throw new Error(
			'MONGODB_URI looks like a placeholder. Update server/.env with a real MongoDB connection string.'
		);
	}
	
	// Common Atlas pitfall: password contains special characters like '@' and must be URL-encoded.
	const stripped = mongoUri.replace(/^mongodb(\+srv)?:\/\//, '');
	const atCount = (stripped.match(/@/g) || []).length;
	if (atCount > 1) {
		throw new Error(
			'MONGODB_URI appears to contain an unescaped "@" in the username/password. URL-encode special characters in your MongoDB password (e.g. "@" => "%40").'
		);
	}

	mongoose.set('strictQuery', true);
	await mongoose.connect(mongoUri);
	return mongoose.connection;
}

module.exports = { connectToDatabase };
