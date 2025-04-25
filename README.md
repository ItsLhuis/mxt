# mxt

The **mxt** application is a comprehensive equipment repair and service management system designed
for repair shops and technical service providers. It enables efficient management of clients,
equipment, repairs, and service history while providing robust user access control and communication
features.

## Features

### User Management

- Role-based access control with hierarchical user types: Chief, Administrator, and Employee
- Secure authentication with OTP capability
- User profile management with avatars

### Client Management

- Detailed client records with multiple contact methods and addresses
- Client interaction history tracking
- Integrated communication with email and SMS capabilities

### Equipment Management

- Complete equipment inventory with type, brand, and model categorization
- Equipment service history tracking
- File and image attachments for documentation
- Serial number tracking

### Repair Management

- Comprehensive repair workflow from entry to delivery
- Status tracking with customizable repair statuses
- Detailed documentation of repairs including:
  - Entry accessories and reported issues
  - Intervention works and accessories used
  - File attachments for repair documentation
- Client notification system

### Company Profile

- Company information management
- Company branding with logo support

## Requirements

To run the application, ensure you have the following installed:

- Node.js version 16.x or higher
- MySQL database
- A `.env` file with the required environment variables

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

- Create a `.env` file in the root directory
- Add the required environment variables as specified in `.env.example`
- Ensure your database connection details are correctly configured

4. Build the client application:

   ```bash
   npm run build-client
   ```

## Database Setup

The application requires a MySQL database with the correct schema. You'll need to:

1. Create a MySQL database
2. Execute the `scripts/database/schema.sql` script
3. Configure the database connection in your `.env` file

## Running the Application

To start the application, use the following command:

```bash
npm start
```

The application will be available at `http://localhost:<port>` (default port is specified in the
`.env` file).

## Key Features Explained

### Repair Workflow

The system supports a complete repair workflow:

1. Equipment check-in with accessories and reported issues documentation
2. Status tracking throughout the repair process
3. Detailed repair intervention documentation
4. Repair completion and client notification
5. Equipment delivery

### Communication

The system includes integrated communication features:

- Email notifications to clients
- SMS messaging capability
- Communication history tracking

### Historical Records

All interactions with clients, equipment, and repairs are tracked with timestamps and user
attribution, providing a complete audit trail.
