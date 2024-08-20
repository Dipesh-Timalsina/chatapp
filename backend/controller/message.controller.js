import Conversation from "../model/conversation.model.js";
import Message from "../model/message.model.js";
import {verifyToken}  from "../utils/generateToken.js";



export const sendMessage = async (req, res) => {
  // console.log("Message sent:", req.params.id);
  // console.log("User:", req.user);
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, receiverId],
      },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
        conversation.messages.push(newMessage._id);
        //sockect io functionality here



        // this will run one after another
        // await conversation.save();
        // await newMessage.save();

        //this will be run in parallel
        await Promise.all([conversation.save(), newMessage.save()]);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sending message:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


const extractToken = (req) => {
  const tokenFromCookies = req.cookies.jwt;
  const tokenFromHeaders =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  // console.log("Token from cookies:", tokenFromCookies);
  // console.log("Token from headers:", tokenFromHeaders);

  const extractedToken = tokenFromCookies || tokenFromHeaders;
  console.log("Extracted Token:", extractedToken);
  return extractedToken;
};


// export const getMessages = async (req, res) => {
//   try {
//     const { id : userToChatId} = req.params;
//     const senderId = req.user._id;

//     const conversation = await Conversation.findOne({
//       participants: {
//         $all: [senderId, userToChatId],
//       }, 
//     }).populate("messages");
//     res.status(200).json(conversation.messages);
//     if (!conversation) {
//       res.status(200).json([]);
//       const messages = conversation.messages;
//       res.status(200).json(messages);
//     } else {
//       res.status(200).json([]);
//     }
        
//     } catch (error) {
//           console.log("Error in sending message:", error.message);
//           res.status(500).json({ error: "Internal server error" });
//     }


// }

export const getMessages = async (req, res) => {
  try {
    const token = extractToken(req);
    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id: userToChatId } = req.params;
    const senderId = decodedToken.userId;

    const conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, userToChatId],
      },
    }).populate("messages");
    // Debugging: Log the conversation and messages
    console.log("Conversation found:", conversation);
    console.log(
      "Messages:",
      conversation ? conversation.messages : "No messages found"
    );

    if (conversation) {
      res.status(200).json(conversation.messages);
    } else {
      res.status(200).json([]); // No conversation found
    }
  } catch (error) {
    console.error("Error in getMessages controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

