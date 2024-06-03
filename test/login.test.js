/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import supertest from 'supertest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db.js'; // Убедитесь, что путь правильный
import app from '../app.js'; // ваш основной файл приложения

chai.use(chaiHttp);
const { expect } = chai;

describe('Login Routes', () => {
	let request;
	let sandbox;

	before(() => {
		request = supertest(app);
		sandbox = sinon.createSandbox();
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('POST /login', () => {
		it('should authenticate user and return a token', async () => {
			const mockUser = { login: 'testuser', password: 'hashedpassword', roles: 'user' };
			const mockToken = 'mocktoken';

			sandbox.stub(pool.promise(), 'query').resolves([[mockUser]]);
			sandbox.stub(bcrypt, 'compare').resolves(true);
			sandbox.stub(jwt, 'sign').returns(mockToken);

			const res = await request.post('/login').send({ login: 'testuser', password: 'password' });

			expect(res.status).to.equal(200);
			expect(res.body).to.have.property('token', mockToken);
			expect(res.body).to.have.property('role', 'user');
			expect(res.body).to.have.property('login', 'testuser');
		});

		it('should return 400 if login or password is missing', async () => {
			const res = await request.post('/login').send({ login: 'testuser' });

			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error', 'Missing login or password');
		});

		it('should return 401 if user is not found', async () => {
			sandbox.stub(pool.promise(), 'query').resolves([[]]);

			const res = await request.post('/login').send({ login: 'nonexistent', password: 'password' });

			expect(res.status).to.equal(401);
			expect(res.body).to.have.property('error', 'User not found');
		});

		it('should return 401 if password is invalid', async () => {
			const mockUser = { login: 'testuser', password: 'hashedpassword', roles: 'user' };

			sandbox.stub(pool.promise(), 'query').resolves([[mockUser]]);
			sandbox.stub(bcrypt, 'compare').resolves(false);

			const res = await request.post('/login').send({ login: 'testuser', password: 'wrongpassword' });

			expect(res.status).to.equal(401);
			expect(res.body).to.have.property('error', 'Invalid password');
		});

		it('should return 500 if there is a database error', async () => {
			sandbox.stub(pool.promise(), 'query').rejects(new Error('Database error'));

			const res = await request.post('/login').send({ login: 'testuser', password: 'password' });

			expect(res.status).to.equal(500);
			expect(res.body).to.have.property('error', 'Error authenticating user');
		});
	});
});
