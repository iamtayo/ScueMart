import {Link,useParams} from "react-router-dom";
import Message from '../components/Message';
import Loader from '../components/Loader';
import { Row, Col ,ListGroup,Image,Button,Card,Form } from "react-bootstrap";
import {useDispatch, useSelector} from 'react-redux';
import { useGetOrderDetailsQuery } from "../slices/orderApiSlice";


const OrderScreen = () => {
    const {id: orderId} = useParams();
    const {data: order, refetch, isLoading, error} =  useGetOrderDetailsQuery(orderId);

  return isLoading ? <Loader/> : error ? <Message variant="danger" /> : (
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
                        <Col> Items : ${order.itemsPrice}</Col>
                    </Row>
                    <Row>
                        <Col> Shipping : ${order.shippingPrice}</Col>
                    </Row>
                    <Row>
                        <Col> Tax : ${order.taxPrice}</Col>
                    </Row>
                    <Row>
                        <Col> Total : ${order.totalPrice}</Col>
                    </Row>
                </ListGroup.Item>
                </ListGroup>
            </Card>
        </Col>

        </Row>
    </>
  )
}

export default OrderScreen