import cloudinary from "../lib/cloudinary.js";
import Message from "../model/Message.js";
import User from "../model/User.js";

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    if (!loggedInUserId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password -__v");

    res.status(200).json({
      success: true,
      contacts: filteredUsers,
      count: filteredUsers.length,
    });
  } catch (error) {
    console.error("Error in getting All Contacts: ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // Find all messages where the logged-in user is sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });

    // If user has no messages
    if (!messages.length) {
      return res.status(200).json([]);
    }

    // Extract unique chat partner IDs
    const chatPartnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      ),
    ];

    // Fetch the chat partners
    const chatPartners = await User.find({
      _id: { $in: chatPartnerIds },
    }).select("-password");

    res.status(200).json(chatPartners);
  } catch (error) {
    console.error("Error in getChatPartners:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;

    // Me and you. Either I send you or you send me the message
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error working: ", error.messages);
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required" });
    }
    // if(senderId.equals(receiverId)){
    //     return res.status(400).json({message: "Cannot send messages to yourself"})
    // }
    const receiverExists = await User.exists({
      _id: receiverId,
    });

    if (!receiverExists) {
        return res.status(404).json({message: "Receiver not found"});
    }
    let imageUrl;
    if (image) {
      // upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // Todo: send message in real time if user is online - socket.io
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
