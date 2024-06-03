import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
	try {
		const [applicantData] = await pool.promise().query('SELECT id, name_company, activity, experience, skills FROM companys');

		if (!applicantData || applicantData.length === 0) {
			return res.status(404).json({ error: 'Данных о компаниях не существует' });
		}

		res.status(200).json(applicantData);
	} catch (error) {
		console.error('Ошибка при получении данных анкеты:', error);
		res.status(500).json({ error: 'Ошибка при получении данных анкеты' });
	}
});

export default router;
