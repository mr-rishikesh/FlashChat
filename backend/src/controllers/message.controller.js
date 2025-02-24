import cloudinary from "../lib/cloudinary.js";
import { getReiceverSocketId } from "../lib/socket.js";
import Message from "../models/message.model.js"
import User from "../models/user.model.js";
import { io } from "../lib/socket.js";

export const getUsersForSidebar = async (req , res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id : {$ne : loggedInUserId}})
        res.status(200).json(filteredUsers)


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message : "Internel server error getUserforsidebar"
        })
        
    }

}

export const getMessage = async (req , res) => {
    try {
        const {id:userToChatId} = req.params
        const myId = req.user._id
        const messages = await Message.find({$or :[
            {senderId : myId , recieverId : userToChatId},
            {senderId : userToChatId , recieverId : myId}
        ]})

        res.status(200).json(messages)
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message : "Internel server error getMessage"
        })
        
    }
}

export const sendMessage = async (req , res ) => {
    try {
        const myId = req.user._id;
        const {id:recieverId} = req.params
        const {text , image} = req.body
        let imageUrl;
        if(image) {
            // uploading to the cloudinary 
          const uploadResponse = await   cloudinary.uploader.upload(image)
          imageUrl = uploadResponse.secure_url
        }
        const newMessage =  new Message({
            text : text ,
            senderId : myId ,
            recieverId : recieverId,
            image : imageUrl
        })

        await newMessage.save();

        const receiverSocketId = getReiceverSocketId(recieverId);
        if(receiverSocketId) {
            // we are using to bcz it is one one chat not a group chat thats why we are using to(receiverId)
            io.to(receiverSocketId).emit("newMessage" , newMessage)
        }

        res.status(200).json(newMessage)


        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message : "Internel server error sendMessages"
        })
        
    }
}