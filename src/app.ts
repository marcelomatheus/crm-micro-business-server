import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./swagger";
import authRouter from "./routes/auth-route";
import "dotenv/config";
const app = express();
const port = 3000;
import cors from "cors";
app.use(
    cors({
        credentials: true,
        origin: 'http://localhost:3001'
    })
)

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/auth", authRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(port, () => {
  return console.log(`Server running at http://localhost:${port}`);
});
