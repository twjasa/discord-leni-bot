const sqlite3 = require('sqlite3').verbose();

class Db {
	constructor(dbName = ':memory:') {
		this.dbName = dbName;
		this.open();
		this.db.run('CREATE TABLE IF NOT EXISTS products (id TEXT UNIQUE, qty INTEGER)');
	}

	open() {
		this.db = new sqlite3.Database(
			this.dbName,
			sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
			(err) => {
				if (err) {
					console.error(err.message);
				}
				console.log('Connected to the SQlite database.');
			},
		);
	}
	getOrCreate(id, qty = 0) {
		return new Promise((resolve, reject) => {
			this.db.get('SELECT * FROM products WHERE id = ?', id, (err, row) => {
				if (err) {
					reject(err.message);
				}
				else if (row) {
					resolve(row);
				}
				else {
					this.modifyOrAdd(id, qty);
					resolve({ id, qty });
				}
			});
		});
	}
	get(id) {
		return new Promise((resolve, reject) => {
			this.db.get('SELECT * FROM products WHERE id = ?', id, (err, row) => {
				if (err) {

					reject(err.message);
				}
				else {
					resolve(row);
				}

			});
		});
	}

	getAll() {
		return new Promise((resolve, reject) => {
			this.db.all('SELECT * FROM products', (err, rows) => {
				if (err) {
					reject(err.message);
				}
				else {
					resolve(rows);
				}
			});
		});
	}
	create(id, qty) {
		return new Promise((resolve, reject) => {
			this.db.run('INSERT INTO products (id, qty) VALUES (?, ?)', [id, qty], function(err) {
				if (err) {
					reject(err.message);
				}
				else {
					console.log('--------> created');
					resolve({ id, qty });
				}
			});
		});
	}

	modify(id, qty) {
		return new Promise((resolve, reject) => {
			this.db.run('UPDATE products SET qty = ? WHERE id = ?', [qty, id], function(err) {
				if (err) {
					reject(err.message);
				}
				else {
					console.log('--------> modified');
					resolve({ id, qty });
				}
			});
		});
	}
	modifyOrAdd(id, qty) {
		return new Promise((resolve, reject) => {
			this.db.run('INSERT OR REPLACE INTO products (id, qty) VALUES (?, ?)', [id, qty], function(err) {
				if (err) {
					reject(err.message);
				}
				resolve({ id, qty });
			});
		});
	}

	remove(id) {
		return new Promise((resolve, reject) => {
			this.db.run('DELETE FROM products WHERE id = ?', id, function(err) {
				if (err) {
					reject(err.message);
				}
				resolve(id);
			});
		});
	}

	dropTable() {
		return new Promise((resolve, reject) => {
			this.db.run('DROP TABLE IF EXISTS products', function(err) {
				if (err) {
					reject(err.message);
				}
				resolve();
			});
		});
	}

	close() {
		const self = this;
		this.db.close((err) => {
			if (err) {
				return console.error(err.message);
			}
			console.log('Closed the database connection.');
			self.db = null;
		});
	}
}

const db = new Db('./student-chat.db');
db.close();
module.exports = db;
