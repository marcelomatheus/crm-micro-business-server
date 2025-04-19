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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  }),
);

app.get("/", (req, res) => {
  const infoReq = req.hostname;
  res.send(
    `Server is running. You request origin is from ${infoReq}.\n Access the api documentation in http://localhost:3000/api-docs `,
  );
});

app.use("/auth", authRouter);
app.use("/customer", customersRouter);
app.use("/product-category", productCategoryRouter);
app.use("/product", productCategoryRouter);
app.use("/sale", salesRouter);
app.use("/user", userRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
