'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
        controller('AppCtrl', function ($scope, socket) {
            socket.on('send:name', function (data) {
                $scope.name = data.name;
            });
        }).
        controller('MyCtrl1', function ($scope, socket) {

            $scope.luces = {};

            socket.on('updated:luz', function (data) {
                console.log('updated', data);
                $scope.luces[data.luzName] = data.status;
            });

            $scope.updateLuz = function (luzName, status) {
//                console.log('emit', luzName, status);
                socket.emit('update:luz', {
                    luzName: luzName,
                    status: status
                });
            };
        }).
        controller('MyCtrl2', function ($scope) {
            // write Ctrl here
        });
