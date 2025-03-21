import inquirer from 'inquirer';
import { pool } from '../connections.js';
import { select_query, add_record } from '../queries/sql_queries.js';

export class Roles {

    roles_columns: Array<object>;
    roles_columns_update: Array<object>;

    constructor() {

        this.roles_columns = [
            {
                type: "input",
                name: "role_name",
                message: "What is the name of the role?",
                validate: (answer: any) => {
                    if (answer.trim(" ").length > 0) {
                        return true;
                    } else {
                        return "You must input a valid role name!";
                    }
                }
            },
            {
                type: "number",
                name: "role_salary",
                message: "What is the salary of the role?",
                validate: (answer: any) => {
                    if (answer > 0) {
                        return true;
                    } else {
                        return "Salaries must be greater than 0";
                    }
                }
            },
            {
                type: "list",
                name: "role_department",
                message: "Which department does the role belong to?",
                choices: async () => await this.fetch_department()
            }
        ]
        this.roles_columns_update = [
            {
                type: "list",
                name: "select_employee_update",
                message: "Which employee's role do you want to update?",
                choices: async () => await this.fetch_employee_names()
            },
            {
                type: "list",
                name: "select_role_update",
                message: "Which role do you want to assign selected employee?",
                choices: async () => await this.fetch_roles()
            },
        ]
    }

    fetch_department = async (): Promise<Array<string>> => {

        const rows_ = await select_query("department");
        if (rows_ && rows_.length > 0) {
            return rows_.map((element: any) => element.name);
        }
        return ["NULL"];
    };

    fetch_department_id = async (department_name: string): Promise<number | null> => {
        try {
            const query_ = `SELECT id FROM department WHERE name = $1 LIMIT 1`;
            const result = await pool.query(query_, [department_name]);
            if (result.rows.length > 0) {
                return Number(result.rows[0].id);
            } else {
                return null;
            }
        } catch (error: any) {
            console.error("❌ Unable to fetch id from department table: ", error.message);
            return null;
        }
    };

    fetch_employee_names = async (): Promise<Array<string>> => {

        const result = await select_query("employee");

        if (result && result.length > 0) {
            return result.map((element: any) => [element.first_name, element.last_name].join(" "));
        }

        return ["NULL"]

    };

    fetch_roles = async (): Promise<Array<string>> => {

        const result = await select_query("roles");

        if (result && result.length > 0) {
            return result.map((element: any) => element.title);
        }

        return ["NULL"]

    };

    fetch_employee_id = async (first_name: string, last_name: string): Promise<number | null> => {
        try {
            const query_ = `SELECT id FROM employee WHERE first_name = $1 AND last_name = $2 LIMIT 1`;
            const result = await pool.query(query_, [first_name, last_name]);
            if (result.rows.length > 0) {
                return Number(result.rows[0].id);
            } else {
                return null;
            }
        } catch (error: any) {
            console.error("❌ Unable to fetch id from employee table: ", error.message);
            return null;
        }
    };

    fetch_role_id = async (title: string): Promise<number | null> => {
        try {
            const query_ = `SELECT id FROM roles WHERE title = $1 LIMIT 1`;
            const result = await pool.query(query_, [title]);
            if (result.rows.length > 0) {
                return Number(result.rows[0].id);
            } else {
                return null;
            }
        } catch (error: any) {
            console.error("❌ Unable to fetch id from roles table: ", error.message);
            return null;
        }
    };

    view_roles = async () => {
        try {
            const query_ = `SELECT 
                            r.id, 
                            r.title, 
                            d.name AS department, 
                            r.salary
                            FROM roles as r
                            JOIN department as d ON r.department_id = d.id;`;
            const result = await pool.query(query_);
            console.table(result.rows);
        } catch (error : any) {
            console.error(`❌ Error selecting from roles or department table:`, error.message);
        }
    };

    add_roles = async () => {
        const ans = await inquirer.prompt(this.roles_columns);
        await add_record("roles", ["title", "salary", "department_id"],
            [ans.role_name, ans.role_salary, await this.fetch_department_id(ans.role_department)]);
    };

    update_role = async () => {
        const ans = await inquirer.prompt(this.roles_columns_update);
        const to_update_employee_id = await this.fetch_employee_id(
            ans.select_employee_update.split(" ")[0],
            ans.select_employee_update.split(" ")[1]);
        const to_update_role_id = await this.fetch_role_id(ans.select_role_update);

        try {
            const query_ = `UPDATE employee SET role_id = $1 WHERE id = $2`;
            const result = pool.query(query_, [to_update_role_id, to_update_employee_id]);
            console.log("✅ Successfully updated employee's role!");
        } catch (error: any) {
            console.error("❌ Unable to update role_id from employee table: ", error.message);
        }
    }
}