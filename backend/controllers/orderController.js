import asyncHandler from "../middleware/async.js";
import Order from "../models/orderModel.js";

// @desc   Create new Order
// @route  POST /api/orders
// @access Private
const addOrderItems = asyncHandler(async (req,res)=>{
    const {orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;
    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error("no order items");
    }else{
        const order = new Order({
            orderItems : orderItems.map((x)=> ({...x,product : x._id,_id : undefined}) ) ,
            user : req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice

        })

        const createdOrder = await order.save();
        res.status(201).json({createdOrder});
    }

});

// @desc   Get Logged in users order
// @route  Get /api/orders/myorders
// @access Private
const getMyOrder = asyncHandler(async (req,res)=>{
    const orders = await Order.find(req.user._id);
    res.json(orders).status(200);
});

// @desc   Get order by id 
// @route  Get /api/orders/:id
// @access Private/admin
const getOrderById = asyncHandler(async (req,res)=>{
    const order = await Order.findById(req.params.id).populate('user','name email');
    if(!order){
        res.status(404);
        throw new Error("Order not found");
    }else {
        res.json(order).status(200);
    }

});

// @desc   Update order to paid
// @route  Get /api/orders/:id/pay
// @access Private/admin
const updateOrderToPaid = asyncHandler(async (req,res)=>{
    res.send("Update Order to Paid");
});

// @desc   Update Order to Delivered
// @route  Get /api/orders/:id/deliver
// @access Private/admin
const updateOrderToDelivered = asyncHandler(async (req,res)=>{
    res.send("Update to delivered");
});

// @desc   Get All orders
// @route  Get /api/orders
// @access Private/admin
const getOrders = asyncHandler(async (req,res)=>{
    res.send("Get All Orders");
})


export {
    addOrderItems,
    getMyOrder,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders
}