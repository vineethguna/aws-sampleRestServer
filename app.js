
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var authentication = require('./routes/authentication');
var complaints = require('./routes/complaints');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.cookieSession({secret: 'vineeth'}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//All rest calls are defined below
app.get('/', routes.index);
app.get('/users', user.list);
app.post('/api/authenticate', authentication.authenticate);
app.post('/api/createManager', authentication.createManager);
app.post('/api/createFieldStaff', authentication.createFieldStaffUser);
app.get('/api/logout', authentication.logout);
app.post('/api/createComplaint', complaints.createComplaint);
app.get('/api/allComplaints', complaints.getAllComplaints);
app.post('/api/getComplaintbyid', complaints.getComplaintByComplaintId);
app.post('/api/getComplaintbyfieldstaff', complaints.getComplaintsByFieldStaffID);
app.post('/api/deleteComplaint', complaints.deleteComplaint);
app.post('/api/updateComplaint', complaints.updateComplaintDetails);


//Starting the rest server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
