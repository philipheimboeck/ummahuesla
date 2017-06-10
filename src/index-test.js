var http = require('http');
const Router = require('node-router');
// Load .env file
require('dotenv').load();

import App from './controller/app';

const app = new App();

// Load the node-router library by creationix
const router = Router();

// Configure our HTTP server to respond with Hello World the root request
router.push("/", function (request, response) {
    app.fetchRandomIdea(function(name) {
        response.send("Project: " + name);
    });
});

// Listen on port 8080 on localhost
var server = http.createServer(router).listen(8080);
