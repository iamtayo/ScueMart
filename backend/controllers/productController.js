import asyncHandler from "../middleware/async.js"
import Product from "../models/productModel.js";

// @desc   Fetch all products
// @route  GET /api/products
// @access Public
const getProducts = asyncHandler(async (req,res)=>{
    const products = await Product.find();
    res.json(products);
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
// @desc   Deletect
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

export {getProductById,getProducts,createProduct,updateProduct,deleteProduct}