
var express = require('express'),
    Log = require('kb-logger'),
    app = express(),
    fs = require('fs'),
    config = require('./config'),
    httpClient = require('http'),
    http = httpClient.createServer(app),
    httpsClient = require('https'),
    https = httpsClient.createServer({key: fs.readFileSync('server.key'),cert: fs.readFileSync('server.crt')}, app);

var log = Log.createLogger('FRONTEND');
log.setFile(config.LOG_FILE);
log.setLevel(config.LOG_LEVEL);

app.use(express.static(__dirname + '/public/app'));
app.use(require('body-parser').json());

app.get('/index', function(request, response) {
    response.send('Hi World');
});

https.listen(config.SPORT, function() {
  log.info("Node app is running at :" + config.SPORT);
});

http.listen(config.PORT, function() {
  log.info("Node app is running at :" + config.PORT);
});
