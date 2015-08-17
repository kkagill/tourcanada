var config = require('./config'),
    kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    client = new kafka.Client(config.ZOOKEEPER),
    Q = require('q'),
    fs = require('fs');//,

var gpsOffset;

var options = {
    autoCommit: true,
    fromOffset: true
};

var payload = [{topic: 'gps', partition: 0}];

var consumer = new Consumer(client, payload, options);

consumer.on('error', function (err) {console.log('consumer error: ' + err)});

retrieveOffset()
.then(
    function(data){
        console.log('local offset: ' + JSON.stringify(data));
        gpsOffset = data;
        
        consumer.setOffset('gps', 0, gpsOffset);
        
        consumer.on('message', function (kafkaMsg) {
            // there is no batch message here.
            console.log('from kafka: ' + JSON.stringify(kafkaMsg));
            
            if (kafkaMsg.topic === 'gps'){
                // Client emits a gps packet, push to opengts mysql store
                gpsOffset++;
                saveOffset(gpsOffset);
                
                var gpsPacket = kafkaMsg.value;
                var gpsDetails = gpsPacket.split(', ');
                var date_t_tmz_tstamp = gpsDetails[0].split('|');
                var account_device = gpsDetails[1].split('|');
                var scode_desc = gpsDetails[2].split('|');
                var lat_long = gpsDetails[3].split('|');
                var speed_heading = gpsDetails[4].split('|');
                
                var tenantId = account_device[0];
                var deviceId = account_device[1];
                var date = date_t_tmz_tstamp[0];
                var time = date_t_tmz_tstamp[1];
                var tmz = date_t_tmz_tstamp[2];
                var tstamp = date_t_tmz_tstamp[3];
                var scode = scode_desc[0];
                var desc = scode_desc[1];
                var lat = lat_long[0];
                var lng = lat_long[1];
                var speed = speed_heading[0].split('.')[0];// remove after decimal point
                var heading = speed_heading[1];
                
                var eventData = {};
                eventData['code'] = 61472;
                eventData['lat'] = lat;
                eventData['long'] = lng;
                eventData['speed'] = speed;
                eventData['heading'] = heading;

            }
        });
    }, 
    function(err){
        console.log(err);
    }
);
    

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
            d.resolve(data);
        } catch (e) {
            console.log(e);
            // cannot get offset saved locally, continue with last commit message
            var offsetClient = new kafka.Offset(client);
            offsetClient.fetch([
                { topic: 'gps', partition: 0, time: -1, maxNum: 1 }
            ], function (err, data) {
                // data
                // { 't': { '0': [999] } }
                if (err === null){
                    d.resolve(data['gps']['0'][0]);
                } else
                    d.reject('Error retrieving offset');
            });
        }
    });
    
    return d.promise;
}