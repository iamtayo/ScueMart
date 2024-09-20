import { useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";
import { Button,Row,Col,ListGroup,Image,Card } from "react-bootstrap";
import { useSelector,useDispatch } from "react-redux";
import CheckoutSteps from "../components/CheckoutSteps";
import { clearCartItems } from "../slices/cartSlice";
import { useCreateOrderMutation } from "../slices/orderApiSlice.js";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const PlaceOrderScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    

    const cart = useSelector((state)=> state.cart);

    const [createOrder, {isLoading,error}] = useCreateOrderMutation();

    useEffect(()=>{
        if(!cart.shippingAddress.address){
            navigate('/shipping');
        }else if (!cart.paymentMethod){
            navigate('/payment');
        }
    },[cart.shippingAddress.address,cart.paymentMethod,navigate]);

    const placeOrderHandler = async ()=>{
        try {
            const res = await createOrder({
                orderItems : cart.cartItems,
                shippingAddress : cart.shippingAddress,
                paymentMethod : cart.paymentMethod,
                itemsPrice : cart.itemsPrice,
                taxPrice : cart.taxPrice,
                shippingPrice : cart.shippingPrice,
                totalPrice : cart.totalPrice

            }).unwrap();
            dispatch(clearCartItems());
            console.log(res);
            navigate(`/order/${res.createdOrder._id}`);
        } catch (error) {
            toast.error(error);
        }

    }


  return (
    <>
        <CheckoutSteps step1 step2 step3 step4/>
        <Row>
            <Col md={8}>
                <ListGroup variant="flush" >
                    <ListGroup.Item>
                        <h2>Shipping</h2>
                        <p>
                            <strong>Address: </strong>
                            {cart.shippingAddress.address}, {cart.shippingAddress.city} {" "} {cart.shippingAddress.postalCode},{" "} {cart.shippingAddress.country}
                        </p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <h2>Payment Method</h2>
                        <p>
                           <strong>Method : </strong>
                           {cart.paymentMethod}
                        </p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <h2>Order Items</h2>
                            {cart.cartItems.length === 0  ? (
                            <Message>Your cart is empty </Message>
                           ) : (
                            <ListGroup variant="flush">
                                {cart.cartItems.map((item,index)=> (
                                    <ListGroup.Item key={index}>
                                        <Row>
                                            <Col md = {1}>
                                            <Image src={item.image} alt={item.name} fluid rounded/>
                                            </Col>
                                            <Col>
                                                <Link to={`/product/${item._id}`} >
                                                    {item.name}
                                                </Link>
                                            </Col>
                                            <Col md = {4}>
                                                {item.qty} x {item.price} = ${Number(item.qty * item.price).toFixed(2)}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                           )}
                    </ListGroup.Item>
                </ListGroup>
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>Order Summary</h2>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Items : </Col>
                                <Col>${cart.itemsPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Shipping : </Col>
                                <Col>${cart.shippingPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Tax : </Col>
                                <Col>${cart.taxPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Total Price : </Col>
                                <Col>${cart.totalPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                        {error && <Message variant="danger">{error.data?.message || error.error || "An error occurred"}</Message>}

                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Button  type="button" className = "btn_block" disabled = {cart.cartItems.length === 0} onClick = {placeOrderHandler}>
                                Place Order
                            </Button>
                            {isLoading && <Loader/>}
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>

    </>
  )
}

export default PlaceOrderScreen