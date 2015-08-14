var config = require('./config'),
    backend = require('./backendWriter'),
    kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    client = new kafka.Client(config.ZOOKEEPER),
    Q = require('q'),
    fs = require('fs');//,
    //mysql = require('mysql');

/*
var pool = mysql.createPool({
    connectionLimit : 100, //important
    host     : config.MYSQL_HOST,
    user     : config.MYSQL_USER,
    password : config.MYSQL_PASS,
    database : 'gts',
    debug    :  false
});
*/

var senseOffset, SENSE_TOPIC = 0;
var gpsOffset, GPS_TOPIC = 1;

var options = {
    autoCommit: true,
    fromOffset: true
};

var payload = [{ topic: 'sense', partition: 0 }, {topic: 'gps', partition: 0}];

var consumer = new Consumer(client, payload, options);

consumer.on('error', function (err) {console.log('consumer error: ' + err)});

retrieveOffset()
.then(
    function(data){
        console.log('local offset: ' + JSON.stringify(data));
        senseOffset = data[SENSE_TOPIC];
        gpsOffset = data[GPS_TOPIC];
        
        consumer.setOffset('sense', 0, senseOffset);
        consumer.setOffset('gps', 0, gpsOffset);
        
        consumer.on('message', function (kafkaMsg) {
            // there is no batch message here.
            console.log('from kafka: ' + JSON.stringify(kafkaMsg));
            
            if (kafkaMsg.topic === 'gps'){
                // Client emits a gps packet, push to opengts mysql store
                gpsOffset++;
                saveOffset(GPS_TOPIC, gpsOffset);
                
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
                var speed = speed_heading[0];
                var heading = speed_heading[1];
                
                var eventData = {};
                eventData['code'] = 61472;
                eventData['lat'] = lat;
                eventData['long'] = lng;
                eventData['speed'] = speed;
                eventData['heading'] = heading;
                
                // put into database
                for (var key in eventData){
                    var val = eventData[key];
                    console.log(key);
                    backend.write(tenantId.trim(), deviceId.trim(), key.trim(), val, null/* waiting to fix time precision of gprmc from second to millisecond*/)
                    .then(
                        function(){console.log('success');}, 
                        function(err){console.log(err);}
                    );
                }
                
                /*
                pool.getConnection(function(err,connection){
                    if (err) {
                      console.log(err);
                      return;
                    }   
            
                    connection.query("insert into EventData set ?", eventData, function(err,result){
                        connection.release();
                    });
            
                    connection.on('error', function(err) {      
                        console.log(err);
                    });
                }); */
                // next ...
            } else if (kafkaMsg.topic === 'sense'){
                senseOffset++;
                saveOffset(SENSE_TOPIC, senseOffset);
                
                var siberMsg;
                try {
                    siberMsg = JSON.parse(kafkaMsg.value);
                    if (!(siberMsg.tenantId && siberMsg.deviceId && siberMsg.data.value))
                        throw 'siberMsg wrongly captured';
                } catch (e) {
                    console.log(e);
                    return;
                } 
                
                var seriesName = siberMsg.data.name;
                var seriesData = siberMsg.data.value;
                var seriesTimestamp = siberMsg.data.timestamp;
                
                // now put message into database
                backend.write(siberMsg.tenantId, siberMsg.deviceId, seriesName, seriesData, seriesTimestamp)
                .then(
                    function(){console.log('success');}, 
                    function(err){console.log(err);}
                );
            }
        });
    }, 
    function(err){
        console.log(err);
    }
);
    

function saveOffset(topic, offset){
    if (isNaN(offset))
        return;
        
    fs.readFile('offset', 'utf8', function(err, data){
        if (err) {
            console.log(err);
            return;
        }
        
        try {
            data = JSON.parse(data);
        } catch (e) {
            data = [0,0];
        }
        
        data[topic] = offset;
        fs.writeFile('offset', JSON.stringify(data), function(err) {
            if(err) {
                console.log(err);
            }
        }); 
    });  
}

function retrieveOffset(){
    var d = Q.defer();
    
    fs.readFile('offset', 'utf8', function (err,data) {
        try {
            data = JSON.parse(data);
            d.resolve(data);
        } catch (e) {
            console.log(e);
            // cannot get offset saved locally, continue with last commit message
            var offsetClient = new kafka.Offset(client);
            offsetClient.fetch([
                { topic: 'sense', partition: 0, time: -1, maxNum: 1 },
                { topic: 'gps', partition: 0, time: -1, maxNum: 1 }
            ], function (err, data) {
                // data
                // { 't': { '0': [999] } }
                if (err === null){
                    d.resolve([data['sense']['0'][0], data['gps']['0'][0]]);
                } else
                    d.reject(new Error('Error retrieving offset'));
            });
        }
    });
    
    
    
    return d.promise;
}