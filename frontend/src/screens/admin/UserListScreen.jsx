import {LinkContainer} from "react-router-bootstrap";
import {FaTimes,FaTrash,FaEdit,FaCheck} from "react-icons/fa";
import {Table,Button} from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import {useGetUsersQuery,useDeleteUserMutation} from "../../slices/userApiSlice";


const UserListScreen = () => {
  const {data : users , refetch, isLoading, error} = useGetUsersQuery();
  const [deleteUser, {isLoading: isDeleting}] = useDeleteUserMutation();


  const deleteHandler = async (id)=>{
    if(window.confirm("Are you sure you want to delete this User ?")){
        try {
          await deleteUser(id);
          refetch();
          toast.success("User Deleted")
        } catch (error) {
          toast.error(error?.data?.message|| error?.error);        
        }
      }
  }
  return <>
    <h1>Users</h1>
    {isDeleting && <Loader/>}
    {isLoading ? (
      <Loader />
    ) : error ? (
      <Message variant="danger">{error?.data?.message || error?.error}</Message>
    ) : (
    <Table>
      <thead>
        <tr>
          <th>ID</th>
          <th>NAME</th>
          <th>EMAIL</th>
          <th>ADMIN</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {users.map((user)=>(
          <tr key={user._id}>
            <td>{user._id}</td>
            <td>{user.name}</td>
            <td><a href = {`mailto:${user.email}`}>{user.email}</a></td>
            {user.isAdmin ? (
              <td>
              <FaCheck style={{color : "green"}}></FaCheck>
              </td>
            ) : (
              <td>
                <FaTimes style={{color : "red"}}></FaTimes>
              </td>
            )}
            <td>
            <LinkContainer to = {`/admin/user/${user._id}/edit`}>
              <Button className="btn-sm" variant="light"> <FaEdit/> </Button>
            </LinkContainer>
            <Button 
            className="btn-sm" variant="danger" onClick={()=>deleteHandler(user._id)}><FaTrash/></Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
    )}
  </>
}

export default UserListScreen