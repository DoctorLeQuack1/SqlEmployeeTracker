CREATE TABLE department (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(30) UNIQUE NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INTEGER NOT NULL,
  FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER NOT NULL,
  manager_id INTEGER,
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);

INSERT INTO department (name) VALUES ('Marketing'), ('Engineering'), ('Sales'), ('Logistics');

INSERT INTO roles (title, salary, department_id) VALUES ('Publicist', 8000, 1), ('Sr. Software Engineer', 1000000, 2), ('Promoter', 5000, 3), ('Route Planner', 7000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Sergio', 'Aguilar', 2, null), ('Michell', 'Perez' , 1, null);