import jwt from "jsonwebtoken";
import  User  from "../models/userModel.js";
import asyncHandler from "./async.js";
import __dirname from "../utils/environment.js";

//Protect  Middleware

const protect  = asyncHandler(async(req,res,next)=>{
    let token;
    // Read jwt from cookie
    token = req.cookies.jwt;

    if(token){
        try {
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password');
            next();
        } catch (error) {
            res.status(401)
            throw new Error ("Not Authorized, Token Failed ")
        }   
    } else{
        res.status(401)  
        throw new Error ("Not Authorized, No token ")
    }
});


// Admin Middleware 

const admin = (req,res,next)=>{
    if(req.user && req.user.isAdmin){
        next()
    }else{
        res.status(401);
        throw new Error("Not Authorized, You are not an Admin")
    }
}


export {protect,admin} ;
