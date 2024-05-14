// eslint-disable-next-line no-undef, @typescript-eslint/no-var-requires
const express = require('express');
// eslint-disable-next-line no-undef, @typescript-eslint/no-var-requires
const bodyParser = require('body-parser');
// eslint-disable-next-line no-undef, @typescript-eslint/no-var-requires
const cors = require('cors');
// eslint-disable-next-line no-undef, @typescript-eslint/no-var-requires
const registerRouter = require('./routes/register');
// eslint-disable-next-line no-undef, @typescript-eslint/no-var-requires
const loginRouter = require('./routes/login');

const applicant_data = require('./routes/applicant');

const company_data = require('./routes/company');

const applicantTake = require('./routes/applicantTake');

const companyTake = require('./routes/companyTake');

const delete_comp = require('./routes/deleteDataC');

const delete_appl = require('./routes/deleteDataA');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Роутер для регистрации пользователей
app.use('/api/register', registerRouter);

// Роутер для аутентификации пользователей
app.use('/api/login', loginRouter);

app.use('/api/applicant', applicant_data);

app.use('/api/company', company_data);
app.use('/api/applicantTake', applicantTake);
app.use('/api/companyTake', companyTake);

app.use('/api/deletecomp', delete_comp);

app.use('/api/deleteappl', delete_appl);


app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
