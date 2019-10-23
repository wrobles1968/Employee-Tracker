
DROP DATABASE IF EXISTS department_db;
CREATE DATABASE department_db;
USE department_db;

CREATE TABLE department(
  id INTEGER(11) AUTO_INCREMENT NOT NULL,
  name VARCHAR(30),
  PRIMARY KEY (id)

      );