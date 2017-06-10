const Alexa = require('alexa-sdk');
import App from '../controller/app';

const app = new App();

const handlers = {
    'IdeaIntent': function () {
        app.establishConnection();
        app.fetchRandomIdea((message) => {
            app.close();
            console.log('Sending Message', message);
            this.emit(':tell', message);
        });
    }
};

exports.handler = (event, context, callback) => {
    const alexa = Alexa.handler(event, context, callback);
    alexa.appId = process.env.APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

