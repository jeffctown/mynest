

//node modules
var request = require('request');

//local modules
var responseHandlers = require('./responseHandlers');
var storage = require('./storage');
var nest = require('./nest');
var intentHandlers = require('./intentHandlers');

//state vars
var session;
var userId;

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */

        //if (event.session.application.applicationId !== "APP_ID") {
        //    context.fail("Invalid Application ID");
        //}

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        session = event.session;
        userId = session.user.userId;
        console.log("userId of this user is " + userId);
        console.log(JSON.stringify(event))

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(responseHandlers.buildResponse(sessionAttributes, speechletResponse));
                });
        }  else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(responseHandlers.buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId
        + ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */

function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId
        + ", sessionId=" + session.sessionId);

    storage.getToken(userId,function (token) {

        if(token != null) {
            console.log('get token from dynamodb=' + token);
            storage.getDeviceId(userId, function (deviceId) {
                if(deviceId != null) {
                    console.log("got device id from dynamo= " + deviceId);
                    intentHandlers.getCurrentTemperatureIntent(token, deviceId, callback)
                }
            });
        } else {
            console.log("giving setup response.");
            responseHandlers.getSetupResponse(callback);
        }
    });
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId
        + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    //if("SetupIntent" === intentName) {
    //    getSetupResponse(callback);
    //} else if ("HelpIntent" === intentName) {
    //    getWelcomeResponse(callback);
    //} else if ("GetTemperatureIntent" === intentName) {
    //getCurrentTemperatureIntent(callback, false);
    //} else
    if ("TurnItDownIntent" === intentName) {
        intentHandlers.turnItDownIntent(userId,callback);
    } else if ("TurnItUpIntent" === intentName) {
        intentHandlers.turnItUpIntent(userId,callback);
    } else if ("SetTemperatureIntent" === intentName) {
        intentHandlers.setTemperatureIntent(userId,callback,intent);
    } else if ("RefreshDeviceIntent" === intentName) {
        intentHandlers.refreshDeviceIntent(userId,callback);
    } else if ("ResetIntent" === intentName) {
        intentHandlers.resetIntent(userId,callback);
    } else if ("EnterPinIntent" === intentName) {
        intentHandlers.enterPinIntent(callback, intent, userId);
    //} else if ("ThanksIntent" === intentName) {
    //    intentHandlers.thanksIntent(callback);
    } else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId
        + ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}