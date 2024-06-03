import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import registerRouter from './routes/register.js';
import loginRouter from './routes/login.js';
import applicant_data from './routes/applicant.js';
import company_data from './routes/company.js';
import applicantTake from './routes/applicantTake.js';
import companyTake from './routes/companyTake.js';
import delete_comp from './routes/deleteDataC.js';
import delete_appl from './routes/deleteDataA.js';
import companyAllData from './routes/companysData.js';
import respondVacancy from './routes/response.js';
import find_talent from './routes/findTalent.js';
import analytics from './routes/analy.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/register', registerRouter);
app.use('/api/login', loginRouter);
app.use('/api/applicant', applicant_data);
app.use('/api/company', company_data);
app.use('/api/applicantTake', applicantTake);
app.use('/api/companyTake', companyTake);
app.use('/api/deletecomp', delete_comp);
app.use('/api/deleteappl', delete_appl);
app.use('/api/allCompanysData', companyAllData);
app.use('/api/respond', respondVacancy);
app.use('/api/findCandidates', find_talent);
app.use('/api/experienceAnalytics', analytics);

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});

export default app;
