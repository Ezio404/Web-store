import express from "express";
import {addToCart, deleteallcart, updatecart,getCartProducts} from "../controllers/cartcontroller.js";
import { protectroute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/",protectroute, getCartProducts);
router.post("/",protectroute, addToCart);
router.delete("/",protectroute, deleteallcart);
router.put("/:id",protectroute, updatecart);       

export default router;
