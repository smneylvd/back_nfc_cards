// const db = require('../config/database');
async function createUsersTable(db) {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS users
            (
                id SERIAL PRIMARY KEY,
                phone varchar(30),
                hash varchar(30),
                password TEXT,
                first_name varchar(30),
                last_name varchar(30),
                middle_name varchar(30),
                email TEXT UNIQUE,
                role_id INT,
                description TEXT,
                CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES roles(id)
            );
        `)
        }
        catch (error) {
            console.error('Error creating users table:', error);
        }
    }
module.exports = createUsersTable;