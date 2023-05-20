const PouchDB = require('pouchdb');

class Db {
	constructor(path) {
		this.path = path;
		this.db = new PouchDB(this.path);
		this.isOpen = true;
	}

	open() {
		if (!this.isOpen) {
			this.db = new PouchDB(this.path);
			this.isOpen = true;
		}
		return this.db.info();
	}

	close() {
		return this.db.close().then(() => {
			this.isOpen = false;
		});
	}

	execute(action) {
		if (!this.isOpen) {
			this.open();
		}
		return action(this.db);
	}

	create(id, qty) {
		return this.execute(db => {
			const product = {
				_id: id,
				qty: qty,
			};
			return db.put(product);
		});
	}

	get(id, qty) {
		return this.execute(db => {
			return db.get(id).catch(err => {
				if (err.name === 'not_found') {
					return this.create(id, qty);
				}
				else {
					throw err;
				}
			});
		});
	}

	getAll() {
		return this.execute(db => db.allDocs({ include_docs: true }));
	}

	modify(id, qty) {
		return this.execute(db => {
			return db.get(id).then(doc => {
				doc.qty = qty;
				return db.put(doc);
			});
		});
	}

	modifyOrCreate(id, qty) {
		return this.execute(db => {
			return db.get(id).then(doc => {
				doc.qty = qty;
				return db.put(doc);
			}).catch(err => {
				if (err.name === 'not_found') {
					return this.create(id, qty);
				}
				else {
					throw err;
				}
			});
		});
	}

	remove(id) {
		return this.execute(db => {
			return db.get(id).then(doc => {
				return db.remove(doc);
			});
		});
	}

	dropTable() {
		return this.execute(db => db.destroy()).then(() => {
			this.isOpen = false;
		});
	}
}

module.exports = new Db('./DB/store');
