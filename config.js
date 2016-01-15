var config = function() {
  if(process.env.NODE_ENV) {
      return {
			  APP: 'Tour Canada',
			  LOG_FILE:  '/home/kkagill/tourcanada/tourcanada/log',
			  LOG_LEVEL: 0, // 0: to stdout, 1: fatal, 2: error, 3: warn, 4: info, 5: debug
			  PORT: 7000,
			  SPORT: 7443
			};
    } else {
        throw 'Config error';
    }
};

module.exports = new config();
