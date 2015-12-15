

var setupCardOutput = "Welcome to My Nest. To begin, I will need you to authorized me with Nest so"
    + " I can access your thermostat.  Open this link in a browser to continue: http://mynest.jefflett.com. "
    + "Nest will give you a pin.  Continue with setup by saying Alexa, Open MyNest.  My pin is XXXXXXXX.";
var setupSpeechOutput = "Welcome to My Nest.";
var setupSpeechReprompt = "To setup My Nest, I will need you to authorize me with Nest so I can access your thermostat. "
    + "Open this link in a browser to continue. my. nest. dot. j. e. f. f. l. e. t. t. dot com. "
    + "Nest will give you a pin.  Continue with setup by saying Alexa. open my nest. my pin is. and then say your pin";

var responseHandlers = (function () {
    return {

        buildSpeechletResponse: function (title, speechOutput, cardOutput, repromptText, shouldEndSession) {
            return {
                outputSpeech: {
                    type: "PlainText",
                    text: speechOutput
                },
                card: {
                    type: "Simple",
                    title: "My Nest - " + title,
                    content: cardOutput
                },
                reprompt: {
                    outputSpeech: {
                        type: "PlainText",
                        text: repromptText
                    }
                },
                shouldEndSession: shouldEndSession
            }
        },

        buildResponse: function (sessionAttributes, speechletResponse) {
            return {
                version: "1.0",
                sessionAttributes: sessionAttributes,
                response: speechletResponse
            }
        },

        getEnterPinResponse: function (callback) {

            var sessionAttributes = {};
            var cardTitle = "Enter Your Pin";
            var speechOutput = "What is the pin code that Nest gave you?";
            var shouldEndSession = false;

            callback(sessionAttributes,
                this.buildSpeechletResponse(cardTitle, speechOutput, setupCardOutput, setupSpeechOutput, shouldEndSession))
        },

        getSetupResponse: function (callback) {

            var sessionAttributes = {};
            var cardTitle = "Setup Your Nest";
            var shouldEndSession = false;

            callback(sessionAttributes,
                this.buildSpeechletResponse(cardTitle, setupSpeechOutput , setupCardOutput, setupSpeechReprompt, shouldEndSession));
        },

        getErrorResponse: function (callback, e) {
            console.log("Got error: " + e.message);

            var sessionAttributes = {};
            var cardTitle = "Communication Error";
            var speechOutput = "I am having trouble connecting to your nest. "
                + "The error I have received is " + e.message;
            var shouldEndSession = true;

            callback(sessionAttributes,
                this.buildSpeechletResponse(cardTitle, speechOutput, speechOutput, null, shouldEndSession));
        },

        getThanksResponse: function(callback) {
            console.log("We were thanked! Boo yah!");

            var cardTitle = "You're Welcome.";
            var speechOutput = "Youre welcome.";
            var cardOutput = "Thank you for using MyNest.  Please leave us feedback to help us improve your experience.";
            var shouldEndSession = true;

            callback({},this.buildSpeechletResponse(cardTitle,speechOutput,cardOutput,null,shouldEndSession));
        }
    }
})();
module.exports = responseHandlers;