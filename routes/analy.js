import express from 'express';
import pool from '../db.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const router = express.Router();

router.get('/', async (req, res) => {
	try {
		const sql = `
      SELECT 
        CASE 
          WHEN experience = 1 THEN '1'
          WHEN experience = 2 THEN '2'
          ELSE '3' 
        END as experience, 
        COUNT(*) as count 
      FROM applicants 
      GROUP BY experience
    `;
		const [rows] = await pool.promise().query(sql);

		const formattedRows = rows.map(row => ({
			experience: parseInt(row.experience, 10),
			count: row.count
		}));

		res.status(200).json(formattedRows);
	} catch (error) {
		console.error('Ошибка при получении аналитики опыта:', error);
		res.status(500).json({ error: 'Ошибка при получении аналитики опыта' });
	}
});

router.get('/download', async (req, res) => {
	try {
		// Получение данных из базы данных
		const [rows] = await pool.promise().query(`
      SELECT
        experience,
        COUNT(*) as count
      FROM
        applicants
      GROUP BY
        experience
    `);

		// Создание PDF документа
		const doc = new PDFDocument();

		// Указание пути к шрифту
		const fontPath = path.join(__dirname, '../fonts/Roboto-Regular.ttf');
		doc.font(fontPath);

		// Указание файла для записи
		const pdfPath = path.join(__dirname, '../public/experience_report.pdf');
		doc.pipe(fs.createWriteStream(pdfPath));

		// Добавление содержимого в PDF
		doc.fontSize(16).text('Отчет по опыту работы соискателей', { align: 'center' });
		doc.moveDown();

		rows.forEach(row => {
			doc.fontSize(14).text(`Опыт ${row.experience} лет: ${row.count} соискателей`);
			doc.moveDown();
		});

		// Завершение создания PDF
		doc.end();

		// Отправка PDF файла клиенту
		res.download(pdfPath, 'experience_report.pdf');
	} catch (error) {
		console.error('Ошибка при генерации PDF:', error);
		res.status(500).send('Ошибка при генерации PDF');
	}
});

export default router;
