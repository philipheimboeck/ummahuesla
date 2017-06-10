/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__persistence_persistence__ = __webpack_require__(3);

const Rx = __webpack_require__(5);

class App {

    establishConnection() {
        const user = process.env.DB_USER;
        const pass = process.env.DB_PASS;
        const server = process.env.DB_HOST;
        const port = process.env.DB_PORT;
        const database = process.env.DB_NAME;
        this.persistence = new __WEBPACK_IMPORTED_MODULE_0__persistence_persistence__["a" /* default */](user, pass, server, port, database);
    }

    fetchRandomIdea(callback) {

        // Wrap callbacks
        const fetchProjectIds = Rx.Observable.fromNodeCallback(this.persistence.getAllProjectIds);
        const fetchProject = Rx.Observable.fromNodeCallback(this.persistence.fetchProject)

        // Fetch project ids
        fetchProjectIds()
            .map(result => result.rows)
            .map(rows => {
                // Pick a random item
                const length = rows.length;
                const index = Math.floor(Math.random() * length);

                return rows[index];
            })
            .map(row => row.id)
            .subscribe(id => {
                // Fetch the project name
                const project$ = fetchProject(id)
                    .map(result => result.rows[0])
                    .map(project => project.name);
                
                project$
                    .subscribe(name => {
                        console.log("Name", name);
                        callback(name);
                    }
                );
            }
        );
    }

    close() {
        this.persistence.close();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = App;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("alexa-sdk");

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__controller_app__ = __webpack_require__(0);
const Alexa = __webpack_require__(1);


const app = new __WEBPACK_IMPORTED_MODULE_0__controller_app__["a" /* default */]();

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



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const anyDB = __webpack_require__(4);

let self;

class Persistence {

    constructor(user, pass, host, port, database) {
        self = this;
        const url = 'postgres://' + user + ':' + pass + '@' + host + '/' + database;
        this.pool = anyDB.createPool(url, {min: 1, max: 5});
    }

    getAllProjectIds(callback) {
        self.pool.query('SELECT id FROM projects', [], callback);
    }

    fetchProject(id, callback) {
        self.pool.query('SELECT id, name, description FROM projects WHERE id = $1::int', [id], callback);
    }

    close() {
        self.pool.close();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Persistence;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("any-db");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("rx");

/***/ })
/******/ ]);