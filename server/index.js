import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/users.js";
import taskRoutes from "./routes/tasks.js";
import errorHandler from "./utils/errorHandler.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 4044;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many login attempts. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

//middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://your-frontend.vercel.app"],
    credentials: true,
  }),
);
app.use(helmet());

app.get("/", (req, res) => {
  res.send("Welcome to Task Manager App.....");
});
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use(errorHandler);
app.use("/api/users/login", limiter);
app.use((req, res) => {
  res.status(404).send("Route not found");
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Connected to MONGODB");
      console.log("Server is running at port:", PORT);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error", error);
  });
