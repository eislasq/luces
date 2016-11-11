
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
//var gpio = require('rpi-gpio');

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

var pin={on:0, off:0};

//gpio.on('change', function (channel, value) {
//    require('./routes/gpioEvents')(channel, value, io);
//});
//gpio.setup('17', gpio.DIR_IN, gpio.EDGE_BOTH);

var luces = require('./routes/luces');
//for (var luzName in luces) {
//        var luz = luces[luzName];
//		for(status in pin){
//			gpio.setup(luz[status], gpio.DIR_OUT, gpio.EDGE_BOTH,  function(pin){
//				return function(err){
//					if(err){
//							console.error('Setup', pin, err);
//					}
//					gpio.read(pin, function(err, active){
//						if(err){
//							console.error(err, pin);
//						}else{
//							console.log('Read', pin, active);
//						}
//					});
//				}
//			}(luz[status]));
//		}
//		
//    }


var sys=require('sys');
var exec=require('child_process').exec;

var updateLuz=function(data){
	if(luces.hasOwnProperty(data.luzName)){
		var luz=luces[data.luzName];
		switch(data.status){
			case 'on':
				pin.on=1;
				pin.off=0;
			break;
			case 'off':
				pin.on=0;
				pin.off=1;
			break;
			case 'manual':
			default:
				pin.on=0;
				pin.off=0;
		}
		for(status in pin){
//			gpio.write(luz[status], !!pin[status], function(luz, pin, status){
//				return function(err){
//					if(err){
//						console.error('Write', luz[status], pin[status], err);
//					}else{
//						console.log('Writed', luz[status], pin[status]);
//					}
//				};
//			}(luz, pin, status));
			console.log('Writed', luz[status], pin[status]);
			var child=exec('gpio -g mode '+luz[status]+' out');
			var child=exec('gpio -g write '+luz[status]+' '+pin[status]);
		}
	}
};


// Socket.io Communication
io.sockets.on('connection', function (socket) {
    require('./routes/socket')(socket, io, updateLuz);
    for (var luzName in luces) {
        var luz = luces[luzName];
        socket.emit('updated:luz', {luzName: luzName, status: luz.status});
    }
});

/**
 * Start Server
 */

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
