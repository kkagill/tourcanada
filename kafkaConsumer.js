var config = require('./config'),
    kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    client = new kafka.Client(config.ZOOKEEPER),
    Q = require('q');

var options = {
    autoCommit: true,
    fromOffset: true
};
var payload = [{ topic: 'sense', offset: '3', partition: 0 }];

var consumer = new Consumer(client, payload, options);
var consumerReady = false;

consumer.on('error', function (err) {console.log('consumer error: ' + err)});

consumer.on('message', function (message) {
    console.log(message);
});