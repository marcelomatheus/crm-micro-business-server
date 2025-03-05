# Authentication API

This project is an **Authentication API** built with **Node.js**, **TypeScript**, **Express**, **MongoDB**, **Prisma**, and **Swagger** for API documentation.

## Description
The API allows users to authenticate through email confirmation and Google login. It includes user registration, login, and email verification features.

## Technologies Used
- `Node.js`
- `TypeScript`
- `Express`
- `MongoDB`
- `Prisma ORM`
- `Swagger (API Documentation)`
- `Zod (Validation)`

## Folder Structure
```
src/
│
├─ routes/       # API routes
├─ services/     # Business logic functions
└─ config/       # Configuration files (Swagger, Prisma, etc.)
```

## Installation
1. Clone the repository:
```bash
git clone https://github.com/marcelomatheus/leads-register-server.git
cd leads-register-server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the root directory and set the following variables:
```env
DATABASE_URL=<mongodb://mongo_connection>
JWT_SECRET=<secret_key>
GOOGLE_CLIENT_ID=<google_client_id>
GOOGLE_CLIENT_SECRET=<google_client_secret>
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
- User Registration
- Email Confirmation
- User Login
- Google Login
- JWT Authentication
- Input Validation with Zod

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the [MIT License](LICENSE).

