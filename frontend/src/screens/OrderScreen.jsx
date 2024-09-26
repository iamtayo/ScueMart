import { useEffect } from "react";
import {Link,useParams} from "react-router-dom";
import Message from '../components/Message';
import Loader from '../components/Loader';
import { Row, Col ,ListGroup,Image,Button,Card,} from "react-bootstrap";
import {PayPalButtons,usePayPalScriptReducer} from "@paypal/react-paypal-js"
import { useSelector} from 'react-redux';
import { useGetOrderDetailsQuery,useGetPayPalClientIdQuery,usePayOrderMutation,useDeliverOrderMutation } from "../slices/orderApiSlice";
import {toast} from "react-toastify" ;     



const OrderScreen = () => {
    const {id: orderId} = useParams();
    const {data: order, refetch, isLoading, error} =  useGetOrderDetailsQuery(orderId);

    const {data: paypal , isLoading :loadingPayPal , error: errorPaypal} = useGetPayPalClientIdQuery();
    const [payOrder,{isLoading: loadingPay}] = usePayOrderMutation();
    const [{isPending},paypalDispatch] = usePayPalScriptReducer();
    const [deliverOrder,{isLoading: loadingDeliver}] = useDeliverOrderMutation();

    const {userInfo} = useSelector((state)=>state.auth)

    useEffect(()=>{
        if(!errorPaypal && !loadingPayPal && paypal.clientId){
            const loadPayPalScript = async ()=> {
                paypalDispatch({
                    type: 'reset',
                    value: {
                        currency: 'USD',
                        'clientId' : paypal.clientId
                    }
                });
                paypalDispatch({type : 'setLoadingStatus',value : 'pending'});
            }
            if(order && !order.isPaid){
                if(!window.paypal){
                    loadPayPalScript();
                }
                
            }

        }
    },[order,paypal,paypalDispatch,loadingPayPal,errorPaypal])

    function onApprove(data,actions){
        return actions.order.capture().then(async function (details) {
            try {
                await payOrder({orderId,details});
                console.log(details);
                refetch();
                toast.success('Order Paid Successfully');
            } catch (error) {
                toast.error(error?.data?.message || error.message)
            }
        })
    }
   async function onApproveTest(){
                await payOrder({orderId,details : {payer : {}}});
                refetch();
                toast.success('Order Paid Successfully');
   }
    function createOrder(data,actions){
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value : order.totalPrice,
                    },
                },
            ],
        }).then(
            (orderId) => {
                return orderId;
            }
        )
    }
    function onError(err){
        toast.error(err.message);
    }
    async function deliverOrderHandler (){
        try {
            await deliverOrder(orderId);
            refetch();
            toast.success("Order Delivered");
        } catch (error) {
            toast.error(error?.data?.message || error?.message)
        }
    }
  return isLoading ? <Loader/> : error ? <Message variant="danger" > {error.data?.message} </Message>  : (
    <>
        <h1>Order {order._id}</h1>
        <Row>
        <Col md={8}>
            <ListGroup variant="flush">
                <ListGroup.Item>
                    <h2>Shipping </h2>
                    <p><strong>Name : </strong> {order.user.name}</p>
                    <p><strong>Email : </strong>{order.user.email}</p>
                    <p><strong>Address : </strong> {order.shippingAddress.address}, {order.shippingAddress.city} {' '}{order.shippingAddress.postalCode}, {order.shippingAddress.country} </p>
                    <p>
                        {order.isDelivered ? 
                        <Message variant="success">Delivered on {order.deliveredAt}</Message> :
                        <Message variant="danger">Not Delivered</Message>}
                    </p>
                </ListGroup.Item>
                <ListGroup.Item>
                    <h2>Payment</h2>
                    <p>
                        <strong>Method : </strong>{order.paymentMethod}
                    </p>
                    <p>
                        {order.isPaid ?
                        <Message variant="success">Paid on {order.paidAt}</Message> :
                        <Message variant="danger">Not Paid</Message>}
                    </p>
                </ListGroup.Item>
                <ListGroup.Item>
                    <h2>Order Items</h2>
                    <ListGroup >
                        {order.orderItems.map((item,index) => (
                            <ListGroup.Item key={index}>
                                <Row>
                                    <Col md={1}>
                                        <Image src={item.image} alt={item.name} fluid rounded />
                                    </Col>
                                    <Col>
                                        <Link to={`/product/${item.product}`}> {item.name}</Link>
                                    </Col>
                                    <Col md = {4}>
                                        {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                    </Col>

                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
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
                        <Col> Items : </Col>
                        <Col>${order.itemsPrice}</Col>
                    </Row>
                    <Row>
                        <Col> Shipping : </Col>
                        <Col>${order.shippingPrice}</Col>
                    </Row>
                    <Row>
                        <Col> Tax : </Col>
                        <Col>${order.taxPrice}</Col>
                    </Row>
                    <Row>
                        <Col> Total : </Col>
                        <Col>${order.totalPrice}</Col>
                    </Row>
                </ListGroup.Item>
                {!order.isPaid && (
                    <ListGroup.Item>
                        {loadingPay && <Loader/>}
                       {isPending ? <Loader/> : (
                        <div>
                            <Button  type="button" onClick={onApproveTest} style={{marginBottom : "10px"}}>Test Pay Order</Button>
                            <div>
                            <PayPalButtons 
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                            ></PayPalButtons>
                            </div>
                        </div>
                       ) }
                        
                    </ListGroup.Item>
                )}
                {loadingDeliver && <Loader/>}
                {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                    <ListGroup.Item>
                        <Button type="button" className="btn btn-block" onClick={deliverOrderHandler}>
                            Mark as Delivered
                        </Button>
                    </ListGroup.Item>
                )}

                </ListGroup>
            </Card>
        </Col>

        </Row>
    </>
  )
}

export default OrderScreen