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
    set({user: res.data.user,loading:false});
    console.log(res.data.user);
  } catch (error) { 
    set({loading:false});
    toast.error(error.response.data.message);
  }
}

})); 

  export default useUserStore;
