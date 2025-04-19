import express from "express";
import swaggerUi from "swagger-ui-express";

import authRouter from "./routes/auth-routes";
import swaggerDocs from "./swagger";

import "dotenv/config";
const app = express();
const port = 3000;
import cors from "cors";

import { errorHandler } from "./middlewares/error-handler";
import customersRouter from "./routes/customers-routes";
import productCategoryRouter from "./routes/product-category-routes";
import salesRouter from "./routes/sales-routes";
import userRouter from "./routes/users-routes";

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
app.use("/customer", customersRouter);
app.use("/product-category", productCategoryRouter);
app.use("/product", productCategoryRouter);
app.use("/sale", salesRouter);
app.use("/user", userRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
