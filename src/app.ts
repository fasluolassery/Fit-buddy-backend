import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import adminRoutes from "./routes/admin.routes";
import passport from "./config/passport.config";

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://1m2c2xzp-5173.inc1.devtunnels.ms",
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).send("Page not found!");
});

app.use(errorHandler);

export default app;
