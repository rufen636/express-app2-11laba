import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.post('/', async (req, res) => {
	const { name_company, activity, experience, skills, login } = req.body;

	try {
		// Проверка на наличие существующей вакансии
		const [existingCompany] = await pool.promise().query(
			'SELECT * FROM companys WHERE login = ?',
			[login]
		);

		if (existingCompany.length > 0) {
			return res.status(400).json({ error: 'Вакансия уже существует' });
		}

		// Вставка новой вакансии
		await pool.promise().query(
			'INSERT INTO companys (name_company, activity, experience, skills, login) VALUES (?, ?, ?, ?, ?)',
			[name_company, activity, experience, skills, login]
		);

		res.status(201).json({ message: 'Вакансия успешно создана' });
	} catch (error) {
		console.error('Ошибка при создании вакансии:', error);
		res.status(500).json({ error: 'Ошибка при создании вакансии' });
	}
});

export default router;
