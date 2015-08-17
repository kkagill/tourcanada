var config = require('./config'),
    kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    client = new kafka.Client(config.ZOOKEEPER),
    redis = require('redis').createClient(),
    log = require('./log'),
    httpsClient = require('https'),
    Q = require('q'),
    fs = require('fs');//,

var gpsOffset;
var placeQueryWindow = false;

setTimeout(function() {placeQueryWindow = placeQueryWindow ? false : true}, 5000);

var post_options = {
    host: 'android.googleapis.com',
    path: '/gcm/send',
    method: 'POST',
    headers: {
      'Authorization': 'key=AIzaSyAOZSIS-XmvHdLpCJ94DWQ8skWOth7_uH4',
      'Content-Type': 'application/json'
    }
};

var post_req = httpsClient.request(post_options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        log.info('Response: ' + chunk);
    });
});

post_req.on('error', function(e){
    log.info(e);
});
                
var options = {
    autoCommit: true,
    fromOffset: true
};

var payload = [{topic: 'gps', partition: 0}];

var consumer = new Consumer(client, payload, options);

consumer.on('error', function (err) {console.log('consumer error: ' + err)});

retrieveOffset().then(
function(data){
    console.log('local offset: ' + JSON.stringify(data));
    gpsOffset = data;
    
    consumer.setOffset('gps', 0, gpsOffset);
    
    consumer.on('message', function (kafkaMsg) {
        // there is no batch message here.
        log.info('from kafka: ' + JSON.stringify(kafkaMsg));
        
        gpsOffset++;
        saveOffset(gpsOffset);
        
        var gpsPacket = kafkaMsg.value;
        var gpsDetails = gpsPacket.split(', ');
        var account_device = gpsDetails[1].split('|');
        var lat_long = gpsDetails[3].split('|');
        
        var accountID = account_device[0].trim();
        var deviceID = account_device[1].trim();
        var lat = lat_long[0].trim();
        var lng = lat_long[1].trim();
        
        var googlePlaceAPI = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+lat+','+lng+'&radius=500&types=food&key=AIzaSyAOZSIS-XmvHdLpCJ94DWQ8skWOth7_uH4';
        log.info('Getting Google Places: ' + googlePlaceAPI);
        if (placeQueryWindow)
            httpsClient.get(googlePlaceAPI, function(res) {
                var body = '';
                res.on('data', function(chunk) {
                    body += chunk;
                });
                res.on('end', function() {
                    body = JSON.parse(body);
                    redis.get(accountID + ':' + deviceID + '.gcmtoken', function(err, gcmtoken){
                        if (!err){
                            var sendingMessage = JSON.stringify({'data':body.results, 'to': gcmtoken});
                            log.info(sendingMessage);
                            post_req.write(sendingMessage);
                            post_req.end();
                        } else
                            log.error(err);
                    });
                });
                
            }).on('error', function(e) {
                log.error("Places query failed- " + e);
            });
    });
}, 
function(err){
    console.log(err);
});
    

function saveOffset(offset){
    if (isNaN(offset))
        return;
        
    fs.writeFile('offset', offset, function(err) {
        if(err) {
            console.log(err);
        }
    }); 
}

function retrieveOffset(){
    var d = Q.defer();
    
    fs.readFile('offset', 'utf8', function (err,data) {
        try {
            if (data === '' || isNaN(data) || err)
                throw 'offset read failed';
            else
                d.resolve(data);
        } catch (e) {
            log.error(e);
            // cannot get offset saved locally, continue with last commit message
            var offsetClient = new kafka.Offset(client);
            offsetClient.fetch([
                { topic: 'gps', partition: 0, time: -1, maxNum: 1 }
            ], function (err, data) {
                // data
                // { 't': { '0': [999] } }
                if (err){
                    d.reject('Error retrieving offset');
                } else
                    d.resolve(data['gps']['0'][0]);
            });
        }
    });
    
    return d.promise;
}