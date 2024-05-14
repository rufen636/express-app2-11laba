// eslint-disable-next-line no-undef, @typescript-eslint/no-var-requires
const express = require('express');
// eslint-disable-next-line no-undef, @typescript-eslint/no-var-requires
const bodyParser = require('body-parser');
// eslint-disable-next-line no-undef, @typescript-eslint/no-var-requires
const pool = require('../db');
// eslint-disable-next-line no-undef, @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');
// eslint-disable-next-line no-undef, @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');
// eslint-disable-next-line no-undef, @typescript-eslint/no-var-requires
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/register', async (req, res) => {
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

// Аутентификация пользователя
// Аутентификация пользователя
app.post('/api/login', async (req, res) => {
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

		res.status(200).json({ token, role: user.roles });
	} catch (error) {
		console.error('Error authenticating user:', error);
		res.status(500).json({ error: 'Error authenticating user' });
	}
});

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
