require('dotenv').config();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var yelp = require('yelp-fusion');
var client;
var token = yelp.accessToken(process.env.CLIENT_ID, process.env.CLIENT_SECRET).then(function(res){
  client = yelp.client(res.jsonBody.access_token);
}).catch(function(e){
  console.log(e);
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.post('/search', function(req, res) {
  client.search({
    term: 'bar',
    location: req.body.location
  }).then(function(response){
    res.send(response.jsonBody.businesses);
  }).catch(function(e){
    res.send(e);
  });
});

app.listen(3000, function () {
  console.log('Nightlife Coordinator listening on port 3000!');
});
