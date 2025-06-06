import {User} from "../models/usermodel.js";
import Product from "../models/productmodel.js";


export const getCartProducts = async (req, res) => {
	try {
		const products = await Product.find({ _id: { $in: req.user.cartItems } });

		// add quantity for each product
		const cartItems = products.map((product) => {
			const item = req.user.cartItems.find((cartItem) => cartItem.id === product.id);
			return { ...product.toJSON(), quantity: item.quantity };
		});

		res.json(cartItems);
	} catch (error) {
		console.log("Error in getCartProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};


export const addToCart = async (req, res) => {
  const { productId } = req.body;
    const user = req.user;
  
    try {
		const existingItem = user.CartItems.find((item) => item._id == productId);
		if (existingItem) {
			existingItem.quantity += 1;
		} else {
			user.CartItems.push(productId);
		}

		await user.save();
		res.json(user.CartItems);
    console.log(user.CartItems);
	} catch (error) {
    console.log(user);
		console.log("Error in addToCart controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
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
    const existingItem = user.cartItems.find((item) => item.id == productId);

    if (existingitem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        await user.save();
        res.json(user.cartItems);
      }

      existingItem.quantity = quantity;
      await user.save();
    } else {
      res.status(404).json({ message: "Product not found" });
    }


  } catch (error) {
    console.log('error in updatecart controller', error.message);
    res.status(500).json({ message: error.message });
  }
};

