/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import supertest from 'supertest';
import pool from '../db.js';
import app from '../app.js';


chai.use(chaiHttp);
const { expect } = chai;

describe('Register Route', () => {
	let request;
	let sandbox;

	before(() => {
		request = supertest(app);
		sandbox = sinon.createSandbox();
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('POST /api/register', () => {
		it('should register a new user with correct details', async () => {
			sandbox.stub(pool.promise(), 'query')
				.onFirstCall().resolves([[]])
				.onSecondCall().resolves([{ insertId: 1 }]);

			const res = await request.post('/api/register').send({
				login: 'newuser',
				password: 'newpassword',
				roles: ['user']
			});

			expect(res.status).to.equal(201);
			expect(res.body).to.have.property('message', 'User registered successfully');
		});

		it('should return 400 if login or password or roles is missing', async () => {
			const res = await request.post('/api/register').send({ login: '' });

			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error', 'Missing required fields');
		});

		it('should return 400 if user with this login already exists', async () => {
			const mockUser = [{ id: 1, login: 'existinguser', password: 'password', roles: 'user' }];
			sandbox.stub(pool.promise(), 'query').resolves([mockUser]);

			const res = await request.post('/api/register').send({
				login: 'existinguser',
				password: 'newpassword',
				roles: ['user']
			});

			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error', 'User with this login already exists');
		});

		it('should return 500 if there is a database error', async () => {
			sandbox.stub(pool.promise(), 'query').rejects(new Error('Database error'));

			const res = await request.post('/api/register').send({
				login: 'newuser',
				password: 'newpassword',
				roles: ['user']
			});

			expect(res.status).to.equal(500);
			expect(res.body).to.have.property('error', 'Error registering user');
		});
	});
});
