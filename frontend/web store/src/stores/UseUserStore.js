import axios from "../lib/axios.js";
import {create} from "zustand";
import {toast} from "react-hot-toast";

const useUserStore = create((set,get) => ({
  user: null,
  loading:false,
  checkingAuth:true,

  signup: async({name,email,password,confirmpassword})=>{
    set({loading:true});
    if(password !== confirmpassword){
      set({loading:false});
      toast.error("passwords do not match");
    
  }
  try {
    const res = await axios.post("/auth/signup",{name,email,password});
    set({user: res.data,loading:false});
  } catch (error) { 
    set({loading:false});
    toast.error(error.response.data.message);
  }
  },
  
  login: async(email,password)=>{
    set({loading:true});
  
  try {
    const res = await axios.post("/auth/login",{email,password});
    console.log('called here');
    set({user: res.data,loading:false});
    console.log(res.data);
  } catch (error) { 
    set({loading:false});
    toast.error(error.response.data.message);
  }
},
logout: async () => {
  try {
    await axios.post("/auth/logout");
    console.log('logout called')
    set({ user: null });
  } catch (error) {
    toast.error(error.response?.data?.message || "An error occurred during logout");
  }
},

checkAuth : async()=>{
  set({checkingAuth:true});
  try {
    const res = await axios.get("/auth/profile");
    set({user: res.data,checkingAuth:false});
  } catch (error) { 
    set({checkingAuth:false,user:null});
    toast.error(error.response.data.message);
  }
},


})); 

  export default useUserStore;
