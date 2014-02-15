var express = require('express');
var sendgrid = require('sendgrid');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
/*
var db = monk('mongodb://uxtools:uxtools@ds053728.mongolab.com:53728/heroku_app19991968');


var mongodb = require("mongojs").connect('mongodb://uxtools:uxtools@ds053728.mongolab.com:53728/heroku_app19991968', ['companyitem']);

*/

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(process.env.PORT || 5000);
// all environments
app.set('port', process.env.PORT || 5000);

app.use(express.favicon());
//app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
//app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index());