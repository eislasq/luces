
/**
 * Module dependencies
 */

var express = require('express'),
        routes = require('./routes'),
        api = require('./routes/api'),
        http = require('http'),
        path = require('path');

var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var gpio = require('rpi-gpio');

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if (app.get('env') === 'development') {
    app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
    // TODO
}


/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
app.get('/api/name', api.name);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

gpio.on('change', function (channel, value) {
    require('./routes/gpioEvents')(channel, value, io);
});
//gpio.setup('17', gpio.DIR_IN, gpio.EDGE_BOTH);

// Socket.io Communication
//io.sockets.on('connection', require('./routes/socket'));

// Socket.io Communication
io.sockets.on('connection', function (socket) {
    require('./routes/socket')(socket, io, gpio);
});

/**
 * Start Server
 */

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
