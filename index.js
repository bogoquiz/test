var port = process.env.PORT || 5000;
var express  = require('express');
var app = express();
var Twitter = require('twitter');
var madrid = 0,
    barcelona = 0,
    total = 0;

app.set('port', (process.env.PORT || 5000));
//app.use(express.static(__dirname + '/public'));
/*var server = app.listen(5000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

});*/

var server = app.listen(app.get('port'), function() {

  		
  console.log("Node app is running at localhost:" + app.get('port'));
});

var io = require('socket.io').listen(server);

var client = new Twitter({
  consumer_key: 'GHUf65msg3VlzpOrNN7GChIMY',
  consumer_secret: 'PniIQEEqNfwWnjdN3KkiYi7laN6xFF2DSKvJtrc5vYxIAoeVFv',
  access_token_key: '2239995774-ttJJRyU20OPHBlSsjWA3y58Em9syYmqGNkpzGhX',
  access_token_secret: 'RSskwDX6qGfdltOzU1bAhNb8NcSc6ZLYGmR3yhAEPvzuB'
});

client.stream('statuses/filter', { track: ['madrid', 'barcelona'] }, function(stream) {
  stream.on('data', function (data) {
    if (data.text) { 
      var text = data.text.toLowerCase();
      if (text.indexOf('madrid') != -1) {
        madrid++
        total++
        if ((madrid % 75) == 0){
          io.sockets.emit('madridr', { 
            user: data.user.screen_name, 
            text: data.text,
            avatar: data.user.profile_image_url_https
          });
        }
      }
      if (text.indexOf('barcelona') != -1) {
        barcelona++
        total++
        if ((barcelona % 25) == 0){
          io.sockets.emit('barcelonar', { 
            user: data.user.screen_name, 
            text: data.text,
            avatar: data.user.profile_image_url_https
          });
        }
      }
      io.sockets.emit('percentages', { 
        madrid: (madrid/total)*100,
        barcelona: (barcelona/total)*100
      });
    }
  });
});


app.get('/', function(request, response) {
  //response.send('Hello World!');
  response.sendFile(__dirname + '/index.html');
});


