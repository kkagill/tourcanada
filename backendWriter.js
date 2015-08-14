var influx = require('influx'),
    Q = require('q'),
    config = require('./config');

var client = influx({
  // or single-host configuration
  host : config.INFLUXDB,
  port : config.INFLUXDB_PORT, // optional, default 8086
  protocol : 'http', // optional, default 'http'
  //username : 'dbuser',
  //password : 'f4ncyp4ass',
  //failoverTimeout : 5,
  database : 'siber'
})

var backend = {
    writeArray: function(tenantId, deviceId, seriesName, dataArray){
        var d = Q.defer();
        var tag = {tenantId: tenantId, deviceId: deviceId};
        var points = [];
        
        dataArray.forEach(function(values){
            // seriesName: temperature; values: {value: 20}
            // seriesName: gyro; values: {x:22, y:33, z:44}
            var point = [values,tag];
            points.push(point);
        });
        
        client.writePoints(seriesName, points, function(err, writeResult){
            if (err) {
                d.reject(new Error('Influx write error'));
            } else 
                d.resolve(writeResult);
        });
        
        return d.promise;
    },
    write: function(tenantId, deviceId, seriesName, data, timestamp){
        var d = Q.defer();
        var tag = {tenantId: tenantId, deviceId: deviceId};
        
        client.writePoint(seriesName, {time:timestamp, value: data}, tag, {precision : 'ms'}, function(err, writeResult){
            if (err) {
                d.reject(new Error('Influx write error'));
            } else 
                d.resolve(writeResult);
        });
        
        return d.promise;
    }
}

module.exports = backend;