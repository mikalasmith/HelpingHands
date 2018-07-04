DROP DATABASE IF EXISTS volorg;

CREATE DATABASE volorg;

USE volorg;


CREATE TABLE users (
    user_id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password BINARY(60) NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB;

Create table opportunities (
	opp_id INT NOT NULL AUTO_INCREMENT,
    orgname VARCHAR(100),
    date DATE,
    numvol INT,
    address VARCHAR(100),
    city VARCHAR(50),
    state VARCHAR(2),
    zipcode INT,
    description VARCHAR(1000),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    PRIMARY KEY (opp_id)
    );
    
Create table matching (
	match_id INT NOT NULL AUTO_INCREMENT,
    user_id INT,
    opp_id INT,
	FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (opp_id) REFERENCES opportunities(opp_id),
    PRIMARY KEY (match_id)
);
SELECT matching.user_id, matching.opp_id, opportunities.orgname, opportunities.orgname, opportunities.date, opportunities.numvol, opportunities.city, opportunities.address, opportunities.state, opportunities.zipcode, opportunities.description, users.username, users.email FROM matching INNER JOIN users ON matching.user_id=users.user_id INNER JOIN opportunities ON matching.opp_id=opportunities.opp_id  WHERE users.user_id=6;  


