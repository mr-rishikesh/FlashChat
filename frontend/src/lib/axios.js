import axios from "axios"
// this is for the connect to backend api 
export const axiosInstance = axios.create({
    baseURL : "http://localhost:5001/api" ,
    withCredentials : true 
})