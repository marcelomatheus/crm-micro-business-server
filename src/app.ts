import express from "express";
import swaggerUi from "swagger-ui-express";

import authRouter from "./controllers/auth-route";
import swaggerDocs from "./swagger";

import "dotenv/config";
const app = express();
const port = 3000;
import cors from "cors";

import { errorHandler } from "./middlewares/error-handler";

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3001",
  }),
);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/auth", authRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
