import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use(errorHandler);

export default app;
