import { useState,useEffect } from "react";
import { Link ,useNavigate,useParams} from "react-router-dom";
import { Form,Button } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import FormContainer from "../../components/FormContainer";
import { useGetProductDetailsQuery,useUpdateProductMutation,useUploadProductImageMutation } from "../../slices/productsApiSlice";

const ProductEditScreen = () => {
    const {id: productId} = useParams();
    const navigate = useNavigate();

    const [updateProduct, {isLoading: loadingUpdate}] = useUpdateProductMutation();
    const {data: product , isLoading,error} = useGetProductDetailsQuery(productId);
    const [uploadProductImage, {isLoading: loadingUpload}] = useUploadProductImageMutation();

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState("");
    const [brand, setBrand] = useState("");
    const [category, setCategory] = useState("");
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState("");

    useEffect(()=>{
        if(product){
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setBrand(product.brand);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setDescription(product.description);
        }
    },[product])

    const updateProductHandler = async (e) => {
        e.preventDefault();
        const updatedProduct = {
            productId,
            name,
            price,
            image,
            brand,
            category,
            countInStock,
            description
        };
        const result = await updateProduct(updatedProduct);
        if(result.error){
            toast.error(result?.error?.message);
        }else{
            toast.success("Product Updated");
            navigate("/admin/productlist");
        }
    }
    async function uploadFileHandler (e){
        const formData = new FormData();
        formData.append('image',e.target.files[0]);
        try {
            const res = await uploadProductImage(formData).unwrap();
            setImage(res.image);
            toast.success(res.message);
        } catch (error) {
            toast.error(error?.data?.message|| error?.error);
        }
    }
    
  return (
    <>
        <Link to = "/admin/productlist" className="btn btn-light my-3" >
            Go Back
        </Link>
        <FormContainer>
            <h1>Edit Product</h1>
            {loadingUpdate && <Loader />}
            {isLoading ? <Loader/> : error ? <Message variant="danger">{error?.data?.message||error?.error}</Message> : (
                <Form onSubmit={updateProductHandler}>
                    <Form.Group controlId="name" className ="my-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control 
                        type="text"
                        value={name}
                        placeholder="Enter Name"
                        onChange={(e)=>setName(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId="price" className ="my-3">
                        <Form.Label>Price</Form.Label>
                        <Form.Control 
                        type="number"
                        value={price}
                        placeholder="Enter Price"
                        onChange={(e)=>setPrice(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                        {loadingUpload && <Loader/>}
                    <Form.Group controlId="image" className="my-2">
                    <Form.Label>Image</Form.Label>
                    <Form.Control 
                    type="text" 
                    value={image}
                    placeholder="Enter Image URL"
                    onChange={(e)=>setImage(e.target.value)}
                    />
                    <Form.Control 
                    type="file"
                    label ="Choose File"
                    onChange={uploadFileHandler}
                     />
                    </Form.Group>

                    <Form.Group controlId="brand" className ="my-3">
                        <Form.Label>Brand</Form.Label>
                        <Form.Control 
                        type="text"
                        value={brand}
                        placeholder="Enter Brand"
                        onChange={(e)=>setBrand(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId="countInStock" className ="my-3">
                        <Form.Label>Count In Stock</Form.Label>
                        <Form.Control 
                        type="number"
                        value={countInStock}
                        placeholder="Enter Count In Stock"
                        onChange={(e)=>setCountInStock(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId="category" className ="my-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Control 
                        type="text"
                        value={category}
                        placeholder="Enter Category"
                        onChange={(e)=>setCategory(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId="description" className ="my-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control 
                        as ="textarea"
                        value={description}
                        placeholder="Enter Description"
                        onChange={(e)=>setDescription(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Button type="submit" variant="primary" className="my-3">Submit</Button>
                    
                </Form>
            )}
        </FormContainer>
    </>
  )
}

export default ProductEditScreen