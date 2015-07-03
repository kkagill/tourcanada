var express = require('express'),
    fs = require('fs'),
    app = express(),
    redis = require('redis').createClient();
    https = require('https').createServer({key: fs.readFileSync('key.pem'),cert: fs.readFileSync('cert.pem')}, app),
    http = require('http').createServer(app),
    io = require('socket.io')(https),
    config = require('./config'),
    datastream = require('./kafkaProducer');

app.use(express.static(__dirname + '/public'));

app.get('/index', function(request, response) {
    response.send('Hi World');
});

https.listen(config.SPORT, function() {
  console.log("Node app is running at :" + config.SPORT);
});

http.listen(config.PORT, function() {
  console.log("Node app is running at :" + config.PORT);
});


redis.on("error", function (err) {
        console.log("Error " + err);
});
    
io.on('connection', function(socket){
  console.log('a thing connected ');

  socket.on('sense', function(data, token, ack){
      // fetch thing info from redis database
      redis.get(token, function(err, reply){
        if (err !== null)
            ack('redis error!')
        else if (reply === null){
            // fetch thing info from backend
            var thing = fetchThingInfo(token);
            if (thing.tenantId && thing.deviceId){
                redis.set(token, thing.tenantId+':'+thing.deviceId);
                // push data to kafka
                datastream.push(thing.tenantId, thing.deviceId, data)
                .then(function(result){
                    ack('ok ' + result);
                }, function(err){
                    ack(err);
                });
            } else {
                ack('auth failed, thing does not exist');
            }
        } else {
            var thingInfo = reply.split(':');
            var tenantId = thingInfo[0];
            var deviceId = thingInfo[1];
            if (tenantId && deviceId){
                // push data to kafka
                datastream.push(tenantId, deviceId, data)
                .then(function(result){
                    ack('ok ' + result);
                }, function(err){
                    ack(err);
                });
                
            } else
                ack('unknown error happens');
        }
      });
  });
  
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  
});


function fetchThingInfo(token){
    // fetch thing info from database, including tenant id and device id
    var thing = {tenantId: 'tenant_id', deviceId: 'device_id'};
    return thing;
}

var nsp = io.of('/nhong');
nsp.on('connection', function(socket){
  console.log('someone connected');
  nsp.on('sense', function(msg){
      console.log(msg);
  });
  nsp.emit('hi', 'everyone!');
});

