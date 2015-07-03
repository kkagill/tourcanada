var fs = require('fs');

var consumerOffset = {
    save: function(offset){
        fs.writeFile("offsetTracker.kafka", offset + '\n', function(err) {
            if(err) {
                console.log(err);
            }
        }); 
    }
};

fs.writeFile("offsetTracker.kafka", "Hey !", function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 

fs.readFile('offsetTracker.kafka', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  console.log(data);
});

module.exports = consumerOffset;