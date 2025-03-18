import axios from "../lib/axios.js";
import { create } from "zustand";
import  toast  from "react-hot-toast";

export const useProductStore = create((set, get) => ({
  // products: [],
  loading: false,
  setproducts: (products) => set({ products }),

  createProduct: async (productData) => {
    set({ loading: true });

    try {
      const res = await axios.post("/products", productData);
      set((prevState) => ({
        products: [...prevState.products, res.data],
        loading: false
      }));
    } catch (error) {
      toast.error(error.response.data.error );
      set({ loading: false });
    }
  },

  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/products");
      set({ products: res.data, loading: false })
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      toast.error(error.response.data.error || "Failed to fetch products");
    }
  },

  fetchproductsbyCategory: async (category) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/products/category/${category}`);
      set({ products: res.data.products, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      toast.error(error.response.data.error || "Failed to fetch products");
    }
  },

  deleteProduct: async (productId ) => {
    set({ loading: true });

    try {
      const res = await axios.delete(`/products/${productId}`);
      set((prevstate) => ({ 
        products: prevstate.products.filter((product) => product._id !== productId),loading: false }));
    } catch (error) {
      set({ loading: false });
			toast.error(error.response.data.error || "Failed to delete product");
    }
  },

  toggleFeaturedProduct : async(productId)=>{
    set({loading:true});
    try {
      const res = await axios.patch(`/products/${productId}`);
      console.log(productId);
      set((prevproducts)=>({
        products: prevproducts.products.map((product)=>product._id===productId? {...product,isfeatured:res.data.isfeatured}:product),
        loading:false
      }));
    } catch (error) {
      set({ loading: false });
			toast.error(error.response.data.error || "Failed to update product");
    }
  },

  fetchfeaturedProdcuts : async()=>{
    set({loading:true});
    try {
      const response = await axios.get("/products/featured");
			set({ products: response.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
			console.log("Error fetching featured products:", error);
    }
  },
}));

