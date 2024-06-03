import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Маршрут для сохранения анкеты соискателя
router.post('/', async (req, res) => {
	const { first_name, second_name, surname, experience, skills, field_of_work, number, login } = req.body;

	try {
		// Проверка на наличие существующей анкеты
		const [existingApplicant] = await pool.promise().query(
			'SELECT * FROM applicants WHERE login = ?',
			[login]
		);

		if (existingApplicant.length > 0) {
			return res.status(400).json({ error: 'Анкета уже существует' });
		}

		// Вставка новой анкеты
		await pool.promise().query(
			'INSERT INTO applicants (first_name, second_name, surname, experience, skills, field_of_work, number, login) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
			[first_name, second_name, surname, experience, skills, field_of_work, number, login]
		);

		res.status(201).json({ message: 'Анкета успешно создана' });
	} catch (error) {
		console.error('Ошибка при сохранении данных:', error);
		res.status(500).json({ error: 'Ошибка при сохранении данных' });
	}
});

export default router;
