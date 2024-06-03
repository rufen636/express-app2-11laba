import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.post('/', async (req, res) => {
	const { login } = req.body;

	const connection = await pool.promise().getConnection();

	try {
		// Начинаем транзакцию
		await connection.beginTransaction();

		// Находим ID соискателя
		const [applicantResult] = await connection.query('SELECT id FROM applicants WHERE login = ?', [login]);
		if (applicantResult.length === 0) {
			await connection.rollback();
			connection.release();
			return res.status(404).json({ error: 'Профиль не найден или уже удален' });
		}
		const applicantId = applicantResult[0].id;

		// Удаляем записи из таблицы responses, которые связаны с данным соискателем
		await connection.query('DELETE FROM responses WHERE applicant_id = ?', [applicantId]);

		// Удаляем соискателя из таблицы applicants
		const [deleteResult] = await connection.query('DELETE FROM applicants WHERE id = ?', [applicantId]);

		if (deleteResult.affectedRows === 0) {
			await connection.rollback();
			connection.release();
			return res.status(404).json({ error: 'Профиль не найден или уже удален' });
		}

		// Подтверждаем транзакцию
		await connection.commit();
		connection.release();

		res.status(200).json({ message: 'Профиль успешно удален' });
	} catch (error) {
		// Откатываем транзакцию в случае ошибки
		await connection.rollback();
		connection.release();
		console.error('Ошибка при удалении профиля:', error);
		res.status(500).json({ error: 'Ошибка при удалении профиля' });
	}
});

export default router;
