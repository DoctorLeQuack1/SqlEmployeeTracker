import { pool } from '../connections.js';
import inquirer from 'inquirer';
export class Employees {
    employee_columns;
    constructor() {
        this.employee_columns = [
            {
                type: "input",
                name: "employee_first_name",
                message: "What is the first name of the employee?",
                validate: (ans) => {
                    if (ans.trim().length > 0) {
                        return true;
                    }
                    else {
                        return "Please, enter a valid first name!";
                    }
                }
            },
            {
                type: "input",
                name: "employee_last_name",
                message: "What is the last name of the employee?",
                validate: (ans) => {
                    if (ans.trim().length > 0) {
                        return true;
                    }
                    else {
                        return "Please, enter a valid last name!";
                    }
                }
            },
            {
                type: "list",
                name: "employee_role",
                message: "What is the employee's role?",
                choices: async () => await this.fetch_roles()
            },
        ];
    }
    ;
    fetch_roles = async () => {
        try {
            const query = `SELECT * FROM roles;`;
            const result_arr = [];
            const result = await pool.query(query);
            if (result.rows.length > 0) {
                result.rows.forEach(element => {
                    result_arr.push(element.name);
                });
                return result_arr;
            }
            else {
                return ["NULL"];
            }
        }
        catch (error) {
            console.error("❌ Error fetching roles:", error.message);
            return ["NULL"];
        }
    };
    add_employee = async () => {
        const ans = await inquirer.prompt(this.employee_columns);
        console.log(ans);
    };
}
