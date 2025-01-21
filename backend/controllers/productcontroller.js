import Product from "../models/productmodel.js";
import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllProducts =async (req, res) => {
  try {
    const products = await Product.find({});// find all products
    res.json(products);

  } catch (error) {}
};

export const getfeaturedproducts =async (req, res) => {

  try {
    let featuredproduct = await redis.get("featured_products");

    if (featuredproduct) {
      res.json(JSON.parse(featuredproduct));
    }

    featuredproduct = await Product.find({ isFeatured: true }).lean();    //finds prodcut in mongodb and lean() returns plain javascript object

    if(!featuredproduct){
    return res.status(404).json({message: "No featured products found"});
    }
    await redis.set("featured_products", JSON.stringify(featuredproduct));

    res.json(featuredproduct);

  } catch (error) {
    console.log(error.message);
    res.status(500).json({message: error.message});
  }
};

export const createProduct = async (req, res) => {

try {
  const { name, image, description, price, category } = req.body;

  let cloudinaryResponse = null;
  if(image){
    cloudinaryResponse = await cloudinary.uploader.upload(image, {folder: "products"}); //upload image to cloudinary

    const product = Product.create({
      name,
      image: cloudinaryResponse.secure_url ? cloudinaryResponse?.secure_url : "",
      description,
      price,
      category 
    });
      res.status(201).json(product);
  }

} catch (error) {
  console.log("error in createproduct controller", error.message);
  res.status(500).json({message: error.message});
}
};

export const deleteproduct = async (req, res) => {

try {
  const product = Product.findById(req.params.id);

  if(!product){
    return res.status(404).json({message:"no product found"});
  }

  if(product.image){
    const publicid = product.image.split("/").pop().split(".")[0];
    try {
      await cloudinary.uploader.destroy(`products/${publicid}`)
      console.log("deleted image from cloudinary")
    } catch (error) {
      console.log("error deleting image from cloudinary",error);
    }
  }

  await Product.findByIdAndDelete(req.params.id);
  res.json("product deleted")

} catch (error) {
  console.log(error.message);
}

};

export const getrecommendedproducts =async (req, res) => {
  try {
    const products = await Product.aggregate([
      {$sample: {size: 3}},
      {$project: {_id: 1, name: 1, image: 1, price: 1}}
    ])

    res.json(products);

  } catch (error) {
    console.log(error.message);
  }
};

export const getproductsbycategory = async (req, res) => {

  const {category} = req.params;

  try {
    const products = await Product.find({category});
    res.json(products);
  } catch {
    console.log(error.message);
  }
};

export const togglefeaturedproduct = async (req,res) => {

  try {
    const product = await Product.findById(req.params.id);
    if(product){
      product.isFeatured = !product.isFeatured;
      const updateproduct = await product.save();
    await updateFeaturedProductsCache();
      res.json(updateproduct);
    }else{
      res.status(404).json({message: "product not found"})
    }
  } catch (error) {
    
  }
};

async function updateFeaturedProductsCache() {
  try {
    const featuredproducts = await Product.find({isFeatured: true}).lean();
  await redis.set("featured_products",JSON.stringify(featuredproducts));
  } catch (error) {
    console.log("error in update cache function",error);
    res.status(500).json({message: error.message})
  }
  
};