import Persistence from '../persistence/persistence';
import {tellIdea} from '../alexa/speech.js'
const Rx = require('rx');

export default class App {

    establishConnection() {
        const user = process.env.DB_USER;
        const pass = process.env.DB_PASS;
        const server = process.env.DB_HOST;
        const port = process.env.DB_PORT;
        const database = process.env.DB_NAME;
        this.persistence = new Persistence(user, pass, server, port, database);
    }

    fetchRandomIdea(callback) {

        // Wrap callbacks
        const fetchProjectIds = Rx.Observable.fromNodeCallback(this.persistence.getAllProjectIds);
        const fetchProject = Rx.Observable.fromNodeCallback(this.persistence.fetchProject);
        const fetchAdjectiveIds = Rx.Observable.fromNodeCallback(this.persistence.getAllAdjectiveIds);
        const fetchAdjective = Rx.Observable.fromNodeCallback(this.persistence.fetchAdjective);
        const fetchObjectIds = Rx.Observable.fromNodeCallback(this.persistence.getAllObjectIds);
        const fetchObject = Rx.Observable.fromNodeCallback(this.persistence.fetchObject);
        const fetchProblemIds = Rx.Observable.fromNodeCallback(this.persistence.getAllProblemIds);
        const fetchProblem = Rx.Observable.fromNodeCallback(this.persistence.fetchProblem);

        const random = (elements => {
            // Pick a random item
            const length = elements.length;
            const index = Math.floor(Math.random() * length);

            return elements[index];
        });

        const project$ = fetchProjectIds()
            .map(result => result.rows)
            .map(rows => random(rows))
            .map(row => row.id)
            .flatMap((id) => fetchProject(id).map(result => result.rows[0]));
        const adjective$ = fetchAdjectiveIds()
            .map(result => result.rows)
            .map(rows => random(rows))
            .map(row => row.id)
            .flatMap((id) => fetchAdjective(id).map(result => result.rows[0]));
        const object$ = fetchObjectIds()
            .map(result => result.rows)
            .map(rows => random(rows))
            .map(row => row.id)
            .flatMap((id) => fetchObject(id).map(result => result.rows[0]));
        const problems$ = fetchProblemIds()
            .map(result => result.rows)
            .map(rows => random(rows))
            .map(row => row.id)
            .flatMap((id) => fetchProblem(id).map(result => result.rows[0]));
        
        project$.zip(adjective$)
            .zip(object$).map(array => [array[0][0], array[0][1], array[1]])
            .zip(problems$).map(array => [array[0][0], array[0][1], array[0][2], array[1]])
            .map((instances) => {
                const project = instances[0];
                const adjective = instances[1]
                const object = instances[2];
                const problem = instances[3];

                let adjective_gender = '';
                switch(project.gender) {
                    case 1:
                        adjective_gender = adjective.adjective_male;
                        break;
                    case 2:
                        adjective_gender = adjective.adjective_female;
                        break;
                    case 3:
                        adjective_gender = adjective.adjective_thing;
                        break;
                }
                
                return tellIdea(project.gender, adjective_gender, project.subject, object.name, problem.problem);
            })
            .subscribe(value => {
                callback(value);
                }
            );
    }

    close() {
        this.persistence.close();
    }
}