import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Leads Register",
    version: "1.0.0",
    description: "Documentation for the Leads Register API",
    contact: {
      name: "Marcelo Matheus",
      email: "marcelomatheusbr@gmai.com",
    },
  },
};

const options = {
  definition: swaggerDefinition,
  apis: ["./src/routes/*.ts", "./src/routes/*.js"], // Path to the API routes in your Node.js application
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
