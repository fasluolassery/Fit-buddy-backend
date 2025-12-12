import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/error.middleware";
import router from "./routes/auth.routes";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/auth", router);

app.use(errorHandler);

export default app;
