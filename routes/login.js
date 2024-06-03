import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/', async (req, res) => {
	const { login, password } = req.body;
	if (!login || !password) {
		return res.status(400).json({ error: 'Missing login or password' });
	}

	try {
		// Получаем пользователя из базы данных по логину
		const [users] = await pool.promise().query('SELECT * FROM users2 WHERE login = ?', [login]);
		if (users.length === 0) {
			return res.status(401).json({ error: 'User not found' });
		}

		const user = users[0];

		// Сравниваем хэшированный пароль из базы данных с введенным паролем
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			return res.status(401).json({ error: 'Invalid password' });
		}

		// Генерируем JWT токен для аутентифицированного пользователя
		const token = jwt.sign({ login: user.login, role: user.roles }, 'your_secret_key', { expiresIn: '1h' });

		res.status(200).json({ token, role: user.roles, login: user.login });
	} catch (error) {
		console.error('Error authenticating user:', error);
		res.status(500).json({ error: 'Error authenticating user' });
	}
});

export default router;
