async function createRolesTable(db) {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS roles
            (
                id SERIAL PRIMARY KEY,
                name TEXT
            );
        `)
        const roles = await db.query(`SELECT * FROM roles`);
        if (roles.rows.length === 0) {
            await db.query(`
                INSERT INTO roles
                VALUES
                (1, 'admin'),
                (2, 'customer')
            `);
        }
    } catch (error) {
        console.error('Error initializing roles table:', error);
    }
}

module.exports = createRolesTable;