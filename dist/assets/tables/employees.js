import { pool } from '../connections.js';
import inquirer from 'inquirer';
import { add_record, select_query } from '../queries/sql_queries.js';
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
            {
                type: "list",
                name: "employee_manager",
                message: "What is the employee's manager?",
                choices: async () => await this.fetch_manager()
            },
        ];
    }
    ;
    fetch_roles = async () => {
        const rows_ = await select_query("roles");
        const result_arr = [];
        if (rows_ && rows_.length > 0) {
            rows_.forEach((element) => {
                result_arr.push(element.title);
            });
            return result_arr;
        }
        else {
            return ["NULL"];
        }
    };
    fetch_manager = async () => {
        const rows_ = await select_query("employee");
        const result_arr = [];
        if (rows_ && rows_.length > 0) {
            rows_.forEach((element) => {
                result_arr.push([element.first_name, element.last_name].join(" "));
            });
            result_arr.push("None");
            return result_arr;
        }
        else {
            return ["NULL"];
        }
    };
    fetch_role_id = async (role_title) => {
        try {
            const query_ = `SELECT id FROM roles WHERE title = $1 LIMIT 1`;
            const result = await pool.query(query_, [role_title]);
            if (result.rows.length > 0) {
                return Number(result.rows[0].id);
            }
            else {
                return null;
            }
        }
        catch (error) {
            console.error("❌ Unable to fetch id from roles table: ", error.message);
            return null;
        }
    };
    fetch_manager_id = async (first_name, last_name) => {
        try {
            const query_ = `SELECT id FROM employee WHERE first_name = $1 AND last_name = $2 LIMIT 1`;
            const result = await pool.query(query_, [first_name, last_name]);
            if (result.rows.length > 0) {
                return Number(result.rows[0].id);
            }
            else {
                return null;
            }
        }
        catch (error) {
            console.error("❌ Unable to fetch id from employee table: ", error.message);
            return null;
        }
    };
    add_employee = async () => {
        const ans = await inquirer.prompt(this.employee_columns);
        if (ans.employee_role == "NULL") {
            console.log("❌ Role table empty, please add a role to add a new employee!");
            return;
        }
        if (ans.employee_manager == "NULL" || ans.employee_manager == "None") {
            await add_record("employee", ["first_name", "last_name",
                "role_id", "manager_id"], [ans.employee_first_name, ans.employee_last_name,
                await this.fetch_role_id(ans.employee_role),
                null]);
            return;
        }
        await add_record("employee", ["first_name", "last_name",
            "role_id", "manager_id"], [ans.employee_first_name, ans.employee_last_name,
            await this.fetch_role_id(ans.employee_role),
            await this.fetch_manager_id(ans.employee_manager.split(" ")[0], ans.employee_manager.split(" ")[1])]);
        return;
    };
    view_employees = async () => {
        const result = await select_query("employee");
        console.table(result);
    };
}
