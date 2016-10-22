var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var MONGO = 'mongodb://baguser:welcome@ds035643.mlab.com:35643/heroku_cvfr59h3';
var str2json = require('string-to-json');
var ActiveMQ = '127.0.0.1';
var ActiveMQ_port = 61613;
var Stomp = require('stomp-client');
var destination = '/queue/fltInfo';
var client = new Stomp(ActiveMQ, ActiveMQ_port, 'user', 'pass');

////app.set('views', __dirname);
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

var db

MongoClient.connect ( MONGO, (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
});

app.get('/flights', function(req, res) {
  db.collection('flights').find().toArray(function(err, results) {
  if (err) return console.log(err)
  console.log('result:'+results)
	res.status(200).json(results);
   //res.render('index.html', {quotes: results});
  // send HTML file populated with quotes here
	});
  

});

app.post('/flights', (req, res) => {
  db.collection('flights').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  });
});

app.get("/flights/:flightNumber", function(req, res) {
  console.log("inside get flight"+req.params.flightNumber);
  db.collection('flights').findOne({ flightNumber: req.params.flightNumber }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get contact");
    } else {
      res.status(200).json(doc);  
    }
  });
});

client.connect(function(sessionId) {
    var sub = client.subscribe(destination, function(body, headers) {
      console.log('This is the body of a message on the subscribed queue:', body);
      var jsonbody = JSON.parse(body);
      console.log(jsonbody);
      db.collection('flights').insertOne(jsonbody, (err, result) => {
    if (err) return console.log(err)

   	 	console.log('saved to database');
    	///res.redirect('/');
    });
   });
 });