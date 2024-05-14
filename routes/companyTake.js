// eslint-disable-next-line no-undef, @typescript-eslint/no-var-requires
const express = require('express');
const router = express.Router();
// eslint-disable-next-line no-undef, @typescript-eslint/no-var-requires
const pool = require('../db');

router.post('/', async (req, res) => {
	const { login } = req.body;

	try {
		const [applicantData] = await pool.promise().query('SELECT name_company, activity, experience, skills FROM companys WHERE login = ?', [login]);

		if (!applicantData || applicantData.length === 0) {
			return res.status(404).json({ error: 'заявка не найдена' });
		}

		res.status(200).json(applicantData[0]);
	} catch (error) {
		console.error('Ошибка при получении данных анкеты:', error);
		res.status(500).json({ error: 'Ошибка при получении данных анкеты' });
	}
});


module.exports = router;
