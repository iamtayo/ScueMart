import { Container, Row, Col } from "react-bootstrap";

const currentYear = new Date().getFullYear();
const Footer = () => {
  return (
    <footer>
        <Container>
            <Row>
                <Col className="text-center py-3">
                   <p>ScueMart &copy; {currentYear}</p> 
                </Col>
            </Row>
        </Container>
    </footer>
  )
}

export default Footer