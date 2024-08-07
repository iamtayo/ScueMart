import {Card} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating.jsx'


const Product = ({props}) => {
  return (
    <Card className='my-3 p-3 rounded'>
        <Link to= {`/product/${props._id}`}>
            <Card.Img src= {props.image} variant='top'></Card.Img>
        </Link>
        <Card.Body>
        <Link to = {`/product/${props._id}`}>
            <Card.Title as = "div" className='product-title'>
                <strong>{props.name}</strong>
            </Card.Title>
        </Link>
        <Link to = {`/product/${props._id}`}>
        <Card.Text as = "div">
            <Rating value = {props.rating} text = {`${props.numReviews} reviews `}/>
        </Card.Text>
           <Card.Text as ="h3">${props.price}</Card.Text>
        </Link>
        </Card.Body>
        
        
    </Card>
  )
}

export default Product