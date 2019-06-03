DROP TABLE IF EXISTS users;

CREATE TABLE users (
	id INT NOT NULL AUTO_INCREMENT,
	first_name VARCHAR(64) NOT NULL,
	last_name VARCHAR(64) NOT NULL,
	email VARCHAR(255) NOT NULL,
	city VARCHAR(64) NOT NULL,
	state VARCHAR(32) NOT NULL,
	bday DATE NOT NULL,
	gender CHAR(1) NOT NULL,
	password VARCHAR(64) NOT NULL,
	PRIMARY KEY (id)
);
	
INSERT INTO users (first_name, last_name, email, city, state, bday, gender, password)
VALUES ('Some', 'Person', 'test@test.com', 'seattle', 'WA', '1/1/1990', 'M', 'password');

DROP TABLE IF EXISTS events;

CREATE TABLE events(
	id INT PRIMARY KEY AUTO_INCREMENT,
	title VARCHAR(64) NOT NULL,
	description VARCHAR(1024) NOT NULL,
	address VARCHAR(64) NOT NULL,
	city VARCHAR(64) NOT NULL,
	state VARCHAR(32) NOT NULL,
	zip VARCHAR(32) NOT NULL,
	startDate DATE,
	endDate DATE,
	startTime TIME,
	endTime TIME,
	upperAge INT,
	lowerAge INT,
	gender VARCHAR(16)
);