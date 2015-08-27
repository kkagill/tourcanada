var httpClient = require('http'),
    httpsClient = require('https'),
    log = require('./log'),
    Q = require('q');

function ParseOption () {
    this.host = 'api.parse.com',
    this.port = 443,
    this.path = '/1',
    this.method = 'GET',
    this.headers = {
        'X-Parse-Application-Id': 'BsEmOPNi1onRk8caO98utAjvrZgvIl7st6Ftn32A',
        'X-Parse-REST-API-Key': '5lTr02LaI7vVpT21o130cfMcOAMmDKB6n5Q3aHPZ',
        'X-Parse-Session-Token': ''
    }
}

var parseRest = {
    validate: function(token){
        var d = Q.defer();
        
        var meOption = new ParseOption();
        meOption.path = '/1/users/me';
        meOption.headers['X-Parse-Session-Token'] = token;
        
        log.info('querying Parse');
        httpsClient.request(meOption, function(res){  
          var resBody = "";
          res.on('data', function (chunk) {
            resBody += chunk;
          });
          res.on('end', function(chunk){
            if (resBody.indexOf('code') !== -1)
              d.reject(resBody);
            else
              d.resolve(resBody)
          })
        }).on('error', function(e) {
          log.error(e);
          d.reject(e);
        }).end();
        return d.promise;
    }
}
module.exports = parseRest;