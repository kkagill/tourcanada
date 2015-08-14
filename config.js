var config = {
  REDISURL: process.env['REDISURL'] || 'redis://localhost:6379',
  ZOOKEEPER: process.env['ZOOKEEPER'] || '52.10.248.246:2181',
  INFLUXDB: process.env['INFLUXDB'] || 'localhost',
  INFLUXDB_PORT: process.env['INFLUXDB_PORT'] || 8086,
  MYSQL_HOST: process.env['MYSQL_HOST'] || 'nhongwest.ctibijov3ynm.us-west-2.rds.amazonaws.com',
  MYSQL_USER: process.env['MYSQL_USER'] || 'nhong',
  MYSQL_PASS: process.env['MYSQL_PASS'] || 'eh',
  PORT: 80,
  SPORT: 443
};
 
module.exports = config;

