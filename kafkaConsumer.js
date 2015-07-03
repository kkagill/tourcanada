var config = require('./config'),
    kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    client = new kafka.Client(config.ZOOKEEPER),
    Q = require('q');


var consumer = new Consumer(client, [{ topic: 'sense', partition: 0 }], {autoCommit: false});
var consumerReady = false;

consumer.on('error', function (err) {console.log('consumer error: ' + err)});

consumer.on('message', function (message) {
    console.log(message);
});