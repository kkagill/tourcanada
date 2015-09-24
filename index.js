if (!process.env.NODE_ENV || 
      (
        process.env.NODE_ENV !== 'dev' && 
        process.env.NODE_ENV !== 'stage' && 
        process.env.NODE_ENV !== 'prod'
      )
    ){
  console.log('Set NODE_ENV=<dev|stage|prod> first');
  return;
}

var express = require('express'),
    Log = require('kb-logger'),
    app = express(),
    fs = require('fs'),
    config = require('./config'),
    redis = require('redis').createClient(6379, config.REDIS, {}),
    httpClient = require('http'),
    http = httpClient.createServer(app),
    httpsClient = require('https'),
    https = httpsClient.createServer({key: fs.readFileSync('key.pem'),cert: fs.readFileSync('cert.pem'), ca:[fs.readFileSync('a.crt'), fs.readFileSync('b.crt')]}, app),
    mysql = require('mysql'),
    passport = require('passport'),
    TokenStrategy = require('passport-http-bearer').Strategy,
    trips = require('./trips'),
    friends = require('./friends'),
    useraccount = require('./useraccount'),
    userdriving = require('./userdriving'),
    parseRest = require('./parse-rest');

var log = Log.createLogger('FRONTEND');
log.setFile(config.LOG_FILE);
log.setLevel(config.LOG_LEVEL);

app.use(express.static(__dirname + '/public/app'));
app.use(require('body-parser').json());
app.use(passport.initialize());
app.use(passport.session());

var pool = mysql.createPool({
  connectionLimit : 100, //important
  host     : config.MYSQL_HOST,
  user     : config.MYSQL_USER,
  password : config.MYSQL_PASS,
  database : config.MYSQL_DB,
  debug    :  false
});

passport.use(new TokenStrategy(
  function(token, cb) {
      redis.get(token, function(err, user){
        log.info('getting session from redis');
          if (err) { log.error(err); return cb(err); }
          if (!user) {
              log.info('session not found');
              parseRest.validate(token)
              .then(function(user){
                  log.info(user);
                  redis.set(token, user, redis.print);
                  redis.expire(token, 30);
                  return cb(null, user);
              }, function(err){
                  log.error(err);
                  return cb(null, false); 
              });
          } else {
              return cb(null, user);
          }
      });
  })
);

// passport.serializeUser(function(user, cb) {
//   cb(null, {id: user.objectId, name: user.username});
// });

// passport.deserializeUser(function(id, cb) {
//   redis.get(token, function(err, user){
//     if (err) { return cb(err); }
//     cb(null, user);
//   });
// });

// APIs
app.use('/trips', passport.authenticate('bearer', { session: false }), trips);
app.use('/friends', passport.authenticate('bearer', { session: false }), friends);
app.use('/useraccount', passport.authenticate('bearer', { session: false }), useraccount);
app.use('/userdriving', passport.authenticate('bearer', { session: false }), userdriving);

app.get('/index', function(request, response) {
    response.send('Hi World');
});

redis.on("error", function (err) {
    //log.info("Error " + err);
});

https.listen(config.SPORT, function() {
  log.info("Node app is running at :" + config.SPORT);
});

http.listen(config.PORT, function() {
  log.info("Node app is running at :" + config.PORT);
});