import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const userschema = mongoose.Schema({

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    CartItems: [
      {
        quantity: {
          type: Number,
          default: 1,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      }
    ]
}, {timestamps:true});


// userschema.methods.comparePassword = async function (password) {
//   return  bcryptjs.compare(password, this.password);
// };

export function comparePassword(password,enteredPassword) {
  return  bcryptjs.compare(password, enteredPassword);
};

export const User = mongoose.model('User',userschema );

