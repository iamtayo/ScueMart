import asyncHandler from "../middleware/async.js"
import Product from "../models/productModel.js";
import __dirname from "../utils/environment.js";

// @desc   Fetch all products
// @route  GET /api/products
// @access Public
const getProducts = asyncHandler(async (req,res)=>{
    const pageSize = process.env.PAGINATION_LIMIT;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword ? {name : {$regex : req.query.keyword,$options : "i"}} : {};

    const count = await Product.countDocuments({...keyword});
    const products = await Product.find({...keyword}).limit(pageSize).skip(pageSize * (page -1));
    res.json({products, page , pages : Math.ceil(count/pageSize)});

});
// @desc   Create Product
// @route  GET /api/products
// @access Public
const createProduct = asyncHandler(async (req,res)=>{
    const product = new Product({
        name: "Sample name",
        price: 0,
        user: req.user.id,
        image : "/images/sample.jpg",
        brand : "Sample brand",
        category : "Sample Category",
        countInStock : 0,
        numReviews : 0 ,
        description : "Sample description"
    });
    const createdProduct = await product.save();

    res.json(createdProduct).status(200);
});

// @desc   Fetch product by Id
// @route  GET /api/products/:id
// @access Public
const getProductById = asyncHandler (async (req,res)=>{
    const product = await Product.findById(req.params.id);
    if(product){
    return res.json(product);
    } else{
        res.status(404);
        throw new Error('Resource Not Found') ;

    } });

// @desc   Update product
// @route  PUT /api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler (async (req,res)=> {

    const {
        name,
        price,
        description,
        image,
        brand,
        category,
        countInStock,
    } = req.body;

    const product = await Product.findById(req.params.id);
    if(product){
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;

        const updatedProduct =await product.save();
        res.json(updatedProduct).status(200);

    }else{
        res.status(404);
        throw new Error('Resource Not Found') ;
    }
});
// @desc   Delete Product
// @route  PUT /api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler (async (req,res)=> {

    const product = await Product.findById(req.params.id);
    if(product){
        await Product.deleteOne({_id : product._id});
        res.json({message : 'Product deleted'}).status(200);

    }else{
        res.status(404);
        throw new Error('Resource Not Found') ;
    }
});
// @desc   Create Revier
// @route  POST /api/products/:id/reviews
// @access Private
const createProductReview = asyncHandler (async (req,res)=> {
    const {rating,comment} = req.body;
    const product = await Product.findById(req.params.id);

    if(product){
        const alreadyReviewed = await product.reviews.find((review)=> review.user.toString() === req.user._id.toString());
        if(alreadyReviewed){
            res.status(400);
            throw new Error('Product already reviewed');
        }
        const review = {
            name : req.user.name,
            rating : Number(rating),
            comment ,
            user : req.user._id,
        }
        product.reviews.push(review); 
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc,review)=> acc + review.rating,0)/product.reviews.length;
        await product.save();
        res.json({message : 'Review added'}).status(201);
    }else{
        res.status(404);
        throw new Error('Resource Not Found') ;
    }

});

// @desc   Get Top  rated Products 
// @route  GET /api/products/top
// @access Public
const getTopProducts = asyncHandler (async (req,res)=>{
    const products = await Product.find({}).sort({rating : -1}).limit(3);
    if(products){
    return res.json(products).status(200);
    } else{
        res.status(404);
        throw new Error('Resource Not Found') ;

    } });

export {getProductById,getProducts,createProduct,updateProduct,deleteProduct,createProductReview,getTopProducts}