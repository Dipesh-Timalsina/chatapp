import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./backend/routes/auth.routes.js" // Ensure the file extension is included
import messageRoutes from "./backend/routes/message.routes.js" // Ensure the file extension is included
import userRoutes from "./backend/routes/user.route.js" // Ensure the file extension is included
import connectToMongoDB from "./backend/DB/connectToMongoDB.js";
import protectRoute from "./backend/middleware/protectRoutes.js";

const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use("/api/protected",  protectRoute);
const PORT = process.env.PORT || 5000;



// app.get("/", (req, res) => {
//   res.send("Hello chat app");
// });

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes); 
app.use("/api/users", userRoutes); 

app.listen(PORT, () => {
    connectToMongoDB();
  console.log(`The server is listening on port ${PORT}...`);
});
