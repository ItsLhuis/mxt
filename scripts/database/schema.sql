-- Criar a base de dados "mxt"
CREATE DATABASE IF NOT EXISTS mxt;

-- Usar a base de dados "mxt"
USE mxt;

-- Tabela users
CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role ENUM('Chefe', 'Administrador', 'Funcionário') NOT NULL,
    is_active BOOLEAN,
    created_at_datetime DATETIME NOT NULL,
    last_login_datetime DATETIME
);

-- Tabela employees
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

-- Tabela clients
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

-- Tabela client_contacts
CREATE TABLE IF NOT EXISTS client_contacts (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    client_id INT,
    contact_type ENUM('E-mail', 'Telefone', 'Telemóvel', 'Outro') NOT NULL,
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

-- Tabela client_addresses
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

-- Tabela client_interactions_history
CREATE TABLE IF NOT EXISTS client_interactions_history (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    client_id INT,
    interaction_datetime DATETIME,
    interaction_type VARCHAR(255),
    details TEXT,
    responsible_user_id INT,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (responsible_user_id) REFERENCES users(id) ON DELETE SET NULL
);
