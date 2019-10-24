const table = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql')

// Create express app instance.
let app = express();

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
let PORT = process.env.PORT || 8080;

// MySQL DB Connection Information (remember to change this with our specific credentials)
let connection = mysql.createConnection({
  host: "localhost",
  port: 8080,
  user: "root",
  password: "wcr123456",
  database: "employee_tracker_db"
});
// Initiate MySQL Connection.
connection.connect(function(err) {
    if (err) {
      console.error("error connecting: " + err.stack);
      return;
    }
    console.log("connected as id " + connection.threadId);
  });

  connection.query(`INSERT INTO department (name) VALUES ('${name}')`, function (err, data) {
    if (err) throw err;
    console.log(`Added`)
    getJob();
  });

  
  getJob();
  function getJob() {
      inquirer
          .prompt(
              {
                  name: 'job',
                  type: 'list',
                  message: 'Which would you like to do?',
                  choices: ['add', 'view', 'update', 'exit'],
              }
          ).then(function ({ job }) {
              switch (job) {
                  case 'add':
                      add();
                      break;
                  case 'view':
                      view();
                      break;
                  case 'update':
                      update();
                      break;
                  case 'exit':
                      connection.end()
                      return;
              }
  
          })
  }
  
  function add() {
      inquirer
          .prompt(
              {
                  name: "db",
                  message: 'Which would you like to add?',
                  type: 'list',
                  choices: ['department', 'role', 'employee'],
              }
          ).then(function ({ db }) {
              switch (db) {
                  case "department":
                      add_department()
                      break;
                  case "role":
                      add_role()
                      break;
                  case 'employee':
                      add_employee();
                      break;
              }
          })
  
  }
  
  function add_department() {
      inquirer
          .prompt(
              {
                  name: 'name',
                  message: "What is the department's name?",
                  type: 'input'
              }
          ).then(function ({ name }) {
              connection.query(`INSERT INTO department (name) VALUES ('${name}')`, function (err, data) {
                  if (err) throw err;
                  console.log(`Added`)
                  getJob();
              })
          })
  }
  
  function add_role() {
      let departments = []
  
      connection.query(`SELECT * FROM department`, function (err, data) {
          if (err) throw err;
  
          for (let i = 0; i < data.length; i++) { 
              departments.push(data[i].name)
  
          }
  
  
          inquirer
              .prompt([
                  {
                      name: 'title',
                      message: "What is the role?",
                      type: 'input'
                  },
                  {
                      name: 'salary',
                      message: 'How much do they make?',
                      type: 'input'
                  },
                  {
                      name: 'department_id',
                      message: 'What department does it belong to?',
                      type: 'list',
                      choices: departments
                  }
              ]).then(function ({ title, salary, department_id }) {
                  let index = departments.indexOf(department_id)
  
                  connection.query(`INSERT INTO role (title, salary, department_id) VALUES ('${title}', '${salary}', ${index})`, function (err, data) {
                      if (err) throw err;
                      console.log(`Added`)
                      getJob();
                  })
              })
      })
  }
  
  function add_employee() {
      let employees = [];
      let roles = [];
  
      connection.query(`SELECT * FROM role`, function (err, data) {
          if (err) throw err;
  
  
          for (let i = 0; i < data.length; i++) {
              roles.push(data[i].title);
          }
  
          connection.query(`SELECT * FROM employee`, function (err, data) {
              if (err) throw err;
  
              for (let i = 0; i < data.length; i++) {
                  employees.push(data[i].first_name);
              }
  
              inquirer
                  .prompt([
                      {
                          name: 'first_name',
                          message: "what's the employees First Name",
                          type: 'input'
                      },
                      {
                          name: 'last_name',
                          message: 'What is their last name?',
                          type: 'input',
                      },
                      {
                          name: 'role_id',
                          message: 'What is their role?',
                          type: 'list',
                          choices: roles,
                      },
                      {
                          name: 'manager_id',
                          message: "Who is their manager?",
                          type: 'list',
                          choices: ['none'].concat(employees)
                      }
                  ]).then(function ({ first_name, last_name, role_id, manager_id }) {
                      let queryText = `INSERT INTO employee (first_name, last_name, role_id`;
                      if (manager_id != 'none') {
                          queryText += `, manager_id) VALUES ('${first_name}', '${last_name}', ${roles.indexOf(role_id)}, ${employees.indexOf(manager_id) + 1})`
                      } else {
                          queryText += `) VALUES ('${first_name}', '${last_name}', ${roles.indexOf(role_id) + 1})`
                      }
                      console.log(queryText)
  
                      connection.query(queryText, function (err, data) {
                          if (err) throw err;
                          console.table (data );
                          getJob();
                      })
                  })
  
          })
      })
  }
  
  function view() {
      inquirer
          .prompt(
              {
                  name: "db",
                  message: 'Which would you like to view?',
                  type: 'list',
                  choices: ['department', 'role', 'employee'],
              }
          ).then(function ({ db }) {
              connection.query(`SELECT * FROM ${db}`, function (err, data) {
                  if (err) throw err;
  
                  console.table(data)
                  getJob();
              })
          })
  }
  
  function update() {
      inquirer
          .prompt(
              {
                  name: 'update',
                  message: 'What would you like to update?',
                  type: 'list',
                  choices: ['role', 'manager']
              }
          ).then(function ({ update }) {
              switch (update) {
                  case 'role':
                      update_role();
                      break;
                  case 'manager':
                      update_manager();
                      break;
              }
          })
  }
  
  function update_role() {
      connection.query(`SELECT * FROM employee`, function (err, data) {
          if (err) throw err;
  
          let employees = [];
          let roles = [];
  
          for (let i = 0; i < data.length; i++) {
              employees.push(data[i].first_name)
          }
  
          connection.query(`SELECT * FROM role`, function (err, data) {
              if (err) throw err;
  
              for (let i = 0; i < data.length; i++) {
                  roles.push(data[i].title)
              }
  
              inquirer
                  .prompt([
                      {
                          name: 'employee_id',
                          message: "Who's role needs to be updated",
                          type: 'list',
                          choices: employees
                      },
                      {
                          name: 'role_id',
                          message: "What is the new role?",
                          type: 'list',
                          choices: roles
                      }
                  ]).then(function ({ employee_id, role_id }) {

                      connection.query(`UPDATE employee SET role_id = ${roles.indexOf(role_id) + 1} WHERE id = ${employees.indexOf(employee_id) + 1}`, function (err, data) {
                          if (err) throw err;
  
                          getJob();
                      })
                  })
          })
  
      })
  }
  
  