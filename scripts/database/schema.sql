-- Create the "mxt" database
CREATE DATABASE IF NOT EXISTS mxt CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the "mxt" database
USE mxt;

-- Set the default time zone to UTC
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
    created_at_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
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
    created_by_user_id INT,
    created_at_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table user_otp_codes
CREATE TABLE IF NOT EXISTS user_otp_codes (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    otp_code VARCHAR(10) NOT NULL,
    is_used BOOLEAN NOT NULL DEFAULT false,
    created_at_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expiration_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
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
    created_at_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_modified_by_user_id INT,
    last_modified_datetime TIMESTAMP NULL,
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
    created_at_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_modified_by_user_id INT,
    last_modified_datetime TIMESTAMP NULL,
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
    created_at_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_modified_by_user_id INT,
    last_modified_datetime TIMESTAMP NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (last_modified_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table client_interactions_history
CREATE TABLE IF NOT EXISTS client_interactions_history (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    client_id INT,
    type VARCHAR(255),
    details TEXT,
    responsible_user_id INT,
    created_at_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
    created_at_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
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
    created_at_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
    FOREIGN KEY (sent_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table equipment_brands
CREATE TABLE IF NOT EXISTS equipment_brands (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Table equipment_types
CREATE TABLE IF NOT EXISTS equipment_types (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Table equipment_models
CREATE TABLE IF NOT EXISTS equipment_models (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    brand_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (brand_id) REFERENCES equipment_brands(id) ON DELETE CASCADE,
    UNIQUE (brand_id, name)
);

-- Table equipments
CREATE TABLE IF NOT EXISTS equipments (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    client_id INT NOT NULL,
    brand_id INT NOT NULL,
    model_id INT NOT NULL,
    type_id INT NOT NULL,
    sn VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_by_user_id INT,
    created_at_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_modified_by_user_id INT,
    last_modified_datetime TIMESTAMP NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (brand_id) REFERENCES equipment_brands(id) ON DELETE RESTRICT,
    FOREIGN KEY (model_id) REFERENCES equipment_models(id) ON DELETE RESTRICT,
    FOREIGN KEY (type_id) REFERENCES equipment_types(id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (last_modified_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table equipment_attachments
CREATE TABLE IF NOT EXISTS equipment_attachments (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    equipment_id INT NOT NULL,
    file VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    type ENUM('image', 'document') NOT NULL,
    uploaded_by_user_id INT,
    uploaded_at_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (equipment_id) REFERENCES equipments(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table equipment_interactions_history
CREATE TABLE IF NOT EXISTS equipment_interactions_history (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    equipment_id INT NOT NULL,
    type VARCHAR(255),
    details TEXT,
    responsible_user_id INT,
    created_at_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (equipment_id) REFERENCES equipments(id) ON DELETE CASCADE,
    FOREIGN KEY (responsible_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes
-- Table users
CREATE INDEX idx_users_created_at ON users (created_at_datetime);

-- Table clients
CREATE INDEX idx_clients_created_at ON clients (created_at_datetime);
CREATE INDEX idx_clients_last_modified ON clients (last_modified_datetime);
CREATE INDEX idx_client_interactions_created_at ON client_interactions_history (created_at_datetime);
CREATE INDEX idx_client_contacts_created_at ON client_contacts (created_at_datetime);
CREATE INDEX idx_client_addresses_created_at ON client_addresses (created_at_datetime);

-- Table emails
CREATE INDEX idx_emails_created_at ON emails (created_at_datetime);

-- Table smses
CREATE INDEX idx_smses_created_at ON smses (created_at_datetime);

-- Table equipments
CREATE INDEX idx_equipments_created_at ON equipments (created_at_datetime);
CREATE INDEX idx_equipments_last_modified ON equipments (last_modified_datetime);
CREATE INDEX idx_equipment_interactions_created_at ON equipment_interactions_history (created_at_datetime);
