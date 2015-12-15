var request = require('request');
var storage = require('./storage');
var responseHandlers = require('./responseHandlers');

//nest vars - ENTER YOUR NEST API CREDENTIALS HERE.  YOU WILL NEED TO REGISTER AS A NEST DEVELOPER.
var client_id = "CLIENT-ID";
var client_secret = "CLIENT-SECRET";

var nest = (function () {
    return {

        getAccessToken: function(pin, callback) {

            var url = 'https://api.home.nest.com/oauth2/access_token?client_secret=' + client_secret + '&client_id=' + client_id + '&grant_type=authorization_code&code=' + pin;
            var options = this.getRequestOptions(url,"POST");

            request(options,
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log("Got response: " + response.statusCode);
                        console.log("body:"+body);
                        var data = JSON.parse(body);
                        var access_token = data.access_token;
                        callback(access_token);
                    } else {
                        console.log("error:"+error);
                        console.log("body: "+body);
                        console.log("response.code:"+response.statusCode);
                        var data = JSON.parse(body);
                        var error_description = data.error_description;
                        console.log("Error: " + error_description);
                        callback(null);
                    }
                }
            );
        },

        getDevice: function (token, deviceId, callback) {
            console.log("Getting Device deviceId:" + deviceId)

            if (token == null || token == undefined) {
                console.log("Could not find token.");
                callback(null);
                return;
            }
            if (deviceId == null || deviceId == undefined) {
                console.log("Could not find device Id.");
                callback(null);
                return;
            }

            //create a callback when were done getting the device
            var getDeviceResponseHandler = function (error, response, body) {
                if (!error) {
                    console.log("Got response: " + response.statusCode);
                    console.log("data:" + body);
                    var device = JSON.parse(body);
                    callback(device);
                }
                else {
                    console.log('Error happened: ' + error);
                    //getErrorResponse(callback, error);
                    callback(null);
                }
            };

            var url = 'https://developer-api.nest.com/devices/thermostats/' + deviceId + '?auth=' + token;
            var options = this.getRequestOptions(url);

            //we have what we need, get it.
            request(options, getDeviceResponseHandler);
        },
        getDevices: function (token, callback) {
            console.log("Getting Devices");

            if (token == null || token == undefined) {
                console.log("Could not find token.");
                callback(null);
                return;
            }

            //create a callback when were done getting the device
            var getDevicesResponseHandler = function (error, response, body) {
                if (!error) {
                    console.log("Got response: " + response.statusCode);
                    //console.log("data:" + body);
                    var devices = JSON.parse(body);
                    callback(devices);
                }
                else {
                    console.log('Error happened: ' + error);
                    //getErrorResponse(callback, error);
                    callback(null);
                }
            };

            var url = 'https://developer-api.nest.com/devices?auth=' + token;
            var options = this.getRequestOptions(url);

            //we have what we need, get it.
            request(options, getDevicesResponseHandler);
        },


        setTemperatureTo: function (token, deviceId, temperatureToSetTo, callback) {
            console.log("Setting temp to " + temperatureToSetTo);
            var body = {target_temperature_f:temperatureToSetTo};

            var options = {
                method: 'PUT',
                url: 'https://developer-api.nest.com/devices/thermostats/' + deviceId + '?auth=' + token,
                headers: {
                    'Content-Type': 'application/json'
                },
                json: true,
                body: body,
                followRedirect: true,
                followAllRedirects: true
            };

            function setTempCallback(error, response, body) {
                if (!error) {
                    console.log('BODY: ' + JSON.stringify(body));
                    var newTemp = body.target_temperature_f;
                    console.log("new temp is " + newTemp);
                    callback(newTemp);
                }
                else {
                    console.log('Error happened: '+ error);
                    callback(null);
                }
            }

            request(options,setTempCallback);
        },

        modifyTemperatureBy: function (userId, deviceId, temperature, callback) {

            var sessionAttributes = {};
            var cardTitle = "Temperature";
            var shouldEndSession = false;

            storage.getToken(userId,function (token) {
                console.log('got token from dynamodb=' + token);
                console.log("getting current device");

                nest.getDevice(token,deviceId,function(device) {
                    if(device != null) {
                        var currentTemp = nest.targetTempFromDevice(device);
                        var temperatureToSetTo = currentTemp + temperature;
                        console.log("Setting temp to "+ temperatureToSetTo);
                        nest.setTemperatureTo(token, deviceId, temperatureToSetTo, function (newTemp) {
                            if (newTemp != null) {
                                var speechOutput = "Your Nest is now set to " + newTemp + ".";
                                console.log("speech = " + speechOutput);
                                callback(sessionAttributes,
                                    responseHandlers.buildSpeechletResponse(cardTitle, speechOutput, speechOutput, null, shouldEndSession));
                            }
                        });
                    }
                });
            });
        },

        setTemperatureExplicitly: function (userId, deviceId, temperatureToSetTo, callback) {
            var sessionAttributes = {};
            var cardTitle = "Temperature";
            var shouldEndSession = true;

            storage.getToken(userId,function (token) {
                console.log('got token from dynamodb=' + token);
                console.log("setting temp to " + temperatureToSetTo);

                nest.setTemperatureTo(token, deviceId, temperatureToSetTo, function (newTemp) {
                    if (newTemp != null) {
                        var speechOutput = "Your Nest is now set to " + newTemp + ".";
                        callback(sessionAttributes,
                            responseHandlers.buildSpeechletResponse(cardTitle, speechOutput, speechOutput, null, shouldEndSession));
                    }
                });

            });
        },

        getRequestOptions: function (url, method) {

            //url is required
            if(url == null) {
                console.log("URL is a required parameter of getRequestOptions().");
                return null;
            }

            //default request method is GET
            var methodType = (method == null) ? 'GET' : method;
            return {
                method: methodType,
                url: url,
                followRedirect: true,
                followAllRedirects: true
            };
        },
        targetTempFromDevice: function (data) {

            //var tempScale = degreeTypeFromDevice(data)
            //console.log("tempScale: "+tempScale)
            //if(tempScale === "C") {
            //    return  data.target_temperature_c;
            //} else {
            return data.target_temperature_f;
            //}
        },
        firstDeviceIdFromDevices: function (devices) {
            var keys = Object.keys(devices.thermostats);
            console.log("0:"+ keys[0]);
            return keys[0];
        }
    }
})();
module.exports = nest;