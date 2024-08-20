import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

// const protectRoute = async (req, res, next) => {
//     try {
//       console.log("Cookies:", req.cookies);
//       const token = req.cookies.jwt;
//       if (!token) {
//         return res
//           .status(401)
//           .json({ error: `Unauthorized - No token Provided` });
//       }

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       if (!decoded) {
//         return res.status(401).json({ error: `Unauthorized - Invalid token` });
//       }
//       const user = await User.findById(decoded.userId).select("-password");
//       if (!user) {
//         return res.status(404).json({ error: `User not found` });
//       }
//       req.user = user;
//       next();
//     } catch (error) {
//       console.error("Error in the protection middleware", error.message);
//       if (error.name === "TokenExpiredError") {
//         return res.status(401).json({ error: "Unauthorized - Token expired" });
//       } else if (error.name === "JsonWebTokenError") {
//         return res.status(401).json({ error: "Unauthorized - Invalid token" });
//       } else {
//         return res.status(500).json({ error: "Internal server error" });
//       }
//     }
// }

// export default protectRoute;

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];
    console.log("Token from cookies:", req.cookies.jwt);
    console.log("Token from headers:", req.headers.authorization);
    console.log("Extracted Token:", token);

    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default protectRoute;
