// eslint-disable-next-line no-undef, @typescript-eslint/no-var-requires
const express = require('express');
const router = express.Router();
// eslint-disable-next-line no-undef, @typescript-eslint/no-var-requires
const pool = require('../db');

router.post('/', async (req, res) => {
	const { login } = req.body;

	try {
		// Используем обычный SQL запрос для удаления данных
		const [result] = await pool.promise().query('DELETE FROM companys WHERE login = ?', [login]);

		if (result.affectedRows === 0) {
			return res.status(404).json({ error: 'Профиль не найден или уже удален' });
		}

		res.status(200).json({ message: 'Профиль успешно удален' });
	} catch (error) {
		console.error('Ошибка при удалении профиля:', error);
		res.status(500).json({ error: 'Ошибка при удалении профиля' });
	}
});

module.exports = router;
