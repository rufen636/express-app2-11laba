import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Маршрут для отклика на вакансию
router.post('/', async (req, res) => {
	const { applicant_id, company_id } = req.body;

	try {
		// Проверка на наличие существующего отклика
		const [existingResponse] = await pool.promise().query(
			'SELECT * FROM responses WHERE applicant_id = ? AND company_id = ?',
			[applicant_id, company_id]
		);

		if (existingResponse.length > 0) {
			return res.status(400).json({ error: 'Вы уже откликались на эту компанию' });
		}

		// Вставка нового отклика
		await pool.promise().query(
			'INSERT INTO responses (applicant_id, company_id) VALUES (?, ?)',
			[applicant_id, company_id]
		);

		res.status(201).json({ message: 'Отклик успешно отправлен' });
	} catch (error) {
		console.error('Ошибка при отправке отклика:', error);
		res.status(500).json({ error: 'Ошибка при отправке отклика' });
	}
});

export default router;
