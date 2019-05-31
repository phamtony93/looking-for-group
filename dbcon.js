var mysql = require('mysql');
var pool = mysql.createPool({
	connectionLimit	: 10,
	host			: 'classmysql.engr.oregonstate.edu',
	user			: 'cs340_phamton',
	password		: '2263',
	database		: 'cs340_phamton'
});

module.exports.pool = pool;