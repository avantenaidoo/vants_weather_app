// backend/server/src/server.ts
import express from "express";
import cors from "cors";
import { logErrors, logEvents, logRequests } from "./middleware/logEvents.js";
import apiRoutes from "./routes/apiRoutes.js";
import { config } from "../../../api/config.js";
import limiter from "./middleware/rateLimiter.js";

const app = express();

app.set("trust proxy", 1);
app.use("/api/", limiter);
app.use(express.json());

app.use(async (req, res, next) => {
  res.on("finish", async () => {
    await logEvents("Received request for weather data.");
  });
  next();
});

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://your-vercel-app.vercel.app"
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type, Authorization",
  maxAge: 600
}));

app.use(logRequests);
app.use("/api", apiRoutes);

app.get("/", (_req, res) => {
  res.send("Welcome to the Weather App!");
});

app.all("*", logErrors);

// ✅ Start server for local dev only
if (process.env.NODE_ENV !== "production") {
  const PORT = config.port || 5000;
  app.listen(PORT, () => {
    console.log(`Server running locally at http://localhost:${PORT}`);
  });
}

export default app;
