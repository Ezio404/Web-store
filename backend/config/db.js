import mongoose from "mongoose";

const connectDB = async ()=> {
  try {

    await mongoose.connect(process.env.MONGO_URI)

  } catch (error) {
    console.log(`ERROR : ${error.message}`)
  }
};

export default connectDB;