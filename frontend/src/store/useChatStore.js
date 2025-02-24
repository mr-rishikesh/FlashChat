import {create} from "zustand"
import toast from "react-hot-toast"
import { axiosInstance } from "../lib/axios"
import { useAuthStore } from "./useAuthStore"

export const useChatStore = create((set , get) => ({
    messages : [],
    users : [] ,
    selectedUser : null , 
    isUsersLoading : false ,
    isMessagesLoading : false ,

    getUsers :async () => {
        set({isUsersLoading : true})
        try {
            const res = await axiosInstance.get("/messages/users" )
            set({users : res.data})
        } catch (error) {
            toast.error("Sever Issue ")
            console.log("Error in the getUsers" + error)
            
        } finally {
            set({isUsersLoading : false})
        }

    } ,
    getMessages : async  (userId) => {
        set({isMessagesLoading : true});
        try {
            const res = await axiosInstance.get(`/messages/${userId}`)
            set({messages : res.data})
        } catch (error) {
            console.log(error)
            
            
        } finally {
            set({isMessagesLoading : false})
        }
    } ,
    sendMessage :  async (messageData) => {
        const {selectedUser , messages} = get();
        try {
             const res = await axiosInstance.post(`/messages/send/${selectedUser._id}` , messageData)  
             set({messages : [...messages , res.data]})
        } catch (error) {
            toast.error(error.response.data.message)
        }
     
    },
    // subscribeToMessages : async () => {
    //     const {selectedUser} = get();
    //     if(!selectedUser) return;

    //     const socket = useAuthStore.getState().socket;

    //     socket.on("newMessage" , (newMessage) => {
    //         if(newMessage.senderId !== selectedUser._id) return;
    //         set({
    //             messages : [...get().messages , newMessage]
    //         })
    //     })
    // },
    subscribeToMessages: async () => {
        const { selectedUser } = get();
        if (!selectedUser) return;
    
        const socket = useAuthStore.getState().socket;
        if (!socket) {
            console.log("Socket not connected!");
            return;
        }
    
        socket.off("newMessage"); // Remove previous listener to avoid duplicates
        socket.on("newMessage", (newMessage) => {
            console.log("got new messages")
            if (newMessage.senderId !== selectedUser._id) return;
            set((state) => ({
                messages: [...state.messages, newMessage]
            }));
        });
    },
    
    unsubscribeFromMessages : () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessages")
    },
    setSelectedUser : (selectedUser) => set({selectedUser})
}))