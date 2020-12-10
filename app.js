const inquirer = require("inquirer");
const mysql = require("mysql");

var departmentArray = [];
var roleArray = [];
var employeeArray = [];

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Indeed2020!",
    database: "employee_trackerDB"
});

connection.connect((err) => {
    if (err) throw err;
    getDepartmentArray();
    getRoleArray();
    getEmployeeArray();
    init();
});

// Gets the departments and puts them into an array to be used for
// choices.
function getDepartmentArray() {
    connection.query("SELECT * FROM department ORDER BY id", (err, res) => {
        if (err) throw err;
        var dataArr = res;
        departmentArray = [];
        for (i = 0; i < dataArr.length; i++) {
            departmentArray.push(dataArr[i].name);
        }
    })
}

// Gets the roles and puts them into an array to be used for
// choices.
function getRoleArray() {
    connection.query("SELECT * FROM role ORDER BY id", (err, res) => {
        if (err) throw err;
        var dataArr = res;
        roleArray = [];
        for (i = 0; i < dataArr.length; i++) {
            roleArray.push(dataArr[i].title);
        }
    })
}

// Gets the employees and puts them into an array to be used for
// choices.
function getEmployeeArray() {
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        var dataArr = res;
        employeeArray = [];
        for (i = 0; i < dataArr.length; i++) {
            employeeArray.push(dataArr[i].first_name + " " + dataArr[i].last_name);
        }
    })
}

function init() {
    inquirer.prompt({
        name: "userChoice",
        choices:
            [
                "ADD DEPARTMENT",
                "ADD ROLE",
                "ADD EMPLOYEE",
                "VIEW DEPARTMENT",
                "VIEW ROLE",
                "VIEW EMPLOYEE",
                "UPDATE EMPLOYEE ROLE",
                "QUIT"
            ],
        type: "list",
        message: "What would you like to do?"
    })
        .then(({ userChoice }) => {
            switch (userChoice) {
                case "ADD DEPARTMENT":
                    addDepartment();
                    break;
                case "ADD ROLE":
                    addRole();
                    break;
                case "ADD EMPLOYEE":
                    addEmployee();
                    break;
                case "VIEW DEPARTMENT":
                    viewDepartment();
                    break;
                case "VIEW ROLE":
                    viewRole();
                    break;
                case "VIEW EMPLOYEE":
                    viewEmployee();
                    break;
                case "UPDATE EMPLOYEE ROLE":
                    updateEmployeeRole();
                    break;
                case "QUIT":
                    connection.end();
                    break;
                default:
                    connection.end();
            }
        })
        .catch((err) => {
            throw err;
        });
}

function addDepartment() {
    inquirer.prompt([
        {
            name: "name",
            message: "What Department would you like to add?"
        }
    ]).then((answers) => {
        connection.query("INSERT INTO department SET ? ", { name: answers.name }, (err, res) => {
            if (err) throw err;
            getDepartmentArray();
            init();
        });
    })
}

function addRole() {
    inquirer.prompt([
        {
            name: "title",
            message: "Enter role title?"
        },
        {
            name: "salary",
            message: "Enter Salary?"
        },
        {
            type: "list",
            message: "Which department are we adding to?",
            choices: departmentArray,
            name: "depChoice"
        }
    ]).then((answers) => {
        connection.query(`INSERT INTO role SET ?`,
            {
                title: answers.title,
                salary: answers.salary,
                department_id: departmentArray.indexOf(answers.depChoice) + 1
            },
            (err) => {
                if (err) throw err;
                getRoleArray();
                init();
            }
        )
    })
}

function addEmployee() {
    inquirer.prompt([
        {
            name: "firstname",
            message: "Enter first name"
        },

        {
            name: "lastname",
            message: "Enter last name"
        },
        {
            name: "role",
            type: "list",
            message: "Enter a role? ",
            choices: roleArray
        },
        {
            name: "manager",
            type: "list",
            message: "Enter a manager? ",
            choices: employeeArray
        }
    ])
        .then((answers) => {
            // id INT PRIMARY KEY,
            // first_name VARCHAR(30),
            // last_name VARCHAR(30), 
            // role_id INT,
            // manager_id INT NULL            
            connection.query(`INSERT INTO employee SET ?`,
                {
                    first_name: answers.firstname,
                    last_name: answers.lastname,
                    // Gets the index of the array corresponding to the role/employee selected
                    // by the user. Assumes the indexes (+1) correspond to the ids.
                    role_id: roleArray.indexOf(answers.role) + 1,
                    manager_id: employeeArray.indexOf(answers.manager) + 1
                },

                (err) => {
                    if (err) throw err;
                    getEmployeeArray();
                    init();
                })
        })
        .catch(err => { throw err });
}

function viewDepartment() {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        init();
    });
}

function viewRole() {
    connection.query("SELECT role.id, title, salary, department.name FROM role JOIN department ON department_id = department.id", (err, res) => {
        if (err) throw err;
        // Log all results of the SELECT statement        
        console.table(res);
        init();
    });
}

function viewEmployee() {
    connection.query("SELECT employee.id, first_name, last_name, role.title, role.salary FROM employee JOIN role ON role_id = role.id", (err, res) => {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        init();

    });
}

function updateEmployeeRole() {
    inquirer.prompt([
        {
            type: "list",
            name: "employee",
            message: "Enter an employee?",
            choices: employeeArray
        },
        {
            type: "list",
            name: "role",
            message: "Enter a role?",
            choices: roleArray
        }
    ])
        .then((answers) => {                       
            connection.query(`UPDATE employee SET role_id = ? WHERE id = ?`,
                [
                    roleArray.indexOf(answers.role) + 1,    
                    employeeArray.indexOf(answers.employee) + 1                
                ],
                (err) => {
                    if (err) throw err;
                    init();
                })
        })
        .catch(err => { throw err });
}
