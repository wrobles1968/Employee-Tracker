CREATE DATABASE role_db;

use role_db;

-- SELECT * FROM songs WHERE genre='alternative';

-- DROP TABL-- E top5ksongs;

CREATE TABLE role (
	ID int NOT NULL AUTO_INCREMENT,
    ranking INTEGER,
    title VARCHAR(30) NOT NULL,
	role salary decimal(6,2),

    PRIMARY KEY (ID) 

        );