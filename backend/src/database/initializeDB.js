const initializeDB = (db) => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL, password TEXT NOT NULL, isDoctor BOOLEAN NOT NULL, isAdmin BOOLEAN NOT NULL, createdAt TEXT DEFAULT CURRENT_TIMESTAMP, updatedAt TEXT DEFAULT CURRENT_TIMESTAMP)", (err) => {
        if (err) {
            console.error("Eroare la crearea tabelului 'users':", err.message);
        } else {
            console.log("Tabelul 'users' a fost creat sau există deja.");
        }
    });


    db.run(`CREATE TABLE IF NOT EXISTS doctors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        speciality VARCHAR(255) NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id)
    )`, (err) => {
        if (err) {
            console.error("Eroare la crearea tabelului 'doctors':", err.message);
        } else {
            console.log("Tabelul 'doctors' a fost creat sau există deja.");
        }
    });

    db.run(`CREATE TABLE IF NOT EXISTS Appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patientId INTEGER,
        doctorId INTEGER,
        appointmentDate TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(patientId) REFERENCES users(id),
        FOREIGN KEY(doctorId) REFERENCES users(id)
    )`, (err) => {
        if (err) {
            console.error("Eroare la crearea tabelului 'appointments':", err.message);
        } else {
            console.log("Tabelul 'appointments' a fost creat sau există deja.");
        }
    });
};

export { initializeDB };
