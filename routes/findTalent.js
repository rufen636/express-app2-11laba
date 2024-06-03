import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.post('/', async (req, res) => {
	const { query, experienceFilters } = req.body;

	try {
		let sql = 'SELECT * FROM applicants WHERE (first_name LIKE ? OR field_of_work LIKE ? OR skills LIKE ?)';
		const params = [`%${query}%`, `%${query}%`, `%${query}%`];

		if (experienceFilters.length) {
			const filters = experienceFilters.map(() => 'experience = ?').join(' OR ');
			sql += ` AND (${filters})`;
			params.push(...experienceFilters);
		}

		const [candidates] = await pool.promise().query(sql, params);
		res.status(200).json(candidates);
	} catch (error) {
		console.error('Ошибка при поиске кандидатов:', error);
		res.status(500).json({ error: 'Ошибка при поиске кандидатов' });
	}
});

export default router;
