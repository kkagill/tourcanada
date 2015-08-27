var config = {
  APP: 'KeeBooFrontend',
  REDISURL: process.env['REDISURL'] || 'redis://localhost:6379',
  MYSQL_HOST: process.env['MYSQL_HOST'] || 'nhongwest.ctibijov3ynm.us-west-2.rds.amazonaws.com',
  MYSQL_USER: process.env['MYSQL_USER'] || 'nhong',
  MYSQL_PASS: process.env['MYSQL_PASS'] || 'eh',
  LOGFILE:  process.env['SIBER_LOG'] || '/home/nhong/.siber/log',
  LOGLEVEL:  process.env['SIBER_LOG_LEVEL'] || 0, // 0: to stdout, 1: fatal, 2: error, 3: warn, 4: info, 5: debug
  PORT: 5000,
  SPORT: 5443
};
 
module.exports = config;

