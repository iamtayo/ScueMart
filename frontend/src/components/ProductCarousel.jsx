import { Link } from "react-router-dom";
import { Carousel,Image } from "react-bootstrap";
import Message from "./Message";
import { useGetTopProductsQuery } from "../slices/productsApiSlice";



const ProductCarousel = () => {
    const { data: products, isLoading , error } = useGetTopProductsQuery();

  return  isLoading ? console.log("Loading") : error ? (<Message variant="danger" >{error?.data?.message || error?.error}</Message>) : (
    <Carousel pause = "hover" className="bg-primary mb-4">
    {products.map(product => (
        <Carousel.Item key={product._id}>
            <Link to={`/product/${product._id}`} className="nav-link">
                <Image src={product.image} style={{ width: '50%', height: '600px', objectFit: 'cover' }} alt={product.name} fluid/>
                <Carousel.Caption className="carousel-caption">
                <h2>{product.name} (${product.price})</h2>
                </Carousel.Caption>
            </Link>
        </Carousel.Item>
    ))}
    </Carousel>
  )
}

export default ProductCarousel