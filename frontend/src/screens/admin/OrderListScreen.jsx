import {LinkContainer} from "react-router-bootstrap";
import {FaTimes} from "react-icons/fa";
import {Table,Button} from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {useGetOrdersQuery} from "../../slices/orderApiSlice";


const OrdersScreen = () => {
  const {data : orders , isLoading, error} = useGetOrdersQuery();
  return <>
    <h1>Orders</h1>
    {isLoading ? (
      <Loader />
    ) : error ? (
      <Message variant="danger">{error?.data?.message || error?.error}</Message>
    ) : (
    <Table>
      <thead>
        <tr>
          <th>ID</th>
          <th>USER</th>
          <th>DATE</th>
          <th>TOTAL</th>
          <th>PAID</th>
          <th>DELIVERED</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order)=>(
          <tr key={order._id}>
            <td>{order._id}</td>
            <td>{order.user && order.user.name}</td>
            <td>{order.createdAt.substring(0,10)}</td>
            <td>${order.totalPrice}</td>
            {order.isPaid ? (
              <td>
                {order.createdAt.substring(0,10)}
              </td>
            ) : (
              <td>
                <FaTimes style={{color : "red"}}></FaTimes>
              </td>
            )}
            {order.isDelivered ? (
              <td>
                {order.deliveredAt.substring(0,10)}
              </td>
            ) : (
              <td>
                <FaTimes style={{color : "red"}}></FaTimes>
              </td>
              
            )}
            <td>
            <LinkContainer to = {`/order/${order._id}`}>
              <Button className="btn-sm" variant="light"> Details </Button>
            </LinkContainer>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
    )}
  </>
}

export default OrdersScreen