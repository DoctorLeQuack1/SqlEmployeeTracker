import inquirer from 'inquirer';
import { connectToDb } from './assets/connections.js';
import { Department } from './assets/tables/department.js';
import { Employees } from './assets/tables/employees.js';
import { Roles } from './assets/tables/roles.js';
import figlet from 'figlet';
import colors from 'colors';
// const view_stuff = async (): Promise<void> => {
//     return new Promise((resolve, reject) => {
//         pool.query('SELECT * FROM department', (err: Error, result: QueryResult) => {
//             if (err) {
//                 reject(err);  // Si hay un error, rechaza la promesa.
//             } else {
//                 const formattedData = result.rows.map(({ id, name }) => ({ id, name }));
//                 console.table(formattedData);  // Si es exitoso, imprime los resultados.
//                 resolve();  // Resuelve la promesa cuando se completan los datos.
//             }
//         });
//     });
// };
/*here we will define all of our const, including classes*/
const main_menu_options = [
    {
        type: "list",
        name: "init_option",
        message: "What would you like to do?",
        choices: ["View All Employees", "Add Employees", "Update Employee Role",
            "View All Roles", "Add Roles", "View All Departments", "Add Department",
            "Quit"]
    }
];
const department_ = new Department();
const employees_ = new Employees();
const roles_ = new Roles();
/*This will be the entry point of the application, here we will prompt our main menu*/
const options_ = async () => {
    const ans = await inquirer.prompt(main_menu_options);
    switch (ans.init_option) {
        case "View All Employees":
            await employees_.view_employees();
            break;
        case "Add Employees":
            await employees_.add_employee();
            break;
        case "Update Employee Role":
            await roles_.update_role();
            break;
        case "View All Roles":
            await roles_.view_roles();
            break;
        case "Add Roles":
            await roles_.add_roles();
            break;
        case "View All Departments":
            await department_.view_department();
            break;
        case "Add Department":
            await department_.department_prompts();
            break;
        case "Quit":
            process.exit();
        default:
            console.log("❌ Something went wrong!");
            break;
    }
    await options_();
};
figlet("Employee", async (err, data1) => {
    if (err) {
        console.log("Something went wrong...".red);
        console.dir(err);
        return;
    }
    figlet("Manager", async (err, data2) => {
        if (err) {
            console.log("Something went wrong...".red);
            console.dir(err);
            return;
        }
        console.log(colors.green(data1 + "\n" + data2));
        await connectToDb();
        await options_();
    });
});
