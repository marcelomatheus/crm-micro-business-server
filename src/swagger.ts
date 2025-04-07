import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  info: {
    contact: {
      email: "marcelomatheusbr@gmai.com",
      name: "Marcelo Matheus",
    },
    description: "Documentation for the Customers Register API",
    title: "Customers CRM",
    version: "1.0.0",
  },
  openapi: "3.0.0",
};

const options = {
  apis: ["./src/routes/*.ts", "./src/routes/*.js"], // Path to the API routes in your Node.js application
  definition: swaggerDefinition,
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
