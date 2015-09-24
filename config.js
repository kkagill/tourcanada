var config = function() {
  switch(process.env.NODE_ENV){
    case 'dev':
      return {
			  APP: 'KeeBooFrontend',
			  REDIS: '127.0.0.1',
			  MYSQL_HOST: 'nhongwest.ctibijov3ynm.us-west-2.rds.amazonaws.com',
			  MYSQL_USER: 'nhong',
			  MYSQL_PASS: 'eh',
			  LOGFILE:  '/Users/namtrang/.keeboo/log',
			  LOGLEVEL: 0, // 0: to stdout, 1: fatal, 2: error, 3: warn, 4: info, 5: debug
			  PORT: 7000,
			  SPORT: 7443
			};

		case 'stage':
      return {
			  APP: 'KeeBooFrontend',
			  REDIS: '127.0.0.1',
			  MYSQL_HOST: 'nhongwest.ctibijov3ynm.us-west-2.rds.amazonaws.com',
			  MYSQL_USER: 'nhong',
			  MYSQL_PASS: 'eh',
			  LOGFILE:  '/Users/namtrang/.keeboo/log',
			  LOGLEVEL: 0, // 0: to stdout, 1: fatal, 2: error, 3: warn, 4: info, 5: debug
			  PORT: 80,
			  SPORT: 443
			};

    case 'prod':
      return {
			  APP: 'KeeBooFrontend',
			  REDIS: '127.0.0.1',
			  MYSQL_HOST: 'nhongwest.ctibijov3ynm.us-west-2.rds.amazonaws.com',
			  MYSQL_USER: 'nhong',
			  MYSQL_PASS: 'eh',
			  LOGFILE:  '/Users/namtrang/.keeboo/log',
			  LOGLEVEL: 0, // 0: to stdout, 1: fatal, 2: error, 3: warn, 4: info, 5: debug
			  PORT: 80,
			  SPORT: 443
			};

    default:
      throw 'Config error';
  }
};
module.exports = new config();

