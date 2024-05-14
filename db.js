// eslint-disable-next-line no-undef, @typescript-eslint/no-var-requires
const mysql = require('mysql2');

const pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	database: 'Full-stack',
	password: 'Protectiv636',
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
});

// eslint-disable-next-line no-undef
module.exports = pool;
