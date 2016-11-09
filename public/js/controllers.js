'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
        controller('AppCtrl', function ($scope, socket) {
            socket.on('send:name', function (data) {
                $scope.name = data.name;
            });
        }).
        controller('MyCtrl1', function ($scope, socket) {

//            socket.on('send:time', function (data) {
//                $scope.time = data.time;
//            });

            socket.on('updated:luz', function (data) {
//                console.log('updated', data);
                $scope.status = data.status;
            });

            $scope.updateLuz = function (luzId, status) {
//                console.log('emit', luzId, status);
                socket.emit('update:luz', {
                    luzId: luzId,
                    status: status
                });
            };
        }).
        controller('MyCtrl2', function ($scope) {
            // write Ctrl here
        });
