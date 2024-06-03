/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import supertest from 'supertest';
import pool from '../db.js';
import app from '../app.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Company Route', () => {
	let request;
	let sandbox;

	before(() => {
		request = supertest(app);
		sandbox = sinon.createSandbox();
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('POST /api/company', () => {
		it('should create a new company if it does not exist', async () => {
			sandbox.stub(pool.promise(), 'query')
				.onFirstCall().resolves([[]])
				.onSecondCall().resolves([{ insertId: 1 }]);

			const res = await request.post('/api/company').send({
				name_company: 'Example Corp',
				activity: 'Software Development',
				experience: 5,
				skills: 'JavaScript, Node.js',
				login: 'testuser'
			});

			expect(res.status).to.equal(201);
			expect(res.body).to.have.property('message', 'Вакансия успешно создана');
		});

		it('should return 400 if company already exists', async () => {
			const mockData = [
				{
					id: 1,
					name_company: 'Example Corp',
					activity: 'Software Development',
					experience: 5,
					skills: 'JavaScript, Node.js',
					login: 'testuser'
				}
			];

			sandbox.stub(pool.promise(), 'query').resolves([mockData]);

			const res = await request.post('/api/company').send({
				name_company: 'Example Corp',
				activity: 'Software Development',
				experience: 5,
				skills: 'JavaScript, Node.js',
				login: 'testuser'
			});

			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error', 'Вакансия уже существует');
		});

		it('should return 500 if there is a database error', async () => {
			sandbox.stub(pool.promise(), 'query').rejects(new Error('Database error'));

			const res = await request.post('/api/company').send({
				name_company: 'Example Corp',
				activity: 'Software Development',
				experience: 5,
				skills: 'JavaScript, Node.js',
				login: 'testuser'
			});

			expect(res.status).to.equal(500);
			expect(res.body).to.have.property('error', 'Ошибка при создании вакансии');
		});
	});
});
