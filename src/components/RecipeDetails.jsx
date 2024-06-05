import React, { useState, useEffect } from "react";
import axios from "axios";

import AddReview from "./AddReview.jsx";
import StarRating from "./StarRating.jsx";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "../App.css";

const RecipeDetails = ({ recipe, isAdmin, preferences }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    setIsFavorite(false);
    setReviews(recipe.ratingsAndReviews || []);
    calculateAverageRating(recipe.ratingsAndReviews);
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

  useEffect(() => {
    if (recipe && userId) {
      const checkIfFavorite = async () => {
        try {
          const response = await fetch(`/api/recipes/check-favorite-recipe?userId=${userId}&recipeId=${recipe.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setIsFavorite(data.isFavorite);
          } else {
            console.error("Failed to check if recipe is favorite");
          }
        } catch (error) {
          console.error("Error checking if recipe is favorite:", error);
        }
      };

      checkIfFavorite();
    }
  }, [recipe, userId, token]);

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

  const handleRemoveFromFavorites = async () => {
    try {
      const response = await fetch(`/api/users/saved-recipes/${userId}/${recipe.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIsFavorite(false);
      } else {
        const errorText = await response.text();
        console.error("Failed to remove recipe from favorites:", errorText);
        throw new Error(errorText);
      }
    } catch (error) {
      console.error("Error removing recipe:", error);
    }
  };

  const calculateAverageRating = (reviews) => {
    if (reviews && reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const avgRating = totalRating / reviews.length;
      setAverageRating(avgRating);
    } else {
      setAverageRating(0);
    }
  };

  const handleRateRecipe = async (rating) => {
    try {
      const endpoint = `/api/recipes/${recipe.id}/ratings`;
      const response = await axios.post(endpoint, { rating }, { headers: { "Authorization": `Bearer ${token}` } });
      const updatedRecipe = response.data;
      setReviews(updatedRecipe.ratingsAndReviews);
      calculateAverageRating(updatedRecipe.ratingsAndReviews);
    } catch (error) {
      console.error("Error rating recipe:", error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.put(`/api/admin/review/${reviewId}`, {}, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const updatedReview = reviews.map(review =>
        review.id === reviewId ? { ...review, reviewMsg: "" } : review
      );
      setReviews(updatedReview);
      calculateAverageRating(updatedReview);
    } catch (error) {
      console.log("Error updating review", error);
    }
  };

  if (!recipe) {
    return <p>Select a recipe to see details.</p>;
  };

  const filteredReviews = Array.isArray(reviews) ? reviews.filter(review => review.reviewMsg !== "") : [];

  return (
    <>
      {token ? (
        <>
          <Card style={{ width: "80rem" }}>
            <Card.Img variant="top" src={recipe.imageurl} className="see-dets-img" />
            <Card.Body>
              <Card.Title>{recipe.title}</Card.Title>
              <StarRating rating={averageRating} onRate={handleRateRecipe} />
              <Card.Text>
                <strong>Instructions:</strong> {recipe.instructions} <br></br>
                <strong>Servings:</strong> {recipe.servings},
                <br></br><strong>Diet:</strong> 
                {recipe.glutenFree && <p>Gluten Free, </p>}{recipe.ketogenic && <p>Ketogenic, </p>}{recipe.lactoVegetarian && <p>LactoVegetarian, </p>}{recipe.ovoVegetarian && <p>OvoVegetarian, </p>}{recipe.vegan && <p>Vegan, </p>}
                {recipe.pescetarian && <p>Pescetarian, </p>}{recipe.paleo && <p>Paleo, </p>}{recipe.primal && <p>Primal, </p>}{recipe.lowFODMAP && <p>lowFODMAP, </p>}{recipe.whole30 && <p>Whole30</p>}
                <strong>Reviews:</strong>
                {filteredReviews.length > 0 ? (
                  filteredReviews.map((review) => (
                    <div key={review.id} id="reviews">
                      {review.reviewMsg}{" "}
                      {isAdmin && review.reviewMsg && (
                        <Button
                          id="review-btn"
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteReview(review.id)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No reviews yet.</p>
                )}
                <AddReview recipeId={recipe.id} onReviewAdded={() => setReviews([...reviews, { reviewMsg: "Review submitted by current user" }])} />
              </Card.Text>
              <Button
                variant="primary"
                onClick={isFavorite ? handleRemoveFromFavorites : handleAddToFavorites}
              >
                {isFavorite ? "Unfavorite" : "Add to Favorites"}
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
