import express from "express";
import { protectroute,adminroute } from "../middlewares/auth.middleware.js";
import { getanalyticsdata } from "../controllers/analyticscontroller.js";


const router = express.Router();

router.get("/",protectroute,adminroute,async (req,res)=>{
  try {
    const analyticsdata = await getanalyticsdata();
    const startdate = new Date();
    const enddate = new Date(enddate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const dailysalesdata = await getdailysalesdata(startdate,enddate);



    res.json(analyticsdata,dailysalesdata);



  } catch (error) {
    
  }
})




export default router;