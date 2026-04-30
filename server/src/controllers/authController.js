const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signToken(userId) {
	const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
	return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn });
}

async function signup(req, res) {
	const { name, email, password } = req.body || {};

	if (!name || !email || !password) {
		return res
			.status(400)
			.json({ message: 'name, email, and password are required' });
	}
	if (typeof password !== 'string' || password.length < 6) {
		return res
			.status(400)
			.json({ message: 'password must be at least 6 characters' });
	}

	const existing = await User.findOne({ email });
	if (existing) {
		return res.status(409).json({ message: 'Email already in use' });
	}

	const passwordHash = await bcrypt.hash(password, 10);

	let user;
	try {
		user = await User.create({ name, email, passwordHash });
	} catch (err) {
		if (err && err.code === 11000) {
			return res.status(409).json({ message: 'Email already in use' });
		}
		throw err;
	}

	const token = signToken(user._id.toString());
	return res.status(201).json({
		token,
		user: { id: user._id.toString(), name: user.name, email: user.email },
	});
}

async function login(req, res) {
	const { email, password } = req.body || {};

	if (!email || !password) {
		return res.status(400).json({ message: 'email and password are required' });
	}

	const user = await User.findOne({ email }).select('+passwordHash');
	if (!user) {
		return res.status(401).json({ message: 'Invalid credentials' });
	}

	const ok = await bcrypt.compare(password, user.passwordHash);
	if (!ok) {
		return res.status(401).json({ message: 'Invalid credentials' });
	}

	const token = signToken(user._id.toString());
	return res.json({
		token,
		user: { id: user._id.toString(), name: user.name, email: user.email },
	});
}

async function me(req, res) {
	const user = await User.findById(req.user.id);
	if (!user) {
		return res.status(404).json({ message: 'User not found' });
	}
	return res.json({ user: { id: user._id.toString(), name: user.name, email: user.email } });
}

module.exports = { signup, login, me };
