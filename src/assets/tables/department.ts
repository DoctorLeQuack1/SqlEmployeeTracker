import { QueryResult } from 'pg';
import { pool } from '../connections.js';
import inquirer from 'inquirer';
import { select_query, add_record } from '../queries/sql_queries.js';

export class Department {

    department_columns: Array<object>;

    constructor() {
        this.department_columns = [
            {
                type: "input",
                name: "departmentInsert",
                message: "What is the name of the department?",
                validate: (ans: any) => {
                    if (ans.trim().length > 0) {
                        return true;
                    } else {
                        return "Please, enter a valid department!";
                    }
                }
            },
        ]
    };

    private add_department = async (department_name: string): Promise<void> => {
        await add_record("department", ["name"], [department_name]);
    };

    view_department = async (): Promise<void> => {
        await select_query("department");
    };

    /*Here we should create our options for department table*/
    department_prompts = async (): Promise<void> => {
        const ans = await inquirer.prompt(this.department_columns);
        /*We only have one value to insert , so we will only handle 
        a single question on the prompt*/
        await this.add_department(ans.departmentInsert);
    };
}