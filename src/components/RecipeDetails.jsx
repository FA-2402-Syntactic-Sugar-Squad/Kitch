import AddReview from "./AddReview.jsx";
import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

const RecipeDetails = ({ recipe }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    setIsFavorite(false); // Reset isFavorite state when recipe changes
  }, [recipe]); 

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");

    if (tokenFromStorage) {
      setToken(tokenFromStorage);
      const decodeToken = (token) => {
        try {
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join("")
          );
          return JSON.parse(jsonPayload);
        } catch (error) {
          console.error("Token decode failed", error);
          return null;
        }
      };

      const decodedToken = decodeToken(tokenFromStorage);
      if (decodedToken && decodedToken.id) {
        setUserId(decodedToken.id);
      }
    }
  }, []);

  if (!recipe) {
    return <p>Select a recipe to see details.</p>;
  }

  const handleAddToFavorites = async () => {
    try {
      const response = await fetch("/api/users/save-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userId,
          recipeId: recipe.id,
        }),
      });

      if (response.ok) {
        const savedRecipe = await response.json();
        setIsFavorite(true);
      } else {
        const errorText = await response.text();
        console.error("Failed to add recipe to favorites:", errorText);
        throw new Error(errorText);
      }
    } catch (error) {
      console.error("Error adding recipe:", error);
    }
  };

  return (
    <>
      {token ? (
        <>
          <Card style={{ width: "18rem" }}>
            <Card.Img variant="top" src={recipe.imageurl} />
            <Card.Body>
              <Card.Title>{recipe.title}</Card.Title>
              <Card.Text>
                Instructions: {recipe.instructions}, Servings: {recipe.servings}
                , Diet: {recipe.diet}, Rating and Reviews:
                {recipe.ratingsAndReviews &&
                recipe.ratingsAndReviews.length > 0 ? (
                  recipe.ratingsAndReviews.map((review) => (
                    <div key={review.id}>
                      <strong>Rating:</strong> {review.rating} <br />
                      <strong>Review:</strong> {review.reviewMsg}
                    </div>
                  ))
                ) : (
                  <p>No reviews yet.</p>
                )}
                <AddReview recipeId={recipe.id} />
              </Card.Text>
              <Button
                variant="primary"
                onClick={handleAddToFavorites}
                disabled={isFavorite}
              >
                {isFavorite ? "Added" : "Add to Favorites"}
              </Button>
            </Card.Body>
          </Card>
        </>
      ) : (
        <p>Must be logged in to see details.</p>
      )}
    </>
  );
};

export default RecipeDetails;
