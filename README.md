# MXT - Manutenção e Administração de Reparações

## Esquema da Base de Dados

### Descrição

O esquema da base de dados abaixo descreve a estrutura das tabelas utilizadas na aplicação.

### Tabelas

#### Users

```sql
CREATE TABLE Users (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(255),
    Password VARCHAR(255),
    UserType ENUM('Chefe', 'Administrador', 'Funcionário') NOT NULL,
    IsActive BOOLEAN,
    CreatedAt DATETIME,
    LastLogin DATETIME
);
```

#### Employees

```sql
CREATE TABLE Employees (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT UNIQUE,
    FullName VARCHAR(255),
    Email VARCHAR(255),
    Department VARCHAR(255),
    FOREIGN KEY (UserID) REFERENCES Users(ID)
);
```

#### Clients

```sql
CREATE TABLE Clients (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255),
    Description TEXT,
    CreatedByUserID INT,
    CreationDate DATETIME,
    LastModifiedByUserID INT,
    LastModifiedDateTime DATETIME,
    FOREIGN KEY (CreatedByUserID) REFERENCES Users(ID),
    FOREIGN KEY (LastModifiedByUserID) REFERENCES Users(ID)
);
```

#### ClientContacts

```sql
CREATE TABLE ClientContacts (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    ClientID INT,
    ContactType ENUM('E-mail', 'Telefone', 'Telemóvel', 'Outro') NOT NULL,
    Contact VARCHAR(255),
    Description TEXT,
    CreatedByUserID INT,
    CreationDate DATETIME,
    LastModifiedByUserID INT,
    LastModifiedDateTime DATETIME,
    FOREIGN KEY (ClientID) REFERENCES Clients(ID),
    FOREIGN KEY (CreatedByUserID) REFERENCES Users(ID),
    FOREIGN KEY (LastModifiedByUserID) REFERENCES Users(ID)
);
```

#### ClientAddresses

```sql
CREATE TABLE ClientAddresses (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    ClientID INT,
    Country VARCHAR(255),
    City VARCHAR(255),
    Locality VARCHAR(255),
    Address TEXT,
    PostalCode VARCHAR(20),
    CreatedByUserID INT,
    CreationDate DATETIME,
    LastModifiedByUserID INT,
    LastModifiedDateTime DATETIME,
    FOREIGN KEY (ClientID) REFERENCES Clients(ID),
    FOREIGN KEY (CreatedByUserID) REFERENCES Users(ID),
    FOREIGN KEY (LastModifiedByUserID) REFERENCES Users(ID)
);
```

#### ClientInteractionsHistory

```sql
CREATE TABLE ClientInteractionsHistory (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    ClientID INT,
    InteractionDateTime DATETIME,
    InteractionType VARCHAR(255),
    Details TEXT,
    ResponsibleUserID INT,
    FOREIGN KEY (ClientID) REFERENCES Clients(ID),
    FOREIGN KEY (ResponsibleUserID) REFERENCES Users(ID)
);
```
