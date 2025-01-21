import express from "express";
import { protectroute, adminroute } from "../middlewares/auth.middleware.js";
import { getAllProducts,getproductsbycategory, getfeaturedproducts, createProduct, deleteproduct, getrecommendedproducts, togglefeaturedproduct } from "../controllers/productcontroller.js";

const router = express.Router();

router.get("/", protectroute, adminroute, getAllProducts);
router.get("/featured", getfeaturedproducts);
router.get("/category/:category", getproductsbycategory);
router.get("/recommended", getrecommendedproducts);
router.patch("/:id", protectroute, adminroute, togglefeaturedproduct);
router.post("/", protectroute, adminroute, createProduct);
router.delete("/:id", protectroute, adminroute, deleteproduct);

export default router;