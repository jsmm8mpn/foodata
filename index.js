var express = require('express');
var app = express();
var pg = require('pg');
var path = require('path');
var connectionString = 'postgres://postgres:admin@localhost:5432/nutrition';

app.use("/public", express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.send('Hello World 2!');
});

app.get('/search', function(req, res) {
  var text = req.query.text;
  var group = req.query.group;
  
  var results = [];
  pg.connect(connectionString, function(err, client, done) {
    
    var qString = "SELECT * FROM food WHERE desclong like '%" + text + "%'";
    if (group) {
      qString += " AND groupid = '" + group + "'";
    }
    qString += ";";
    
    var query = client.query(qString);

    query.on('row', function(row) {
        results.push(row);
    });

    query.on('end', function() {
        client.end();
        return res.json(results);
    });

  });
});

app.get('/sizes', function(req, res) {
  var id = req.query.id;
  var results = [];
  pg.connect(connectionString, function(err, client, done) {
    var qString = "select seq, amount, name, weight from weight where foodid = '" + id + "';";
    var query = client.query(qString);
    query.on('row', function(row) {
      results.push(row);
    });
    query.on('end', function() {
      client.end();
      return res.json(results);
    });
  });
});

app.get('/nutrients', function(req, res) {
  var id = req.query.id;
  var results = {};
  pg.connect(connectionString, function(err, client, done) {
    var qString = "select d.nutid, d.name, n.nutval, d.units, n.addnut, n.confidence from nutrient n join nutrientdef d on n.nutid = d.nutid where foodid = '" + id + "';";
    var query = client.query(qString);
    query.on('row', function(row) {
      results[row.nutid] = row;
    });
    query.on('end', function() {
      client.end();
      return res.json(results);
    });
  });
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});