import { pool } from '../connections.js';

//Genral use queries
export const select_query = async (table : string) : Promise<Array<object> | null> => {
    try {
        const query = `SELECT * FROM ${table};`
        const result = await pool.query(query);
        return result.rows;
    } catch (error : any) {
        console.error(`❌ Error selecting from ${table} table:`, error.message);
        return null;
    }
};

export const add_record = async (table: string, columns: string[], values: any[]): Promise<void> => {
    try {
        // Crear la parte de los valores dinámicamente
        const valuePlaceholders = values.map((_, index) => `$${index + 1}`).join(", ");
        const columnPlaceholders = columns.join(", ");
        
        // Consulta dinámica
        const query = `INSERT INTO ${table} (${columnPlaceholders}) VALUES (${valuePlaceholders});`;
        
        // Ejecutar la consulta con los valores
        await pool.query(query, values);
        
        console.log(`✅ Successfully added record to the ${table} table.`);
    } catch (error: any) {
        console.error("❌ Error adding record:", error.message);
    }
};

