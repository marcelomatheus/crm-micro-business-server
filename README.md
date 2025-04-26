
# CRM for Micro and Small Businesses

This project is a **CRM (Customer Relationship Management)** built with **Node.js**, **TypeScript**, **Express**, **Prisma ORM**, and **Swagger** for API documentation.

## Description
The CRM is designed for micro and small businesses to manage their clients, products, and sales, all associated with a single user account.  
It provides a simple yet efficient way to organize customer relations and track sales activities.

The application uses a clear architecture with separated responsibilities:
- **Routes** expose the endpoints, apply a middleware for user authentication/authorization, and generate documentation via Swagger.
- **Controllers** validate the request content using **Zod** schemas.
- **Services** contain the business logic for clients, products, and sales management.

## Technologies Used
- `Node.js`
- `TypeScript`
- `Express`
- `Prisma ORM`
- `Swagger (API Documentation)`
- `Zod (Validation)`

## Folder Structure
```
src/
│
├─ routes/       # API routes
├─ controllers/  # Request validation and handling
├─ services/     # Business logic functions
├─ middlewares/  # Authentication and authorization
└─ config/       # Configuration files (Swagger, Prisma, etc.)
```

## Installation
1. Clone the repository:
```bash
git clone https://github.com/marcelomatheus/crm-micro-business-server.git
cd crm-micro-business-server
```

2. Install dependencies:
```bash
npm install
```

3. Pull the database schema (Prisma):
```bash
npx prisma db pull
```

4. Configure environment variables:
Create a `.env` file in the root directory and set the following variables:
```env
DATABASE_URL=<your_database_connection_string>
JWT_SECRET=<your_jwt_secret>
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
REDIRECT_URI=<your_google_redirect_uri>
```

## Running the Application
### Production
```bash
npm start
```

### Development
```bash
npm run dev
```

## API Documentation
Access the Swagger documentation at:
```
http://localhost:3000/api-docs
```

## Features
- Single user per account
- Manage clients
- Manage products
- Manage sales
- JWT Authentication
- Request validation with Zod
- API documentation with Swagger

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the [MIT License](LICENSE).
