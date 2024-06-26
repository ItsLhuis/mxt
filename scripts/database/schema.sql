-- Create the "mxt" database
CREATE DATABASE IF NOT EXISTS mxt CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the "mxt" database
USE mxt;

-- Table: company
CREATE TABLE IF NOT EXISTS company (
    enforce_one_row ENUM('only') NOT NULL PRIMARY KEY DEFAULT 'only',
    name VARCHAR(255),
    address VARCHAR(255),
    city VARCHAR(255),
    locality VARCHAR(255),
    country VARCHAR(255),
    postal_code VARCHAR(20),
    phone_number VARCHAR(20),
    email VARCHAR(255),
    logo MEDIUMBLOB,
    logo_mime_type VARCHAR(50),
    logo_file_size INT,
    created_at_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    role ENUM('Chefe', 'Administrador', 'Funcionário') NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    avatar MEDIUMBLOB,
    avatar_mime_type VARCHAR(50),
    avatar_file_size INT,
    created_by_user_id INT,
    created_at_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table: user_otp_codes
CREATE TABLE IF NOT EXISTS user_otp_codes (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    otp_code VARCHAR(10) NOT NULL,
    is_used BOOLEAN NOT NULL DEFAULT false,
    created_at_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expiration_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table: employees
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

-- Table: clients
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

-- Table: client_contacts
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

-- Table: client_addresses
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

-- Table: client_interactions_history
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

-- Table: emails
CREATE TABLE IF NOT EXISTS emails (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    api_id VARCHAR(255) NOT NULL,
    client_id INT,
    contact VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    sent_by_user_id INT,
    created_at_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
    FOREIGN KEY (sent_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table: smses
CREATE TABLE IF NOT EXISTS smses (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    api_id VARCHAR(255) NOT NULL,
    client_id INT,
    contact VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    sent_by_user_id INT,
    created_at_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
    FOREIGN KEY (sent_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table: equipment_brands
CREATE TABLE IF NOT EXISTS equipment_brands (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_by_user_id INT,
    created_at_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_modified_by_user_id INT,
    last_modified_datetime TIMESTAMP NULL,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (last_modified_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table: equipment_models
CREATE TABLE IF NOT EXISTS equipment_models (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    brand_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_by_user_id INT,
    created_at_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_modified_by_user_id INT,
    last_modified_datetime TIMESTAMP NULL,
    FOREIGN KEY (brand_id) REFERENCES equipment_brands(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (last_modified_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE (brand_id, name)
);

-- Table: equipment_types
CREATE TABLE IF NOT EXISTS equipment_types (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_by_user_id INT,
    created_at_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_modified_by_user_id INT,
    last_modified_datetime TIMESTAMP NULL,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (last_modified_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table: equipments
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

-- Table: equipment_attachments
CREATE TABLE IF NOT EXISTS equipment_attachments (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    equipment_id INT NOT NULL,
    file MEDIUMBLOB,
    file_mime_type VARCHAR(50),
    file_size INT,
    original_filename VARCHAR(255) NOT NULL,
    type ENUM('image', 'document') NOT NULL,
    uploaded_by_user_id INT,
    uploaded_at_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (equipment_id) REFERENCES equipments(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table: equipment_interactions_history
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

-- Table: repair_status
CREATE TABLE IF NOT EXISTS repair_status (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_by_user_id INT,
    created_at_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_modified_by_user_id INT,
    last_modified_datetime TIMESTAMP NULL,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (last_modified_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table: repairs
CREATE TABLE IF NOT EXISTS repairs (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    equipment_id INT NOT NULL,
    status_id INT NOT NULL,
    equipment_os_password VARCHAR(255),
    equipment_bios_password VARCHAR(255),
    entry_accessories_description TEXT,
    entry_reported_issues_description TEXT,
    entry_description TEXT,
    entry_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    intervention_works_done_description TEXT,
    intervention_accessories_used_description TEXT,
    intervention_description TEXT,
    conclusion_datetime TIMESTAMP NULL,
    delivery_datetime TIMESTAMP NULL,
    is_client_notified BOOLEAN NOT NULL DEFAULT false,
    created_by_user_id INT,
    created_at_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_modified_by_user_id INT,
    last_modified_datetime TIMESTAMP NULL,
    FOREIGN KEY (equipment_id) REFERENCES equipments(id) ON DELETE CASCADE,
    FOREIGN KEY (status_id) REFERENCES repair_status(id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (last_modified_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table: repair_entry_accessories_options
CREATE TABLE IF NOT EXISTS repair_entry_accessories_options (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_by_user_id INT,
    created_at_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_modified_by_user_id INT,
    last_modified_datetime TIMESTAMP NULL,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (last_modified_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table: repair_entry_reported_issues_options
CREATE TABLE IF NOT EXISTS repair_entry_reported_issues_options (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_by_user_id INT,
    created_at_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_modified_by_user_id INT,
    last_modified_datetime TIMESTAMP NULL,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (last_modified_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table: repair_intervention_works_done_options
CREATE TABLE IF NOT EXISTS repair_intervention_works_done_options (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_by_user_id INT,
    created_at_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_modified_by_user_id INT,
    last_modified_datetime TIMESTAMP NULL,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (last_modified_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table: repair_intervention_accessories_used_options
CREATE TABLE IF NOT EXISTS repair_intervention_accessories_used_options (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_by_user_id INT,
    created_at_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_modified_by_user_id INT,
    last_modified_datetime TIMESTAMP NULL,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (last_modified_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table: repair_entry_accessories
CREATE TABLE IF NOT EXISTS repair_entry_accessories (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    repair_id INT NOT NULL,
    accessory_option_id INT,
    FOREIGN KEY (repair_id) REFERENCES repairs(id) ON DELETE CASCADE,
    FOREIGN KEY (accessory_option_id) REFERENCES repair_entry_accessories_options(id) ON DELETE RESTRICT,
    UNIQUE (repair_id, accessory_option_id)
);

-- Table: repair_entry_reported_issues
CREATE TABLE IF NOT EXISTS repair_entry_reported_issues (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    repair_id INT NOT NULL,
    reported_issue_option_id INT,
    FOREIGN KEY (repair_id) REFERENCES repairs(id) ON DELETE CASCADE,
    FOREIGN KEY (reported_issue_option_id) REFERENCES repair_entry_reported_issues_options(id) ON DELETE RESTRICT,
    UNIQUE (repair_id, reported_issue_option_id)
);

-- Table: repair_intervention_works_done
CREATE TABLE IF NOT EXISTS repair_intervention_works_done (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    repair_id INT NOT NULL,
    work_done_option_id INT,
    FOREIGN KEY (repair_id) REFERENCES repairs(id) ON DELETE CASCADE,
    FOREIGN KEY (work_done_option_id) REFERENCES repair_intervention_works_done_options(id) ON DELETE RESTRICT,
    UNIQUE (repair_id, work_done_option_id)
);

-- Table: repair_intervention_accessories_used
CREATE TABLE IF NOT EXISTS repair_intervention_accessories_used (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    repair_id INT NOT NULL,
    accessories_used_option_id INT,
    FOREIGN KEY (repair_id) REFERENCES repairs(id) ON DELETE CASCADE,
    FOREIGN KEY (accessories_used_option_id) REFERENCES repair_intervention_accessories_used_options(id) ON DELETE RESTRICT,
    UNIQUE (repair_id, accessories_used_option_id)
);

-- Table: repair_attachments
CREATE TABLE IF NOT EXISTS repair_attachments (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    repair_id INT NOT NULL,
    file MEDIUMBLOB,
    file_mime_type VARCHAR(50),
    file_size INT,
    original_filename VARCHAR(255) NOT NULL,
    type ENUM('image', 'document') NOT NULL,
    uploaded_by_user_id INT,
    uploaded_at_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (repair_id) REFERENCES repairs(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table: repair_interactions_history
CREATE TABLE IF NOT EXISTS repair_interactions_history (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    repair_id INT NOT NULL,
    type VARCHAR(255),
    details TEXT,
    responsible_user_id INT,
    created_at_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (repair_id) REFERENCES repairs(id) ON DELETE CASCADE,
    FOREIGN KEY (responsible_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes
-- Table: users
CREATE INDEX idx_users_created_at ON users (created_at_datetime);

-- Table: clients
CREATE INDEX idx_clients_created_at ON clients (created_at_datetime);
CREATE INDEX idx_clients_last_modified ON clients (last_modified_datetime);
CREATE INDEX idx_client_contacts_created_at ON client_contacts (created_at_datetime);
CREATE INDEX idx_client_addresses_created_at ON client_addresses (created_at_datetime);
CREATE INDEX idx_client_interactions_created_at ON client_interactions_history (created_at_datetime);

-- Table: emails
CREATE INDEX idx_emails_created_at ON emails (created_at_datetime);

-- Table: smses
CREATE INDEX idx_smses_created_at ON smses (created_at_datetime);

-- Table: equipments
CREATE INDEX idx_equipments_created_at ON equipments (created_at_datetime);
CREATE INDEX idx_equipments_last_modified ON equipments (last_modified_datetime);
CREATE INDEX idx_equipment_brands_name ON equipment_brands (name);
CREATE INDEX idx_equipment_models_name ON equipment_models (name);
CREATE INDEX idx_equipment_types_name ON equipment_types (name);
CREATE INDEX idx_equipment_interactions_created_at ON equipment_interactions_history (created_at_datetime);

-- Table: repairs
CREATE INDEX idx_repairs_created_at ON repairs (created_at_datetime);
CREATE INDEX idx_repairs_last_modified ON repairs (last_modified_datetime);
CREATE INDEX idx_repairs_entry_datetime ON repairs (entry_datetime);
CREATE INDEX idx_repairs_conclusion_datetime ON repairs (conclusion_datetime);
CREATE INDEX idx_repairs_delivery_datetime ON repairs (delivery_datetime);

CREATE INDEX idx_repair_interactions_created_at ON repair_interactions_history (created_at_datetime);

CREATE INDEX idx_repair_attachments_uploaded_at ON repair_attachments (uploaded_at_datetime);

CREATE INDEX idx_repair_entry_accessories_repair_id ON repair_entry_accessories (repair_id);
CREATE INDEX idx_repair_entry_accessories_option_id ON repair_entry_accessories (accessory_option_id);

CREATE INDEX idx_repair_entry_reported_issues_repair_id ON repair_entry_reported_issues (repair_id);
CREATE INDEX idx_repair_entry_reported_issues_option_id ON repair_entry_reported_issues (reported_issue_option_id);

CREATE INDEX idx_repair_intervention_works_done_repair_id ON repair_intervention_works_done (repair_id);
CREATE INDEX idx_repair_intervention_works_done_option_id ON repair_intervention_works_done (work_done_option_id);

CREATE INDEX idx_repair_intervention_accessories_used_repair_id ON repair_intervention_accessories_used (repair_id);
CREATE INDEX idx_repair_intervention_accessories_used_option_id ON repair_intervention_accessories_used (accessories_used_option_id);

CREATE INDEX idx_repair_entry_accessories_options_name ON repair_entry_accessories_options (name);
CREATE INDEX idx_repair_entry_reported_issues_options_name ON repair_entry_reported_issues_options (name);
CREATE INDEX idx_repair_intervention_works_done_options_name ON repair_intervention_works_done_options (name);
CREATE INDEX idx_repair_intervention_accessories_used_options_name ON repair_intervention_accessories_used_options (name)
