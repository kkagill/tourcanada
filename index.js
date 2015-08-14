var mysql      = require('mysql'), config = require('./config');
var connection = mysql.createConnection({
  host     : config.MYSQL_HOST,
  user     : config.MYSQL_USER,
  password : config.MYSQL_PASS,
  ssl      : 'Amazon RDS',
  database : 'gts'
});

connection.connect();

connection.query('SELECT * from EventData', function(err, rows, fields) {
  if (err) console.log(err);
  else console.log('The solution is: ', rows[0]);
});

connection.end();