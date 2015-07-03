var config = require('./config'),
    kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    client = new kafka.Client(config.ZOOKEEPER),
    Q = require('q'),
    fs = require('fs');

var options = {
    autoCommit: true,
    fromOffset: true
};
var payload = [{ topic: 'sense', offset: '3', partition: 0 }];

var consumer = new Consumer(client, payload, options);
var consumerReady = false;

consumer.on('error', function (err) {console.log('consumer error: ' + err)});

consumer.on('ready', function (){
   console.log('consumer ready!');
});

consumer.on('message', function (message) {
    console.log(message);
});

function saveOffset(offset){
    fs.writeFile("offsetTracker.kafka", offset, function(err) {
        if(err) {
            console.log(err);
        }
    }); 
}

function retrieveOffset(){
    var d = Q>defer();
    
    fs.readFile('offsetTracker.kafka', 'utf8', function (err,data) {
        if (err) {
            console.log(err);
            d.reject(new Error('Error retrieving offset'));
        } else if (isNaN(data)) {
            d.reject(new Error('Error reading offset'));
        } else 
            d.resolve(data);
    });
    
    return d;
}