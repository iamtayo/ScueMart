import mongoose from "mongoose";
import __dirname from "../utils/environment.js";
const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected : ${conn.connection.host}`);
    }catch(error){
        console.log(`Error : ${error.message}`);
        process.exit(1);
    }
   
};


//  const port = process.env.MONGO_URI; 
//   console.log(port);

export default connectDB;