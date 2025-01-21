import express from "express";
import {addtocart, deleteallcart, updatecart,getcart} from "../controllers/carcontroller.js";
import { protectroute } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/",protectroute, getcart);
router.post("/",protectroute, addtocart);
router.delete("/",protectroute, deleteallcart);
router.put("/:id",protectroute, updatecart);       

export default router;
