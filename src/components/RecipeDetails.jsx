import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import AddReview from './AddReview.jsx';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const RecipeDetails = ({ token, recipe }) => {
  // const[recipeDetails, setRecipeDetails] = useState("");
  // const navigate = useNavigate();
  // const params = useParams();
  // const recipeId = parseInt(params.id);

  // useEffect(() => {
  //   const fetchDetails = async () => {
  //     try{
  //       const response = await fetch(`/api/recipes/${recipeId}`);
  //       const allRecipeDetails = await response.json();
  //       setRecipeDetails(allRecipeDetails);
  //     }catch(error){
  //       console.error("Error when trying to fetch recipe details", error);
  //     }
  //   }
  //   fetchDetails();
  // }, [])
  if (!recipe) {
    return <p>Select a recipe to see details.</p>
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
                Instructions: {recipe.instructions},
                Servings: {recipe.servings},
                Diet: {recipe.diet},
                Rating and Reviews: {recipe.ratingsAndReviews}
                <AddReview />
              </Card.Text>
              <Button variant="primary">Save Recipe</Button>
            </Card.Body>
          </Card >
        </>
      ) :
        <p>Must be logged in to see details.</p>}
      {/*Tier two: Add an alert that brings up the login form*/}
    </>
  )
}

export default RecipeDetails;