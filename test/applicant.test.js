/* eslint-disable no-undef */
import { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import supertest from 'supertest';
import pool from '../db.js';
import app from '../app.js';

chai.use(chaiHttp);


describe('Applicant Route', () => {
	let request;
	let sandbox;

	before(() => {
		request = supertest(app);
		sandbox = sinon.createSandbox();
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('POST /api/applicant', () => {
		it('should create a new applicant if it does not exist', async () => {
			sandbox.stub(pool.promise(), 'query')
				.onFirstCall().resolves([[]])
				.onSecondCall().resolves([{ insertId: 1 }]);

			const res = await request.post('/api/applicant').send({
				first_name: 'John',
				second_name: 'Doe',
				surname: 'Smith',
				experience: 5,
				skills: 'JavaScript, Node.js',
				field_of_work: 'Software Development',
				number: '1234567890',
				login: 'testuser'
			});

			expect(res.status).to.equal(201);
			expect(res.body).to.have.property('message', 'Анкета успешно создана');
		});

		it('should return 400 if applicant already exists', async () => {
			const mockData = [
				{
					id: 1,
					first_name: 'John',
					second_name: 'Doe',
					surname: 'Smith',
					experience: 5,
					skills: 'JavaScript, Node.js',
					field_of_work: 'Software Development',
					number: '1234567890',
					login: 'testuser'
				}
			];

			sandbox.stub(pool.promise(), 'query').resolves([mockData]);

			const res = await request.post('/api/applicant').send({
				first_name: 'John',
				second_name: 'Doe',
				surname: 'Smith',
				experience: 5,
				skills: 'JavaScript, Node.js',
				field_of_work: 'Software Development',
				number: '1234567890',
				login: 'testuser'
			});

			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error', 'Анкета уже существует');
		});

		it('should return 500 if there is a database error', async () => {
			sandbox.stub(pool.promise(), 'query').rejects(new Error('Database error'));

			const res = await request.post('/api/applicant').send({
				first_name: 'John',
				second_name: 'Doe',
				surname: 'Smith',
				experience: 5,
				skills: 'JavaScript, Node.js',
				field_of_work: 'Software Development',
				number: '1234567890',
				login: 'testuser'
			});

			expect(res.status).to.equal(500);
			expect(res.body).to.have.property('error', 'Ошибка при сохранении данных');
		});
	});
});
