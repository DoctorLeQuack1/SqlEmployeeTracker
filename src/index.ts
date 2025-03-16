import inquirer from 'inquirer';
import { QueryResult } from 'pg';
import { pool, connectToDb } from './assets/connections.js';

const view_stuff = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM department', (err: Error, result: QueryResult) => {
            if (err) {
                reject(err);  // Si hay un error, rechaza la promesa.
            } else {
                const formattedData = result.rows.map(({ id, name }) => ({ id, name }));
                console.table(formattedData);  // Si es exitoso, imprime los resultados.
                resolve();  // Resuelve la promesa cuando se completan los datos.
            }
        });
    });
};

const main_menu_options : Array<object> = [
    {
        type: "list",
        name: "init_option",
        message: "What would you like to do?",
        choices: ["View All Employees", "Add Employees", "Update Employee Role", 
            "View All Roles", "Add Roles", "View All Departments", "Add Department",
        "Quit"]
    }
];
/*This will be the entry point of the application, here we will prompt our main menu*/
const options_ = async () : Promise<void> => {
    const ans = await inquirer.prompt(main_menu_options);
    switch (ans.init_option) {
        case "View All Employees":
            await view_stuff();         
            break;
        
        case "Add Employees":
        
            break;

        case "Update Employee Role":
        
            break;

        case "View All Roles":
        
            break;

        case "Add Roles":
        
            break;
            
        case "Add Department":
        
            break;

        case "Quit":
            process.exit();
    
        default:
            console.log("Something went wrong!");
            break;
    }

    await options_();

};

await connectToDb();
await options_();