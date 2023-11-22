import sqlite3 from 'sqlite3';
import { initializeDB } from './initializeDB.js';

const { Database } = sqlite3.verbose();

const db = new Database('./sqlite.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Conectat la baza de date SQLite.');
        initializeDB(db);
    }
});

// asyncronous method for querying the database
async function dbQuery(query, args) {
    return new Promise((resolve, reject) => {
        db.get(query, args, (err, row) => {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

export default dbQuery;
