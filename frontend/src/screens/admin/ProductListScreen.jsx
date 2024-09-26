import {LinkContainer} from "react-router-bootstrap";
import {FaEdit,FaTrash} from "react-icons/fa";
import {Table,Button,Row,Col} from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetProductsQuery,useCreateProductMutation,useDeleteProductMutation } from "../../slices/productsApiSlice";
import { toast } from "react-toastify";

const ProductListScreen = () => {
  const {data: products, error, isLoading,refetch} = useGetProductsQuery('products');
  const [createProduct, {isLoading: isCreating}] = useCreateProductMutation();
  const [deleteProduct,{isLoading: loadingDelete}] = useDeleteProductMutation();


  const createProductHandler = async ()=>{
    if(window.confirm("Are you sure you want to create a new product ?")){
      try {
        await createProduct();
        refetch();
      } catch (error) {
        toast.error(error?.data?.message|| error?.error);
      }
    }
  }


  const deleteHandler = async (id) => {
    if(window.confirm("Are you sure you want to delete this product")){
      try {
        await deleteProduct(id);
        refetch();
        toast.success("Product Deleted")
      } catch (error) {
        toast.error(error?.data?.message|| error?.error);        
      }
    }
  }
  console.log(products);
  return (
    <>
      <Row className = "align-items-center">
          <Col>
            <h1>Products</h1>
          </Col>
          <Col className = "text-end">
              <Button className="btn-sm m-3 " onClick={createProductHandler}><FaEdit/>Create Product</Button>
          </Col>
      </Row>
      {isCreating && <Loader/>}
      {loadingDelete && <Loader/>}
      {isLoading ? <Loader/> : error ? <Message variant="danger" > {error?.data?.message || error?.error}  </Message> : (
        <Table striped  hover responsive className = "table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key = {product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                <LinkContainer to={`/admin/product/${product._id}/edit`}>
                  <Button  variant = "light" className=" btn-sm mx-2 "><FaEdit/>Edit</Button>
                </LinkContainer>
                <Button variant="danger" className="btn-sm" onClick={()=> deleteHandler(product._id)}>
                  <FaTrash style={{color : "white"}}/>
                </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default ProductListScreen