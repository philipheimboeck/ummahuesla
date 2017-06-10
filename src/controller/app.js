import Persistence from '../persistence/persistence';
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