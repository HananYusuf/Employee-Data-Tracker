USE employee_trackerDB;

INSERT INTO department(name)
VALUES ("Engineering"),
("Accounting"),
("Sales"),
("Marketing")

INSERT INTO role(title, salary, department_id)
VALUES ("Lead Engineer", 80000.00, 1),
("Salesman", 55000.00, 3),
("Engineer", 65000.00, 1),
("Marketing Specialist", 70000.00, 4),
("Accountant", 50000.00, 2)

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ("Hanan", "Yusuf", 1, NULL),
("Mitty", "Hanker", 2, NULL),
("Andres", "Long", 4, 1)

