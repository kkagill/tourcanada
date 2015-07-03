var config = require('./config'),
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
            consumer.on('message', function (message) {
                console.log(message);
                offset++;
                saveOffset(offset);
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
        if (err || isNaN(data)) {
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