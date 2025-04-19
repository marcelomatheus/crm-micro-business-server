import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  components: {
    securitySchemes: {
      bearerAuth: {
        bearerFormat: "JWT",
        scheme: "bearer",
        type: "http",
      },
    },
  },
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
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  apis: ["./src/routes/*.ts", "./src/routes/*.js"],
  definition: swaggerDefinition,
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
