const express = require('express');
const bodyParser = require('body-parser')

// Load .env file
require('dotenv').load();

import App from '../controller/app';

const controller = new App()
const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

controller.establishConnection();

app.get("/", function (request, response) {
    controller.fetchRandomIdea(function(message) {
        response.send(message);
    });
});

app.post("/:type", function(request, response) {
    const type = request.params.type;
    
    const callback = (error, value) => {
        if(error) {
            response.send("Failed to create:" + error);
            return;
        }

        response.send("Created");
    };

    switch(type) {
        case "project": {
            const gender = request.body.gender;
            const name = request.body.name;
            if(!gender || !name) {
                callback("Parameters missing");
                return;
            }
            controller.createProject(name, gender, callback);
            break;
        }
            
        case "adjective":
        {
            const male = request.body.male;
            const female = request.body.female;
            const thing = request.body.thing;
            if(!male || !female || !thing) {
                callback("Parameters missing");
                return;
            }
            controller.createAdjective(male, female, thing, callback);
            break;
        }
            
        case "object":
        {
            const name = request.body.name;
            if(!name){
                callback("Parameter missing");
                return;
            }
            controller.createObject(name, callback);
            break;
        }
            
        case "problem":
        {
            const problem = request.body.problem;
            if(!problem) {
                callback("Parameter missing");
                return;
            }
            controller.createProblem(problem, callback);
            break;
        }
        default:
            callback("Unknown type: " + type);
    }
});

app.listen(port);