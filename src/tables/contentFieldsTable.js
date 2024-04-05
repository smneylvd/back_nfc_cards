async function createContentFieldsTable(db) {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS content_fields
            (
                id SERIAL PRIMARY KEY,
                content_id numeric,
                type varchar(30),
                value TEXT,
                created_at TIMESTAMP,
                deleted_at TIMESTAMP 
            );
        `)
        }
        catch (error) {
            console.error('Error creating content_fields table:', error);
        }
    }
module.exports = createContentFieldsTable;