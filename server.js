import express from "express";
import dotenv from "dotenv";
import authRoutes from "./backend/routes/auth.routes.js" // Ensure the file extension is included
import connectToMongoDB from "./backend/DB/connectToMongoDB.js";

const app = express();
dotenv.config();
app.use(express.json());
const PORT = process.env.PORT || 5000;



// app.get("/", (req, res) => {
//   res.send("Hello chat app");
// });

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    connectToMongoDB();
  console.log(`The server is listening on port ${PORT}...`);
});
