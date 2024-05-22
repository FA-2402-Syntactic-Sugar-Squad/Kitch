import { useState } from 'react';

import Recipes from "../components/Recipes";
import Ingredients from "../components/Ingredients";
import RecipeDetails from "../components/RecipeDetails";

import Stack from 'react-bootstrap/Stack';

const Home = ({ token }) => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleSelectedRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  };

  return (
    <>
      <h3>Home Page</h3>
      <Stack direction="horizontal" gap={3}>
        <div className="p-2"><Ingredients /></div>
        <div className="vr" />
        <div className="p-2">
          {selectedRecipe ? (
            <RecipeDetails token={token} recipe={selectedRecipe}/>
          ) : (
            <p>Select a recipe to see details</p>
          )}
          </div>
        <div className="vr" />
        <div className="p-2"><Recipes token={token} onRecipeSelect={handleSelectedRecipe}/></div>
      </Stack>
    </>
  )
}

export default Home;