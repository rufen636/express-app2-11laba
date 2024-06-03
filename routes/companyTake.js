import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.post('/', async (req, res) => {
	const { login } = req.body;

	try {
		// Получение данных компании
		const [companyData] = await pool.promise().query('SELECT id, name_company, activity, experience, skills FROM companys WHERE login = ?', [login]);

		if (!companyData || companyData.length === 0) {
			return res.status(404).json({ error: 'Компания не найдена' });
		}

		const companyId = companyData[0].id;

		// Получение данных откликов
		const [responses] = await pool.promise().query(`
      SELECT applicants.first_name, applicants.number
      FROM responses
      JOIN applicants ON responses.applicant_id = applicants.id
      WHERE responses.company_id = ?`,
			[companyId]
		);

		// Объединение данных компании и откликов
		const result = {
			...companyData[0],
			responses: responses
		};

		res.status(200).json(result);
	} catch (error) {
		console.error('Ошибка при получении данных анкеты:', error);
		res.status(500).json({ error: 'Ошибка при получении данных анкеты' });
	}
});

export default router;
