var responseHandlers= require("./responseHandlers");
var nest = require('./nest');
var storage = require('./storage');
var util = require('./util');

var intentHandlers = (function () {
    return {

        thanksIntent: function(callback) {
            responseHandlers.getThanksResponse(callback);
        },

        getCurrentTemperatureIntent: function(token, deviceId, callback) {
            console.log("getCurrentTemperatureIntent")

            var sessionAttributes = {};
            var cardTitle = "Temperature";

            if(token == null || token == undefined) {
                responseHandlers.getSetupResponse(callback)
            } else {
                var getDeviceCallback = function (device) {
                    if(device != null) {
                        console.log("got device:" + JSON.stringify(device));
                        var currentTemp = nest.targetTempFromDevice(device);
                        var speechOutput = "Your Nest is currently set to " + currentTemp + ".";
                        console.log("speech = " + speechOutput);
                        callback(sessionAttributes,
                            responseHandlers.buildSpeechletResponse(cardTitle, speechOutput, speechOutput, null, false));
                    }  else {
                        console.log('Error happened: '+ error);
                        responseHandlers.getErrorResponse(callback, error);
                    }
                };

                nest.getDevice(token, deviceId, getDeviceCallback);
            }
        },

        setTemperatureIntent: function(userId, callback, intent) {
            console.log("Explcitly setting temp.");
            if(intent.slots && intent.slots.Temperature && intent.slots.Temperature.value) {
                var temp = parseInt(intent.slots.Temperature.value);
                console.log("temp from Intent = "+temp);
                storage.getDeviceId(userId, function(deviceId) {
                    nest.setTemperatureExplicitly(userId, deviceId, temp, callback);
                });
            }
        },

        turnItDownIntent: function (userId,callback) {
            console.log("turning it down");
            storage.getDeviceId(userId, function(deviceId) {
                nest.modifyTemperatureBy(userId, deviceId, -2, callback);
            });
        },

        turnItUpIntent: function (userId,callback) {
            console.log("turning it up");
            storage.getDeviceId(userId,function(deviceId) {
                nest.modifyTemperatureBy(userId, deviceId, 2, callback);
            });
        },

        refreshDeviceIntent: function(userId, callback) {
            console.log("refreshing device");
            storage.getToken(userId,function (token) {
                console.log('get token from dynamodb=' + token);
                nest.getDevices(token, function(devices) {
                    console.log("got some devices." + JSON.stringify(devices.thermostats));
                    var deviceId = nest.firstDeviceIdFromDevices(devices);
                    console.log("first device id = " + deviceId);
                    storage.saveDeviceId(deviceId,userId,callback);
                });
            });
        },

        resetIntent: function(userId, callback) {
            storage.deleteDeviceIdForUserId(userId, function() {
               storage.deleteTokenForUserId(userId, function() {
                   var speechOutput = "MyNest has been reset.";
                   callback({},responseHandlers.buildSpeechletResponse(speechOutput, speechOutput, speechOutput, null, false));
               })
            });
        },

        enterPinIntent: function (callback, intent, userId) {

            console.log(intent);
            console.log(intent.slots);
            var pin = util.pinFromIntent(intent);

            if(pin != null) {
                nest.getAccessToken(pin, function(token) {
                    if(token != null) {
                        storage.saveToken(token, userId, function (success) {
                            if (success) {
                                console.log("save token worked.  now refreshing devices. token=" + token);
                                nest.getDevices(token, function (devices) {
                                    console.log("got some devices." + JSON.stringify(devices.thermostats));
                                    var deviceId = nest.firstDeviceIdFromDevices(devices);
                                    console.log("first device id = " + deviceId);
                                    storage.saveDeviceId(deviceId, userId, function (success) {
                                        if (success) {
                                            var speechOutput = "MyNest is now setup.";
                                            callback({}, responseHandlers.buildSpeechletResponse(speechOutput, speechOutput, speechOutput, null, false));
                                        }
                                    });
                                });
                            }
                        });
                    } else {
                        var speechOutput = "I'm sorry.  I could not authorize you with that pin."
                        callback({}, responseHandlers.buildSpeechletResponse(speechOutput,speechOutput,speechOutput,null,true));
                    }
                });
            } else {
                var speechOutput = "I'm sorry.  I could not understand your pin.";
                callback({},responseHandlers.buildSpeechletResponse(speechOutput,speechOutput,speechOutput,null,true))
            }
        }
    };
})();
module.exports = intentHandlers;