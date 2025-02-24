import {create} from "zustand"
import { axiosInstance } from "../lib/axios.js"
import { io } from "socket.io-client"
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/a";
import toast from "react-hot-toast"


 export const  useAuthStore = create((set , get) => ({
    authUser : null ,
    isSigningUp : false ,
    isLoggingIng : false ,
    isUpdatingProfile : false ,
    onlineUsers : [] ,
    socket: null,

    isCheckingAuth : true  ,
    checkAuth : async () => {
      try {
         const res = await axiosInstance.get("/auth/check")
         console.log(res)
         set({authUser : res.data})
         get().connectSocket();
      } catch (error) {
         console.log( "Error in checkAuth " + error);
         
         set({authUser : null})
      } finally {
      set({ isCheckingAuth : false })
      }
    } ,
    signUp : async (data) => {
      set({isSigningUp : true})
      try {
             const res = await axiosInstance.post("/auth/signup" , data)
             toast.success("Accunt created successfully")
             set({authUser : res.data})
             get().connectSocket();
      } catch (error) {
         toast.error(error.res.data.message)
         
      } finally {
         set({isSigningUp : false})
      }
  
    },
    logIn : async (data) => {
      try {
         const res = await axiosInstance.post("/auth/login" , data)
         toast.success("Logined successfully")
         set({authUser : res.data})
         get().connectSocket();
      } catch (error) {
         console.log("error in the login");
         toast.error("Invailed credentals" );
      } finally {
         set({isLoggingIng : false})
      }

    },
    updateProfile : async (file) => {
      set({isUpdatingProfile : true})
      try {
         const res = await axiosInstance.put("/auth/update-profile" , file);
         set({authUser : res.data})
         toast.success("Profile updated successfully")
      } catch (error) {
         console.log(error)
         toast.error("Update failed")
      }  finally {
         set({isUpdatingProfile : false})
      }
      
    },

    logout : async () => {
      try {
        const res = await axiosInstance.post("/auth/logout")
        set({authUser: null})
        toast.success("Logged out successfully")
        get().disconnectSocket();
      } catch (error) {
         toast.error(error.data.response.message)
         
      } 
    },
    connectSocket : () => {
      const {authUser} = get();
      if(!authUser || get().socket?.connected) return;

      const socket = io(BASE_URL , {
         query : {
            userId : authUser._id
         }
      });
      socket.connect()
      set({socket:socket})

      socket.on("getOnlineUsers" , (userIds) => {
         set({onlineUsers : userIds})
      })
    },
    disconnectSocket : () => {
      if(get().socket?.connected) get().socket.disconnect()
    }
 }))