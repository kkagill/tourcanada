var fs = require('fs'),
    config = require('./config');

var DEBUG = 5,
    INFO = 4,
    WARN = 3,
    ERROR = 2,
    FATAL = 1;

var logFile = config.LOGFILE;
var level = config.LOGLEVEL;

var log = {
    info: function(msg){
        if (level < INFO)
            console.log('INFO: ' + msg);
        else    
        fs.appendFile(logFile, 'INFO: ' + msg + '\n');
    },
    debug: function(msg){
        if (level < DEBUG)
            console.log('DEBUG: ' + msg);
        else    
        fs.appendFile(logFile, 'DEBUG: ' + msg + '\n');
    },
    error: function(err){
        if (level < ERROR)
            console.log('ERROR: ' + err);
        else    
        fs.appendFile(logFile, 'ERROR: ' + err + '\n');
    }
}

module.exports = log;