/*
 * Serve content over a socket
 */

module.exports = function (socket, io, gpio, updateLuz) {
//    console.log('#####io: ', this.testVar, socket.testVar);
//    console.log(b,c);
    socket.emit('send:name', {
        name: 'Bob'
    });

//    setInterval(function () {
//        socket.emit('send:time', {
//            time: (new Date()).toString()
//        });
//    }, 1000);

    socket.on('update:luz', function (data) {
//        console.log(data);
        //avisar a todos que se cambio el status
		//updateLuz(data);
        io.sockets.emit('updated:luz', data);
//        gpio.setup(data.luzId, gpio.DIR_OUT, function () {
//            gpio.write(data.luzId, true, function (err) {
//                if (err)
//                    throw err;
//                console.log('Written to pin');
//            });
//        });

    });

};
