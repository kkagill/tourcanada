var config = {
  REDISURL: process.env['REDISURL'] || 'redis://localhost:6379',
  ZOOKEEPER: process.env['ZOOKEEPER'] || '172.31.22.40:2181',
  PORT: 5000,
  SPORT: 443
};
 
module.exports = config;
