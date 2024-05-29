import React, { useState, useEffect} from 'react';
import axios from 'axios';
import AddReview from './AddReview.jsx';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const RecipeDetails = ({ token, recipe }) => {
  const [message, setMessage] = useState('');

  const saveRecipe = async () => {
    try {
      const response = await fetch (`/api/users/save-recipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      })

      if (response.status === 200) {
        setMessage('Recipe saved successfully!');
      } else {
        setMessage('Failed to save the recipe.');
      }
    } catch (error) {
      setMessage('An error occurred while saving the recipe.');
    }
  };

  if (!recipe) {
    return <p>Select a recipe to see details.</p>;
  }

  return (
    <> 
      {token ? (
        <>
          <Card style={{ width: '18rem' }} >
            <Card.Img variant="top" src={recipe.imageurl} />
            <Card.Body>
              <Card.Title>{recipe.title}</Card.Title>
              <Card.Text>
                Instructions: {recipe.instructions}<br />
                Servings: {recipe.servings}<br />
                Diet: {recipe.diet}<br />
                Rating and Reviews: {recipe.ratingsAndReviews}<br />
                <AddReview />
              </Card.Text>
              <Button variant="primary" onClick={saveRecipe}>Save Recipe</Button>
              {message && <p>{message}</p>}
            </Card.Body>
          </Card >
        </>
      ) : (
        <p>Must be logged in to see details.</p>
      )}
      {/*Tier two: Add an alert that brings up the login form*/}
    </>
  );
};

export default RecipeDetails;
