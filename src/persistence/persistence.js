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
        self.pool.query('SELECT * FROM projects WHERE id = $1::int', [id], callback);
    }

    getAllAdjectiveIds(callback) {
        self.pool.query('SELECT id FROM adjectives', [], callback);
    }

    fetchAdjective(id, callback) {
        self.pool.query('SELECT * FROM adjectives WHERE id = $1::int', [id], callback);
    }

    getAllObjectIds(callback) {
        self.pool.query('SELECT id FROM objects', [], callback);
    }

    fetchObject(id, callback) {
        self.pool.query('SELECT * FROM objects WHERE id = $1::int', [id], callback);
    }

    getAllProblemIds(callback) {
        self.pool.query('SELECT id FROM problems', [], callback);
    }

    fetchProblem(id, callback) {
        self.pool.query('SELECT * FROM problems WHERE id = $1::int', [id], callback);
    }

    close() {
        self.pool.close();
    }
}