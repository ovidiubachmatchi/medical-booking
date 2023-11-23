import sqlite3 from 'sqlite3';
import { initializeDB } from './initializeDB.js';
import { Sequelize } from 'sequelize';

const { Database } = sqlite3;

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

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './sqlite.db', // Ajustează calea relativă dacă este necesar
  });

export {dbQuery, sequelize};
