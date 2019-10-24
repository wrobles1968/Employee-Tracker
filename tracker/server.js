const inquirer = require('inquirer');
const mysql = require('mysql')

// MySQL DB Connection Information (remember to change this with our specific credentials)
let connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "wcr123456",
  database: "employee_Tracker_db"
});
// Initiate MySQL Connection.
connection.connect(function(err) {
    if (err) {
      console.error("error connecting: " + err.stack);
      return;
    }
    console.log("connected as id " + connection.threadId);
  });

  function view() {
    inquirer
        .prompt(
            {
                name: "db",
                message: 'What are we looking at?',
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

  
  getJob();
  function getJob() {
      inquirer
          .prompt(
              {
                  name: 'job',
                  type: 'list',
                  message: 'What is your request?',
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
                  message: 'What do you want to add?',
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
                  message: "What department?",
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
                  name: 'employee_id',
                  message: "Who needs updating",
                  type: 'list',
                  choices: employees
              },
              {
                  name: 'role_id',
                  message: "The new role is?",
                  type: 'list',
                  choices: roles
              }
          ]).then(function ({ employee_id, role_id }) {

              connection.query(`UPDATE employee SET role_id = ${roles.indexOf(role_id) + 1} WHERE id = ${employees.indexOf(employee_id) + 1}`, function (err, data) {
                  if (err) throw err;

                  getJob();
                inquirer
                  .prompt([
                      {
                          name: 'employee_id',
                          message: "Who needs updating",
                          type: 'list',
                          choices: employees
                      },
                      {
                          name: 'role_id',
                          message: "The new role is?",
                          type: 'list',
                          choices: roles
                      }
                  ]).then(function ({ employee_id, role_id }) {

                      connection.query(`UPDATE employee SET role_id = ${roles.indexOf(role_id) + 1} WHERE id = ${employees.indexOf(employee_id) + 1}`, function (err, data) {
                          if (err) throw err;
  
                          getJob();
  
          inquirer
              .prompt([
                  {
                      name: 'title',
                      message: "The role?",
                      type: 'input'
                  },
                  {
                      name: 'salary',
                      message: 'How much do they get paid?',
                      type: 'input'
                  },
                  {
                      name: 'department_id',
                      message: 'Dept. does it belong to?',
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
  })
  
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
                          message: "The First Name",
                          type: 'input'
                      },
                      {
                          name: 'last_name',
                          message: 'Their last name?',
                          type: 'input',
                      },
                      {
                          name: 'role_id',
                          message: 'What role do they hold?',
                          type: 'list',
                          choices: roles,
                      },
                      {
                          name: 'manager_id',
                          message: "Who is their boss?",
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
  
  function update() {
      inquirer
          .prompt(
              {
                  name: 'update',
                  message: 'Do you need to update?',
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
  

                      })
                  })
          }
        
        })})})}