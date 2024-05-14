// eslint-disable-next-line no-undef, @typescript-eslint/no-var-requires
const express = require('express');
const router = express.Router();
// eslint-disable-next-line no-undef, @typescript-eslint/no-var-requires
const pool = require('../db');

router.post('/', async (req, res) => {
	const { name_company, activity, experience, skills, login } = req.body;

	try {
		// Выполняем запрос к базе данных для сохранения данных
		await pool.promise().query('INSERT INTO companys (name_company, activity, experience, skills, login) VALUES (?, ?, ?, ?, ?)',
			[name_company, activity, experience, skills, login]);

		res.status(201).json({ message: 'Profile created successfully' });
	} catch (error) {
		console.error('Error creating profile:', error);
		res.status(500).json({ error: 'Error creating profile' });
	}
});

// eslint-disable-next-line no-undef
module.exports = router;
