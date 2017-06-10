const Alexa = require('alexa-sdk');
import App from './controller/app';

const app = new App();

const handlers = {
    'IdeaIntent': function () {
        app.establishConnection();
        app.fetchRandomIdea((name) => {
            app.close();
            console.log('Sending: Wie wäre es mit ' + name);
            this.emit(':tell', 'Wie wäre es mit ' + name);
            console.log("Message Send");
        });
    }
};

exports.handler = (event, context, callback) => {
    const alexa = Alexa.handler(event, context, callback);
    alexa.appId = process.env.APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

