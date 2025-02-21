import {create} from "zustand"
import { axiosInstance } from "../lib/axios.js"

import toast from "react-hot-toast"


 export const  useAuthStore = create((set) => ({
    authUser : null ,
    isSigningUp : false ,
    isLoggingIng : false ,
    isUpdatingProfile : false ,

    isCheckingAuth : true  ,
    checkAuth : async () => {
      try {
         const res = await axiosInstance.get("/auth/check")
         console.log(res)
         set({authUser : res.data})
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
      } catch (error) {
         toast.error(error.data.response.message)
         
      } 
    }
 }))