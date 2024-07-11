import mongoose from "mongoose";
const {  model } = mongoose;
const Schema = new mongoose.Schema({
    email:{
        type:String,require:true
    } 
     
},{timestamps:true})
 
const User = model("users",Schema)
export default User;