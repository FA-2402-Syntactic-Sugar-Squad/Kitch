import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import RecipeDetails from "../components/RecipeDetails.jsx";

const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const response = await fetch("/api/users/saved-recipes", {
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
          console.error("failed fetching saved recipe");
        }
      } catch (error) {
        console.error("failed fetching saved recipe:", error);
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
      } else {
        console.error("failed fetching recipe");
      }
    } catch (error) {
      console.error("error fetching recipe details:", error);
    }
  };

  return (
    <div className="d-flex flex-wrap justify-content-between">
      {savedRecipes.map((recipe) => (
        <Card key={recipe.recipeId} style={{ width: "18rem", marginBottom: "20px" }}>
          <Link to="#" onClick={() => handleRecipeClick(recipe.recipeId)}>
            <Card.Img variant="top" src={recipe.recipes.imageurl} />
            <Card.Body>
              <Card.Title>{recipe.recipes.title}</Card.Title>
            </Card.Body>
          </Link>
        </Card>
      ))}
      {selectedRecipe && (
        <RecipeDetails recipe={selectedRecipe} token={token} />
      )}
    </div>
  );
};

export default SavedRecipes;
