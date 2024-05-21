-- Create the "mxt" database with the time zone set to Portugal
CREATE DATABASE IF NOT EXISTS mxt CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the "mxt" database
USE mxt;

-- Set the default time zone to Portugal
SET time_zone = '+00:00';

-- Table company
CREATE TABLE IF NOT EXISTS company (
    enforce_one_row ENUM('only') NOT NULL PRIMARY KEY DEFAULT 'only',
    name VARCHAR(255),
    address VARCHAR(255),
    city VARCHAR(255),
    country VARCHAR(255),
    postal_code VARCHAR(20),
    phone_number VARCHAR(20),
    email VARCHAR(255),
    logo VARCHAR(50),
    created_at_datetime DATETIME NOT NULL
);

-- Table users
CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    avatar VARCHAR(50),
    role ENUM('Chefe', 'Administrador', 'Funcionário') NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at_datetime DATETIME NOT NULL
);

-- Table users
CREATE TABLE IF NOT EXISTS user_otp_codes (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    otp_code VARCHAR(10) NOT NULL,
    is_used BOOLEAN NOT NULL DEFAULT false,
    created_at_datetime DATETIME NOT NULL,
    expiration_datetime DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table employees
CREATE TABLE IF NOT EXISTS employees (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    name VARCHAR(255),
    phone_number VARCHAR(20),
    country VARCHAR(255),
    city VARCHAR(255),
    locality VARCHAR(255),
    address TEXT,
    postal_code VARCHAR(20),
    description TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table clients
CREATE TABLE IF NOT EXISTS clients (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    description TEXT,
    created_by_user_id INT,
    created_at_datetime DATETIME,
    last_modified_by_user_id INT,
    last_modified_datetime DATETIME,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (last_modified_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table client_contacts
CREATE TABLE IF NOT EXISTS client_contacts (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    client_id INT,
    type ENUM('E-mail', 'Telefone', 'Telemóvel', 'Outro') NOT NULL,
    contact VARCHAR(255),
    description TEXT,
    created_by_user_id INT,
    created_at_datetime DATETIME,
    last_modified_by_user_id INT,
    last_modified_datetime DATETIME,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (last_modified_by_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table client_addresses
CREATE TABLE IF NOT EXISTS client_addresses (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    client_id INT,
    country VARCHAR(255),
    city VARCHAR(255),
    locality VARCHAR(255),
    address TEXT,
    postal_code VARCHAR(20),
    created_by_user_id INT,
    created_at_datetime DATETIME,
    last_modified_by_user_id INT,
    last_modified_datetime DATETIME,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (last_modified_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table client_interactions_history
CREATE TABLE IF NOT EXISTS client_interactions_history (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    client_id INT,
    created_at_datetime DATETIME,
    type VARCHAR(255),
    details TEXT,
    responsible_user_id INT,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (responsible_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table emails
CREATE TABLE IF NOT EXISTS emails (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    api_id VARCHAR(255) NOT NULL,
    client_id INT,
    subject VARCHAR(255),
    sent_by_user_id INT,
    created_at_datetime DATETIME NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
    FOREIGN KEY (sent_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table smses
CREATE TABLE IF NOT EXISTS smses (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    api_id VARCHAR(255) NOT NULL,
    client_id INT,
    message TEXT NOT NULL,
    sent_by_user_id INT,
    created_at_datetime DATETIME NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
    FOREIGN KEY (sent_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);