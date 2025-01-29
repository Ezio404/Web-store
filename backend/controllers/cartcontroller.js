import {redis} from "../lib/redis.js";
import Product from "../models/productmodel.js";
import jwt from "jsonwebtoken";

export const addtocart = async (req, res) => {

  try {
    const { productId } = req.body;
    const user = req.user;

    const existingitem = user.cartItems.find((item) => item.id == productId);

    if (!existingitem) {
      user.cartItems.push(productId)
    } else {
      existingitem.quantity++
    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.log('error in addtocart controller', error.message);
    res.status(500).json({ message: error.message });
  }
}

export const deleteallcart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.log('error in deleteallcart controller', error.message);
    res.status(500).json({ message: error.message });
  }
};

export const updatecart = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;
    const existingitem = user.cartItems.find((item) => item.id == productId);

    if (existingitem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        await user.save();
        res.json(user.cartItems);
      }

      existingitem.quantity = quantity;
      await user.save();
    } else {
      res.status(404).json({ message: "Product not found" });
    }


  } catch (error) {
    console.log('error in updatecart controller', error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getcart = async (req, res) => {
  try {
    const products = await Product.find({ _id: { $in: req.user.cartItems } });
    const cartItems = products.map(product => {
      const item = req.user.cartItems.find((item) => { cartitem => cartitem.id == product.id });
      return {
        ...product.toJSON(),
        quantity: item.quantity
      }
    });
  } catch (error) {
console.log('error in getcart controller', error.message);
res.status(500).json({ message: error.message });
  }
};