import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AddReview from './AddReview.jsx';

const RecipeDetails = ({token}) => {
  const[recipeDetails, setRecipeDetails] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  const recipeId = parseInt(params.id);

  useEffect(() => {
    const fetchDetails = async () => {
      try{
        const response = await fetch(`/api/recipes/${recipeId}`);
        const allRecipeDetails = await response.json();
        setRecipeDetails(allRecipeDetails);
      }catch(error){
        console.error("Error when trying to fetch recipe details", error);
      }
    }
    fetchDetails();
  }, [])


  return (
    <>
      {token ? (
      <div>
        <h1>{recipeDetails.title}</h1>
        <p>Instructions: {recipeDetails.instructions}</p>
        <p>Servings: {recipeDetails.servings}</p>
        <p>Diet: {recipeDetails.diets}</p>
        <p>Rating and Reviews: {recipeDetails.ratingsAndReviews}<div>{<AddReview />}</div></p>
        
        <button onClick={() => navigate("/")}>Back</button>
      </div>
      ) : 
      <p>Must be logged in to see details.</p>}
      {/*Tier two: Add an alert that brings up the login form*/}
    </>
  )
}

export default RecipeDetails;