import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FaSearch } from "react-icons/fa";
import { useState } from 'react';
import { Link } from "react-router-dom";

function NavBar({ token, setToken }) {
  const [input, setInput] = useState("");

  const fetchData = async (value) => {
    //make a request to the ingredients
    const response = await fetch()
    const data = response.json();

    //no need to filter
  }

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      {token ? (
        <Container fluid>
          <Navbar.Brand href="#">Kitch</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '500px' }}
              navbarScroll
            >
              <Form className="d-flex">
                <Form.Control
                  type="search"
                  placeholder="Search"

                  aria-label="Search"
                  value={input}
                  onChange={(e) => handleChange(e.target.value)}
                />
              </Form>
              <Button variant="outline-success">Search</Button>
            </Nav>

            <Nav.Link to="/" >Home</Nav.Link>
            <NavDropdown title="Account" id="navbarScrollingDropdown" >
              <NavDropdown.Item href="#action3">My Profile</NavDropdown.Item>
              <NavDropdown.Item href="#action4">
                Saved Recipes
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={() => {
                setToken("");
                localStorage.setItem("token", "");
              }}
                to="/">
                Logout
              </NavDropdown.Item>
            </NavDropdown>

          </Navbar.Collapse>
        </Container>

      ) : (
        <Container fluid>
          <Navbar.Brand href="#">Kitch</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
              <Form className="d-flex">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                  value={input}
                  onChange={(e) => handleChange(e.target.value)}
                />
              </Form>
              <Button variant="outline-success">Search</Button>
            </Nav>

            <Nav.Link href="#action1">Home</Nav.Link>
            <Link to="/login">Login</Link>
          </Navbar.Collapse>
        </Container>
      )}
    </Navbar>
  );
}

export default NavBar;