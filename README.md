# MXT - Manutenção e Administração de Reparações

## Esquema da Base de Dados

### Descrição

O esquema da base de dados abaixo descreve a estrutura das tabelas utilizadas na aplicação.

### Tabelas

#### Clients

- **ID**: Identificador único do cliente (Chave Primária).
- **Name**: Nome do cliente.
- **Description**: Descrição adicional sobre o cliente.
- **CreatedBy**: ID do usuário que criou o registro.
- **CreationDate**: Data e hora de criação do registro.
- **LastModifiedBy**: ID do usuário que realizou a última modificação.
- **LastModifiedDate**: Data e hora da última modificação.
- **Foreign Keys**: `CreatedBy` e `LastModifiedBy` referenciam a tabela `Users`.

#### ClientContacts

- **ID**: Identificador único do contato (Chave Primária).
- **ClientID**: ID do cliente associado (Chave Estrangeira).
- **ContactType**: Tipo de contato (telefone, e-mail, etc.).
- **ContactDetails**: Detalhes do contato.
- **CreatedBy**: ID do usuário que criou o registro.
- **CreationDate**: Data e hora de criação do registro.
- **LastModifiedBy**: ID do usuário que realizou a última modificação.
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
- **CreatedBy**: ID do usuário que criou o registro.
- **CreationDate**: Data e hora de criação do registro.
- **LastModifiedBy**: ID do usuário que realizou a última modificação.
- **LastModifiedDate**: Data e hora da última modificação.
- **Foreign Keys**: `ClientID`, `CreatedBy` e `LastModifiedBy` referenciam a tabela `Clients` e `Users`.

#### InteractionsHistory

- **ID**: Identificador único da interação (Chave Primária).
- **ClientID**: ID do cliente associado (Chave Estrangeira).
- **InteractionDateTime**: Data e hora da interação.
- **InteractionType**: Tipo de interação (consulta em loja, mudança de dados do cliente, etc.).
- **Details**: Detalhes adicionais sobre a interação.
- **ResponsibleUser**: ID do usuário responsável pela interação.
- **Foreign Keys**: `ClientID` e `ResponsibleUser` referenciam a tabela `Clients` e `Users`.
