var AWS = require("aws-sdk");
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var responseHandlers = require('./responseHandlers');

var storage = (function () {

    var token_db_name = "tokens";
    var devices_db_name = "devices";

    return {

        getToken: function (userId, callback) {
            console.log("Loading token.")

            //clear it first in case something fails.
            var token = null;

            dynamodb.getItem({
                TableName: token_db_name,
                Key: {
                    userId: {
                        S: userId
                    }
                }
            }, function (err, data) {
                console.log("Done getting token.")
                if (err) {
                    console.log("Error getting token." + err)
                } else if (data.Item === undefined) {
                    console.log("Token not found.");
                } else {
                    console.log("Token found.");
                    token = data.Item.token.S;
                }
                callback(token);
            });
        },

        saveToken: function (token, userId, callback) {
            console.log("Saving token.")

            dynamodb.putItem({
                TableName: token_db_name,
                Item: {
                    userId: {
                        S: userId
                    },
                    token: {
                        S: token
                    }
                }

            }, function (err) {
                if (err) {
                    console.log(err, err.stack);
                    callback(false);
                } else {
                    console.log("I think it saved.");
                    callback(true);
                }
            });
        },

        deleteTokenForUserId: function(userId, callback) {
            console.log("deleting token for userid " + userId);

            dynamodb.deleteItem({
                TableName: token_db_name,
                Key: {
                    userId: {
                        S: userId
                    }
                }
            }, function (err, data) {
                console.log("Done deleting token.");
                if (err) {
                    console.log("Error getting token." + err)
                } else {
                    console.log("Token deleted.");
                }
                callback();
            });
        },

        getDeviceId: function (userId, callback) {
            console.log("Loading device.");

            //clear it first in case something fails.
            var device = null;

            dynamodb.getItem({
                TableName: devices_db_name,
                Key: {
                    userId: {
                        S: userId
                    }
                }
            }, function (err, data) {
                console.log("Done getting device.");
                if (err) {
                    console.log("Error getting device." + err)
                } else if (data.Item === undefined) {
                    console.log("Device not found.");
                } else {
                    console.log("Device found.");
                    device = data.Item.deviceId.S;
                }
                callback(device);
            });
        },

        saveDeviceId: function (deviceId, userId, callback) {
            console.log("Saving device.")

            dynamodb.putItem({
                TableName: devices_db_name,
                Item: {
                    userId: {
                        S: userId
                    },
                    deviceId: {
                        S: deviceId
                    }
                }

            }, function (err) {
                if (err) {
                    console.log("Error saving device.");
                    console.log(err, err.stack);
                    callback(false);
                } else {
                    console.log("Device saved.")
                    callback(true);
                }
            });
        },

        deleteDeviceIdForUserId: function(userId, callback) {
            console.log("deleting device id for userid " + userId);

            dynamodb.deleteItem({
                TableName: devices_db_name,
                Key: {
                    userId: {
                        S: userId
                    }
                }
            }, function (err, data) {
                console.log("Done deleting device.");
                if (err) {
                    console.log("Error getting device." + err)
                } else {
                    console.log("Device deleted.");
                }
                callback();
            });
        }
    }
})();
module.exports = storage;
