import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  
  phone: {
    type: String,
    required: false
  },
  
  password: {
    type: String,
    required: true
  },

  location: {
    state: String,
    country: String,
    pincode: String
  },
  
  profileImage: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});


const UserModel=mongoose.model("User",userSchema);

export default UserModel;