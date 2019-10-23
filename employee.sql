CREATE DATABASE role_db;

use role_db;

-- SELECT * FROM songs WHERE genre='alternative';

-- DROP TABL-- E top5ksongs;

CREATE TABLE role(
	ID int NOT NULL AUTO_INCREMENT,
    ranking INTEGER,
    first_name VARCHAR (30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id (ID)
    manager_id (ID)
    PRIMARY KEY (ID) 

        );