var config = require('./config'),
    backend = require('./backendWriter'),
    kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    client = new kafka.Client(config.ZOOKEEPER),
    Q = require('q'),
    fs = require('fs');

var offset;

var options = {
    autoCommit: true,
    fromOffset: true
};

var payload = [{ topic: 'sense', partition: 0 }];

var consumer = new Consumer(client, payload, options);

consumer.on('error', function (err) {console.log('consumer error: ' + err)});

retrieveOffset()
.then(
    function(data){
        console.log('current offset: ' + data);
        offset = data;
        consumer.setOffset('sense', 0, offset);
        consumer.on('message', function (kafkaMsg) {
            // there is no batch message here.
            offset++;
            saveOffset(offset);
            console.log('from kafka: ' + JSON.stringify(kafkaMsg));
            
            var siberMsg = kafkaMsg.value;
            
            if (!(siberMsg.tenantId && siberMsg.deviceId && siberMsg.data.value)){
                console.log('siberMsg wrongly captured');
                siberMsg.forEach(function(each){
                    console.log(JSON.stringify(each));
                });
                return;
            }
                
            var seriesName = siberMsg.data.name;
            var seriesData = siberMsg.data.value;
            
            // now put message into database
            backend.write(siberMsg.tenantId, siberMsg.deviceId, seriesName, seriesData)
            .then(
                function(){console.log('success');}, 
                function(err){console.log(err);}
            );
        });
    }, 
    function(err){
        console.log(err);
    }
);
    

function saveOffset(offset){
    if (isNaN(offset))
        return;
        
    fs.writeFile("offsetTracker.kafka", offset, function(err) {
        if(err) {
            console.log(err);
        }
    }); 
}

function retrieveOffset(){
    var d = Q.defer();
    
    fs.readFile('offsetTracker.kafka', 'utf8', function (err,data) {
        if (err || isNaN(data) || (data === '')) {
            console.log(err || data);
            
            // cannot get offset saved locally, continue with last commit message
            var offsetClient = new kafka.Offset(client);
            offsetClient.fetch([
                { topic: 'sense', partition: 0, time: -1, maxNum: 1 }
            ], function (err, data) {
                // data
                // { 't': { '0': [999] } }
                if (err === null){
                    console.log(data);
                    d.resolve(data['sense']['0'][0]);
                } else
                    d.reject(new Error('Error retrieving offset'));
            });
        } else 
            d.resolve(data);
    });
    
    
    
    return d.promise;
}