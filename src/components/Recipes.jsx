import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllRecipes = async () => {
      try {
        const result = await fetch(`/api/recipes/`);
        const recipeResult = await result.json();
        setRecipes(recipeResult);
        //console.log(recipes);
      } catch (error) {
        console.error("Error when trying to fetch all recipes", error);
      }
    }
    fetchAllRecipes();
  }, []);

  const handleClick = (recipeId) => {
    navigate(`/recipes/${recipeId}`);
  }
  if (!recipes) {
    return <h2>Loading..</h2>
  }

  return (
    <>
      <h3>Recipes</h3>
      {/* DISPLAY ALL RECIPES ON Home Page */}
      {recipes.map((curRecipe) => {
        return (
          <div key={curRecipe.id}>
            <h6>{curRecipe.title}</h6>
            <img src={curRecipe.imageurl} />
            <p>{curRecipe.diets}</p>
            <button onClick={() => handleClick(curRecipe.id)}>See Details</button>
          </div>
        )
      })}
    </>
  )
}

export default Recipes;