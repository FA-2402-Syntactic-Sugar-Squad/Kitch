import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Searchbar from './Searchbar';
import "../App.css";

function NavBar({ token, setToken, selectedIngredients, setSelectedIngredients, setSearchResults }) { 
  const [userProfile, setUserProfile] = useState("");
  const navigate = useNavigate();

  const handleRecipesFetched = (fetchedRecipes) => {
    setSearchResults(fetchedRecipes); 
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`api/users/profile`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const userProfileResult = await response.json();
        setUserProfile(userProfileResult);
      } catch (error) {
        console.log("Error caught when fetching users profile from api", error);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchRecipesByIngredients = async () => {
      if (selectedIngredients.length > 0) { 
        try {
          const ingredientIds = selectedIngredients.map(ingredient => ingredient.id).join(','); 
          const response = await fetch(`/api/recipes/byIngredient/${ingredientIds}`);
          const recipes = await response.json();
          console.log('Navbar search result', recipes);
          handleRecipesFetched(recipes);
        } catch (error) {
          console.error('Error fetching recipes:', error);
        }
      } else {
        // Clear the search results if no ingredients are selected
        handleRecipesFetched([]);
      }
    };

    fetchRecipesByIngredients();
  }, [selectedIngredients]); 

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <Navbar expand="xl" className="bg-body-tertiary mb-3" sticky="top">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">Kitch</Navbar.Brand>
          <Navbar.Toggle aria-controls="offcanvasNavbar" />
          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel">
                {token ? `Welcome ${userProfile.username}!` : "Hello World!"}
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Searchbar
                selectedIngredients={selectedIngredients} 
                setSelectedIngredients={setSelectedIngredients} 
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search" />
              <Nav className="justify-content-end flex-grow-1 pe-3">
                {token ? (
                  <>
                    <NavDropdown title="Account" id="offcanvasNavbarDropdown">
                      <NavDropdown.Item as={Link} to="/myProfile">
                        My Profile
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item onClick={handleLogout}>
                        Logout
                      </NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                  </>
                ) : (
                  <>
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                  </>
                )}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBar;
