import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Searchbar from './Searchbar';
import "../App.css";
import Home from '../pages/Home'; // Ensure you import Home component

function NavBar({ token, setToken }) {
  const [userProfile, setUserProfile] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

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

  return (
    <>
      {['xl'].map((expand) => (
        <Navbar key={expand} expand={expand} className="bg-body-tertiary mb-3" sticky="top">
          {token ? (
            <Container fluid>
              <Navbar.Brand href="/">Kitch</Navbar.Brand>
              <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
              <Navbar.Offcanvas
                id={`offcanvasNavbar-expand-${expand}`}
                aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                placement="end"
              >
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                    Welcome {userProfile.username}!
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
                    <NavDropdown
                      title="Account"
                      id={`offcanvasNavbarDropdown-expand-${expand}`}
                    >
                      <NavDropdown.Item href="/myProfile">
                        My Profile
                      </NavDropdown.Item>
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
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="#action2"></Nav.Link>
                  </Nav>
                </Offcanvas.Body>
              </Navbar.Offcanvas>
            </Container>
          ) : (
            <Container fluid>
              <Navbar.Brand href="/">Kitch</Navbar.Brand>
              <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
              <Navbar.Offcanvas
                id={`offcanvasNavbar-expand-${expand}`}
                aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                placement="end"
              >
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                    Hello World!
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
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/login">Login</Nav.Link>
                  </Nav>
                </Offcanvas.Body>
              </Navbar.Offcanvas>
            </Container>
          )}
        </Navbar>
      ))}
      <Home
        token={token}
        searchResults={searchResults}
        isAdmin={false}
        selectedIngredients={selectedIngredients}
        setSelectedIngredients={setSelectedIngredients}
      />
    </>
  );
}

export default NavBar;
