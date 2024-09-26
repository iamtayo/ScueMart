import path from "path"
import express, { urlencoded } from 'express';
import __dirname from './utils/environment.js';
import connectDB from './config/db.js';
import productRoutes from "./router/productRoutes.js";
import userRoutes from "./router/userRoutes.js" ;
import orderRoutes from "./router/orderRoutes.js"
import uploadRoutes from "./router/uploadRoutes.js" 
import {notFound, errorHandler} from "../backend/middleware/errorMiddleware.js";
import cookieParser from 'cookie-parser';
const port= process.env.PORT || 5000;


const callConect = async ()=>{
    return await connectDB();
}
callConect();

const app = express();


//BodyParser Middleware
app.use(express.json());
app.use(urlencoded({extended:true}));

// Cookie Middleware
app.use(cookieParser());

app.get("/",(req,res)=>{
    res.send("Hello World");
});

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes );
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/api/config/paypal", (req,res)=>{
    res.send({clientId : process.env.PAYPAL_CLIENT_ID});
})

app.use('/uploads',express.static(path.join(__dirname,"../../uploads")));


app.use(notFound);
app.use(errorHandler);


app.listen(port,()=>{console.log("Server up and running")});