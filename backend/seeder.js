import mongoose from "mongoose";
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import dotenv from 'dotenv';
dotenv.config({path : path.join(__dirname,"..","..",".env")});
import connectDB from "./config/db.js";
import express from "express";
import products from "./data/products.js";
import users from "./data/users.js";
import colors from "colors";
import Product from "./models/productModel.js";
import User from "./models/userModel.js";
import Order from "./models/orderModel.js";

await connectDB();

const importData = async ()=>{
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        
        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0]._id;
        const sampleProducts = products.map((product)=>{
            return {...product, user : adminUser}
        })
        await Product.insertMany(sampleProducts);
        console.log("Data Imported!".green.inverse);
        process.exit();
    } catch (error) {
        console.log(`${error}`.red.inverse);
        process.exit(1);
    }
};

const destroyData = async ()=>{
    try {
        await Order.deleteMany({});
        await Product.deleteMany({});
        await User.deleteMany({});
        console.log("Data Destroyed!".red.inverse);
        process.exit();
    } catch (error) {
        console.log(`${error}`.red.inverse); 
        process.exit(1); 
    }
};

if (process.argv[2]==="-d"){
    destroyData();
}else{
    importData();
}
