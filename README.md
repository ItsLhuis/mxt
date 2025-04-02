# mxt

## Overview

The mxt application is a robust platform designed to manage client and company data efficiently. It provides features such as client management, company validation, and integration with external APIs, ensuring a seamless workflow for businesses.

## Features

- Client management: Add, update, and delete client information.
- Company validation: Ensure company data is initialized and valid.
- API integration: Perform CRUD operations via RESTful endpoints.
- Secure authentication: Uses JWT for secure user authentication.
- Database management: Supports MySQL for data storage.

## Requirements

To run the application, ensure you have the following installed:

- Node.js version 16.x or higher.
- MySQL database.
- A `.env` file with the required environment variables.

## Installation and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/ItsLhuis/mxt
   cd mxt
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   - Create a `.env` file in the root directory.
   - Add the required environment variables as specified in `.env.example`.

4. Build the client application:
   ```bash
   npm run build-client
   ```

## Running the Application

To start the application, use the following command:

```bash
npm start
```

The application will be available at `http://localhost:<port>` (default port is specified in the `.env` file).
