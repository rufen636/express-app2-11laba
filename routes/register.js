import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/', async (req, res) => {
	const { login, password, roles } = req.body;
	if (!login || !password || !roles) {
		return res.status(400).json({ error: 'Missing required fields' });
	}

	try {
		// Проверяем, существует ли пользователь с таким логином
		const [existingUsers] = await pool.promise().query('SELECT * FROM users2 WHERE login = ?', [login]);
		if (existingUsers.length > 0) {
			return res.status(400).json({ error: 'User with this login already exists' });
		}

		// Хэшируем пароль
		const hashedPassword = await bcrypt.hash(password, 10);

		// Сохраняем пользователя в базе данных
		await pool.promise().query('INSERT INTO users2 (login, password, roles) VALUES (?, ?, ?)', [login, hashedPassword, roles.join(',')]);

		res.status(201).json({ message: 'User registered successfully' });
	} catch (error) {
		console.error('Error registering user:', error);
		res.status(500).json({ error: 'Error registering user' });
	}
});

export default router;
