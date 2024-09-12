import React from 'react'
import {LinkContainer} from 'react-router-bootstrap'
import { Badge,Navbar,Nav,Container} from 'react-bootstrap';
import {FaShoppingCart, FaUser} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import logo from '../assets/logo.png' ;

const Header = () => {
  const {cartItems} = useSelector((state)=>state.cart);
return (

<>
  <header>
    <Navbar bg='dark' expand="md" variant='dark' collapseOnSelect>
      <Container>
        <LinkContainer to='/'>
          <Navbar.Brand>
            <img src={logo} alt='logo' />
            ScueMart
          </Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls='basic-navbar-nav'></Navbar.Toggle>
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className="ms-auto">
            <LinkContainer to='/cart'>
              <Nav.Link>
                <FaShoppingCart /> Cart
                {cartItems.length > 0 && (
                  <Badge pill bg = "success" style={{margin : '5px'}}>
                    {cartItems.reduce((a,c)=> a + c.qty,0)}
                  </Badge>
                )}
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to='/user'>
              <Nav.Link>
                <FaUser /> User
              </Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  </header>
</>
)
}

export default Header