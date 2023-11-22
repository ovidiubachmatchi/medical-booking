const initializeDB = (db) => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, parola TEXT)", (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log("Tabelul 'users' a fost creat sau există deja.");
        }
    });
};

export { initializeDB };
