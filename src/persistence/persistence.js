const anyDB = require("any-db");

let self;

export default class Persistence {

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