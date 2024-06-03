import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.post('/', async (req, res) => {
	const { login } = req.body;

	try {
		const [applicantData] = await pool.promise().query('SELECT id, first_name, second_name, surname, experience, skills, field_of_work, number FROM applicants WHERE login = ?', [login]);

		if (!applicantData || applicantData.length === 0) {
			return res.status(404).json({ error: 'Анкета не найдена' });
		}

		res.status(200).json(applicantData[0]);
	} catch (error) {
		console.error('Ошибка при получении данных анкеты:', error);
		res.status(500).json({ error: 'Ошибка при получении данных анкеты' });
	}
});

export default router;
