import { useState,useEffect } from "react";
import { Link ,useNavigate,useParams} from "react-router-dom";
import { Form,Button } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import FormContainer from "../../components/FormContainer";
import { useGetUserDetailsQuery,useUpdateUserMutation} from "../../slices/userApiSlice";

const UserEditScreen = () => {
    const {id: userId} = useParams();
    const navigate = useNavigate();

    const [updateUser, {isLoading: loadingUpdate}] = useUpdateUserMutation();
    const {data: user ,refetch, isLoading,error} = useGetUserDetailsQuery(userId);


    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
   

    useEffect(()=>{
        if(user){
            setName(user.name);
            setEmail(user.email);
            setIsAdmin(user.isAdmin);
        }
    },[user])

    const updateUserHandler = async (e) => {
        e.preventDefault();
        const updatedUser = {
            userId,
            name,
            email,
            isAdmin,
        };
        const result = await updateUser(updatedUser);
        refetch();
        if(result.error){
            toast.error(result?.error?.message);
        }else{
            toast.success("Product Updated");
            navigate("/admin/userlist");
        }
    }
    
  return (
    <>
        <Link to = "/admin/userlist" className="btn btn-light my-3" >
            Go Back
        </Link>
        <FormContainer>
            <h1>Edit User</h1>
            {loadingUpdate && <Loader />}
            {isLoading ? <Loader/> : error ? <Message variant="danger">{error?.data?.message||error?.error}</Message> : (
                <Form onSubmit={updateUserHandler}>
                    <Form.Group controlId="name" className ="my-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control 
                        type="text"
                        value={name}
                        placeholder="Enter Name"
                        onChange={(e)=>setName(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId="email" className ="my-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control 
                        type="text"
                        value={email}
                        placeholder="Enter Email"
                        onChange={(e)=>setEmail(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Admin</Form.Label>
                        <Form.Check
                        type="checkbox"
                        checked={isAdmin}
                        onChange={(e)=>setIsAdmin(e.target.checked)}
                        />

                    </Form.Group>

                    <Button type="submit" variant="primary" className="my-3">Submit</Button>
                    
                </Form>
            )}
        </FormContainer>
    </>
  )
}

export default UserEditScreen