import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";

connectDB();

app.get("/", async (req, res) => {
  res.json({
    status: "ok",
    message: "message",
  });
});

app.listen(process.env.PORT, () =>
  console.log("Server running on port", process.env.PORT)
);
