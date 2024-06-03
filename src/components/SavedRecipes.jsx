import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import RecipeDetails from "./RecipeDetails.jsx";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const SavedRecipes = ({ userId, token }) => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showModal, setShowModal] = useState(false);
  

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const response = await fetch(`/api/users/saved-recipes?userId=${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setSavedRecipes(data);
        } else {
          console.error("Failed fetching saved recipes");
        }
      } catch (error) {
        console.error("Failed fetching saved recipes:", error);
      }
    };

    fetchSavedRecipes();
  }, [token]);

  const handleRecipeClick = async (recipeId) => {
    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedRecipe(data);
        setShowModal(true);
      } else {
        console.error("Failed fetching recipe");
      }
    } catch (error) {
      console.error("Error fetching recipe details:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRecipe(null);
  };

  return (
    <div className="d-flex flex-wrap justify-content-between">
      {savedRecipes.map((recipe) => (
        <Card
          key={recipe.recipeId}
          style={{ width: "18rem", marginBottom: "20px" }}
        >
          <Link to="#" onClick={() => handleRecipeClick(recipe.recipeId)}>
            <Card.Img variant="top" src={recipe.recipes.imageurl} />
            <Card.Body>
              <Card.Title>{recipe.recipes.title}</Card.Title>
            </Card.Body>
          </Link>
        </Card>
      ))}
      {selectedRecipe && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedRecipe.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <RecipeDetails recipe={selectedRecipe} token={token} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default SavedRecipes;
