import express from "express";
import dotenv from "dotenv"
import path from "path";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import cartroutes from "./routes/cartroutes.js";    
import authRoutes from "./routes/userroutes.js";
import productRoutes from "./routes/productroutes.js";
import paymentRoutes from "./routes/paymentroutes.js";
import analyticsRoutes from "./routes/analyticsroutes.js";


const port = process.env.PORT || 5000;
dotenv.config();
connectDB();
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/products",productRoutes);
app.use("/api/cart",cartroutes);
app.use("/api/payment",paymentRoutes);
app.use("/api/analytics",analyticsRoutes);



app.get("/", (req,res)=>{
  res.send("hello there");
});


app.listen( port,()=>{
  console.log(`server running on port ${port}`)
});
