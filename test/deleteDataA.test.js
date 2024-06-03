/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import supertest from 'supertest';
import pool from '../db.js';
import app from '../app.js';

chai.use(chaiHttp);
const { expect } = chai;

// eslint-disable-next-line no-undef
describe('Delete Applicant Route', () => {
	let request;
	let sandbox;

	before(() => {
		request = supertest(app);
		sandbox = sinon.createSandbox();
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('POST /api/deleteappl', () => {
		it('should delete applicant profile if it exists', async () => {
			const mockApplicantResult = [{ id: 1 }];
			const mockDeleteResult = { affectedRows: 1 };

			sandbox.stub(pool.promise(), 'getConnection').resolves({
				query: sandbox.stub()
					.onFirstCall().resolves([mockApplicantResult])
					.onSecondCall().resolves([mockDeleteResult])
					.onThirdCall().resolves([mockDeleteResult]),
				beginTransaction: sandbox.stub().resolves(),
				commit: sandbox.stub().resolves(),
				rollback: sandbox.stub().resolves(),
				release: sandbox.stub().resolves()
			});

			const res = await request.post('/api/deleteappl').send({ login: 'testuser' });

			expect(res.status).to.equal(200);
			expect(res.body).to.have.property('message', 'Профиль успешно удален');
		});

		it('should return 404 if applicant profile is not found', async () => {
			sandbox.stub(pool.promise(), 'getConnection').resolves({
				query: sandbox.stub().onFirstCall().resolves([[]]),
				beginTransaction: sandbox.stub().resolves(),
				rollback: sandbox.stub().resolves(),
				release: sandbox.stub().resolves()
			});

			const res = await request.post('/api/deleteappl').send({ login: 'nonexistentuser' });

			expect(res.status).to.equal(404);
			expect(res.body).to.have.property('error', 'Профиль не найден или уже удален');
		});

		it('should return 500 if there is a database error', async () => {
			sandbox.stub(pool.promise(), 'getConnection').resolves({
				query: sandbox.stub().throws(new Error('Database error')),
				beginTransaction: sandbox.stub().resolves(),
				rollback: sandbox.stub().resolves(),
				release: sandbox.stub().resolves()
			});

			const res = await request.post('/api/deleteappl').send({ login: 'testuser' });

			expect(res.status).to.equal(500);
			expect(res.body).to.have.property('error', 'Ошибка при удалении профиля');
		});
	});
});
