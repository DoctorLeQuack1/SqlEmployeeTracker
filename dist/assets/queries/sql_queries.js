import { pool } from '../connections.js';
export const select_query = async (table) => {
    try {
        const query = `SELECT * FROM ${table};`;
        const result = await pool.query(query);
        console.log(result.rows);
        console.table(result.rows);
    }
    catch (error) {
        console.error(`❌ Error selecting from ${table} table:`, error.message);
    }
};
export const add_record = async (table, columns, values) => {
    try {
        // Crear la parte de los valores dinámicamente
        const valuePlaceholders = values.map((_, index) => `$${index + 1}`).join(", ");
        const columnPlaceholders = columns.join(", ");
        // Consulta dinámica
        const query = `INSERT INTO ${table} (${columnPlaceholders}) VALUES (${valuePlaceholders});`;
        // Ejecutar la consulta con los valores
        await pool.query(query, values);
        console.log(`✅ Successfully added record to the ${table} table.`);
    }
    catch (error) {
        console.error("❌ Error adding record:", error.message);
    }
};
