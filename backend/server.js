import dotenv from "dotenv";
import connectDB from "./config/db.js";
import createApp from "./app.js";
import setupCrashHandlers from "./utils/crashHandlers.js";

dotenv.config();

setupCrashHandlers();

if (process.env.SKIP_DB !== "1") {
  connectDB();
}

const app = createApp();

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

//runingin
