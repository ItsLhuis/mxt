# MXT - Manutenção e Administração de Reparações

## Esquema da Base de Dados

### Descrição

O esquema da base de dados abaixo descreve a estrutura das tabelas utilizadas na aplicação.

### Tabelas

#### Clients

- **ID**: Identificador único do cliente (Chave Primária).
- **Name**: Nome do cliente.
- **Description**: Descrição adicional sobre o cliente.
- **CreatedBy**: ID do utilizador que criou o registro.
- **CreationDate**: Data e hora de criação do registro.
- **LastModifiedBy**: ID do utilizador que realizou a última modificação.
- **LastModifiedDate**: Data e hora da última modificação.
- **Foreign Keys**: `CreatedBy` e `LastModifiedBy` referenciam a tabela `Users`.

#### ClientContacts

- **ID**: Identificador único do contacto (Chave Primária).
- **ClientID**: ID do cliente associado (Chave Estrangeira).
- **ContactType**: Tipo de contacto (E-mail, Telefone, Telemóvel, Outro, etc.) [ENUMERAÇÃO].
- **ContactDetails**: Detalhes do contacto.
- **CreatedBy**: ID do utilizador que criou o registro.
- **CreationDate**: Data e hora de criação do registro.
- **LastModifiedBy**: ID do utilizador que realizou a última modificação.
- **LastModifiedDate**: Data e hora da última modificação.
- **Foreign Keys**: `ClientID`, `CreatedBy` e `LastModifiedBy` referenciam a tabela `Clients` e `Users`.

#### ClientAddresses

- **ID**: Identificador único do endereço (Chave Primária).
- **ClientID**: ID do cliente associado (Chave Estrangeira).
- **Country**: País do endereço.
- **City**: Cidade do endereço.
- **Locality**: Localidade do endereço.
- **Address**: Endereço completo.
- **PostalCode**: Código postal.
- **CreatedBy**: ID do utilizador que criou o registro.
- **CreationDate**: Data e hora de criação do registro.
- **LastModifiedBy**: ID do utilizador que realizou a última modificação.
- **LastModifiedDate**: Data e hora da última modificação.
- **Foreign Keys**: `ClientID`, `CreatedBy` e `LastModifiedBy` referenciam a tabela `Clients` e `Users`.

#### ClientInteractionsHistory

- **ID**: Identificador único da interação (Chave Primária).
- **ClientID**: ID do cliente associado (Chave Estrangeira).
- **InteractionDateTime**: Data e hora da interação.
- **InteractionType**: Tipo de interação ('Novo Contacto Adicionado', 'Endereço Atualizado', etc.).
- **Details**: Detalhes adicionais sobre a interação.
- **ResponsibleUser**: ID do utilizador responsável pela interação.
- **Foreign Keys**: `ClientID` e `ResponsibleUser` referenciam a tabela `Clients` e `Users`.
