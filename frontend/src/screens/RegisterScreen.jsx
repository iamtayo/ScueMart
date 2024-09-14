import {Link,useLocation,useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { Form,Col,Row,Button } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useRegisterMutation } from "../slices/userApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

const LoginScreen = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {userInfo} = useSelector((state) => state.auth);
    const [register,{isLoading}] = useRegisterMutation();

    const {search} = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get("redirect") || "/";

    useEffect(()=>{
        if(userInfo){
            navigate(redirect);
        }
    },[userInfo,redirect,navigate]);

    const submitHandler = async (e)=>{
        e.preventDefault();
        if(password !== confirmPassword){
            toast.error("Passwords do not match");
            return;
            }else{
                try {
                    const res = await register({name,email,password}).unwrap() ;
                    dispatch(setCredentials({...res,}));
                    navigate('/');
                } catch (error) {
                    toast.error(error?.data?.message|| error.message);
                }
            }
    }
  return (
    <FormContainer>
        <h1> Sign Up </h1>
        <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
                <Form.Label >Full Name </Form.Label>
                <Form.Control type="text" placeholder="Enter in your Full Name" value={name} onChange={(e)=>setName(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId="email">
                <Form.Label >Email address </Form.Label>
                <Form.Control type="email" placeholder="Enter in your email address" value={email} onChange={(e)=>setEmail(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId="password">
                <Form.Label >Password</Form.Label>
                <Form.Control type="password" placeholder="Enter in your Password" value={password} onChange={(e)=>setPassword(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId="confirmPassword">
                <Form.Label >Confirm Password</Form.Label>
                <Form.Control type="password" placeholder="Enter in your Password Confirmation " value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}></Form.Control>
            </Form.Group>
            <Button type="submit" variant="primary" className="my-3" disabled = {isLoading}>Register</Button>
            {isLoading && <Loader/>}
        </Form>
        <Row className="py-3" >
                <Col>Already Have an account ? <Link to = {redirect ? `/login?redirect=${redirect}` : '/login' } >Login</Link></Col>
         </Row>
    </FormContainer>
  )
}

export default LoginScreen