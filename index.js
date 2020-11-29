/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');

/*used for keeping track of her response
 *set at 3 because that will be her first response to the user 
 *that is not the initial prompt
 */
var alexaCount = 3;  

/*used for checking the user's answer
 *set at 2 because that should be the user's first response
 */
var usrCount = 2;  

/*used for triggering repeat intent*/
var repeat = '';

/*function to check the user's response
 *returns what the expected answer from the user is
 */
function verifyAns(num){    
    
    if(num%3 === 0 && num%5 === 0){
        return 'fizz buzz'; 
    }
    else if(num%3 === 0){
        return 'fizz';  
    }
    else if(num%5 === 0){
        return 'buzz';   
    }
    else{
       return num;
    }
    
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome to Fizz Buzz. We\'ll each take turns counting up from one.'
            + ' However, you must replace numbers divisible by 3 with the word fizz, and you must'
            + ' replace numbers divisible by 5 with the word buzz. If a number is divisible by both 3 and 5, you should instead say fizz buzz.'
            + ' If you get one wrong, you lose. Okay I\'ll start...one';
        
        const repromptOutput = 'Okay I\'ll start...one';
        
        repeat = speakOutput;
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();
    }
};

const PlayIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
        Alexa.getIntentName(handlerInput.requestEnvelope) === 'PlayIntent';
    },
    handle(handlerInput) {
        var speakOutput = '';
        
        //stores user's number response
        var usrNumAns = handlerInput.requestEnvelope.request.intent.slots.number.value; 
        
        //stores user's word response (fizz, buzz, etc.)
        var usrWordAns = handlerInput.requestEnvelope.request.intent.slots.word.value;
        
        //stores what user's response should be
        var shouldBe = verifyAns(usrCount);   
        
        /*Below is all the game logic
         *Each if statement is used to determine Alexa's response
         */
        if (alexaCount%3 === 0 && alexaCount%5 === 0 && (shouldBe == usrNumAns || shouldBe == usrWordAns)){
            speakOutput = 'fizz buzz';
            alexaCount += 2;
            usrCount += 2;
        }
        else if(alexaCount%3 === 0 && (shouldBe == usrNumAns|| shouldBe == usrWordAns)){
                speakOutput = 'fizz';
                alexaCount += 2;
                usrCount += 2;
        }
        else if(alexaCount%5 === 0 && (shouldBe == usrNumAns || shouldBe == usrWordAns)){
            speakOutput = 'buzz';
            alexaCount += 2;
            usrCount += 2;
        }
        else if(shouldBe != usrNumAns && shouldBe !== usrWordAns){
            speakOutput = 'I\'m sorry the correct response was ' + 
                shouldBe + '. You lose! Thanks for playing Fizz Buzz. For another great Alexa game, check out Song Quiz!';
            alexaCount = 3;  //reset alexa for next session
            usrCount = 2;   //reset user's count for next session
            
            repeat = speakOutput;
            
            return handlerInput.responseBuilder //ends session
                .speak(speakOutput)
                .withShouldEndSession(true)
                .getResponse();
        }
        else{
            speakOutput = alexaCount.toString();
            alexaCount += 2;
            usrCount += 2;
        }
        
        repeat = speakOutput;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const RepeatIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RepeatIntent';
    },
    handle(handlerInput) {
        const speakOutput = repeat;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome to Fizz Buzz. We\'ll each take turns counting up from one.'
            + ' However, you must replace numbers divisible by 3 with the word fizz, and you must'
            + ' replace numbers divisible by 5 with the word buzz. If a number is divisible by both 3 and 5, you should instead say fizz buzz.'
            + ' If you get one wrong, you lose.';

        repeat = speakOutput;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Thanks for playing Fizz Buzz! For another great Alexa game, check out Song Quiz!';

        repeat = speakOutput;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        repeat = speakOutput;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        repeat = speakOutput;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        repeat = speakOutput;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        PlayIntentHandler,
        HelpIntentHandler,
        RepeatIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();