import User from "../model/user.model.js";
import bycryptjs from "bcryptjs"
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        console.log("Received data:", req.body);
        const { fullName, username, password, confirmPassword, gender } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({error:`Password doesnot matched`})

            
        }
        const user = await User.findOne({ username })
        if (user) {
           return  res.status(400).json({error:`Username Already exists`})
        }
        //hash password
        const salt = await bycryptjs.genSalt(10);
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl${username}`;

        const newUser = new User({
            fullName,
            username,
            password,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic
        })
        if (newUser) {

            // generate jwt token


            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic
            });
        } else {
            res.status(400).json({error:`invalid user data`})
        }
       
        
    } catch (error) {
        console.log(`Error in signup controller`,error.message);
        res.status(500).json({error:`internal server error`})
        
    }
}
export const login = async(req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        const isPasswordCorrect = await bycrypt.compare(password, user?.password || "")
        if (!user || !password) {
            return res.status(400).json({ error: `invalid username or password` });
        }
        generateTokenAndSetCookie(user._id, res);
        res.status(200).json({
          _id: newUser._id,
          fullName: newUser.fullName,
          username: newUser.username,
          profilePic: newUser.profilePic,
        });
       
    } catch(error) {
         console.log(`Error in signup controller`, error.message);
         res.status(500).json({ error: `internal server error` });
        
   }
}

export const logout = async (req, res) => {
    try {
        res.cookie('jwt', "", { maxAge: 0 });
        res.status(200).json({message:`Logged out successfully`})
        
    } catch (error) {
        console.log(`Error in logout controller`, error.message);
        res.status(500).json({ error: `internal server error` });
    }
  
}