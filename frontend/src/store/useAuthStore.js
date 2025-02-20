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