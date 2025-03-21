import { pool } from '../connections.js';
import inquirer from 'inquirer';
import { add_record, select_query } from '../queries/sql_queries.js';

export class Employees {

    employee_columns: Array<object>;

    constructor() {
        this.employee_columns = [
            {
                type: "input",
                name: "employee_first_name",
                message: "What is the first name of the employee?",
                validate: (ans: any) => {
                    if (ans.trim().length > 0) {
                        return true;
                    } else {
                        return "Please, enter a valid first name!";
                    }
                }
            },
            {
                type: "input",
                name: "employee_last_name",
                message: "What is the last name of the employee?",
                validate: (ans: any) => {
                    if (ans.trim().length > 0) {
                        return true;
                    } else {
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
        ]
    };

    private fetch_roles = async (): Promise<Array<string>> => {
        const rows_ = await select_query("roles");
        const result_arr : Array<string> = [];
        if (rows_ && rows_.length > 0) {
            rows_.forEach((element : any) => {
                result_arr.push(element.title);
            });
            return result_arr;
        } else {
            return ["NULL"];
        }
    };

    private fetch_manager = async (): Promise<Array<string>> => {
        const rows_ = await select_query("employee");
        const result_arr : Array<string> = [];
        if (rows_ && rows_.length > 0) {
            rows_.forEach((element : any) => {
                result_arr.push([element.first_name, element.last_name].join(" "));
            });
            result_arr.push("None");
            return result_arr;
        } else {
            return ["NULL"];
        }
    };

    private fetch_role_id = async (role_title : string) : Promise<number | null> => {
        try {
            const query_ : string = `SELECT id FROM roles WHERE title = $1 LIMIT 1`;
            const result = await pool.query(query_, [role_title]);
            if (result.rows.length > 0) {
                return Number(result.rows[0].id);
            } else {
                return null;
            }
        } catch (error : any) {
            console.error("❌ Unable to fetch id from roles table: ", error.message);
            return null;
        }
    };

    private fetch_manager_id = async (first_name : string, last_name : string) : Promise<number | null> => {
        try {
            const query_ : string = `SELECT id FROM employee WHERE first_name = $1 AND last_name = $2 LIMIT 1`;
            const result = await pool.query(query_, [first_name, last_name]);
            if (result.rows.length > 0) {
                return Number(result.rows[0].id);
            } else {
                return null;
            }
        } catch (error : any) {
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
        
        if (ans.employee_manager == "NULL" || ans.employee_manager == "None"){
            await add_record("employee", ["first_name", "last_name", 
                "role_id", "manager_id"], 
                [ans.employee_first_name, ans.employee_last_name, 
                await this.fetch_role_id(ans.employee_role), 
                null]);
                return;
        }

        await add_record("employee", ["first_name", "last_name", 
            "role_id", "manager_id"], 
            [ans.employee_first_name, ans.employee_last_name, 
            await this.fetch_role_id(ans.employee_role), 
            await this.fetch_manager_id(ans.employee_manager.split(" ")[0], ans.employee_manager.split(" ")[1])]);
        return;
        
    };

    view_employees = async () => {
        try {
            const query_ = `SELECT 
                            e.id,
                            e.first_name,
                            e.last_name,  
                            r.title, 
                            d.name as department,
                            r.salary,
                            m.first_name || ' ' || m.last_name as manager
                            FROM employee as e
                            JOIN roles as r ON e.role_id = r.id
                            JOIN department as d ON r.department_id = d.id
                            LEFT JOIN employee as m ON e.manager_id = m.id;`;
            const result = await pool.query(query_);
            console.table(result.rows);
        } catch (error : any) {
            console.error(`❌ Error selecting from roles or department table:`, error.message);
        }
    };
}