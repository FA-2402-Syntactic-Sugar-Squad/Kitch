import { useState } from 'react';
import Recipes from '../components/Recipes';
import Ingredients from '../components/Ingredients';
import RecipeDetails from '../components/RecipeDetails';
import Stack from 'react-bootstrap/Stack';
import '../styling/Home_Register.css'; 

const Home = ({ token, searchResults, isAdmin, selectedIngredients, setSelectedIngredients }) => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleSelectedRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  };

  return (
    <>
      <Stack direction="horizontal" gap={3} className="full-height">
        <div className="left-section p-2">
          <Ingredients 
            selectedIngredients={selectedIngredients} 
            setSelectedIngredients={setSelectedIngredients} 
            token={token} 
            isAdmin={isAdmin}
          />
        </div>
        <div className="vr" />
        <div className="center-section p-2">
          {selectedRecipe ? (
            <RecipeDetails 
              token={token} 
              recipe={selectedRecipe} 
              isAdmin={isAdmin} 
            />
          ) : (
            <p>Select a recipe to see details</p>
          )}
        </div>
        <div className="vr" />
        <div className="right-section p-2">
          <Recipes 
            token={token} 
            onRecipeSelect={handleSelectedRecipe} 
            searchResults={searchResults} 
            isAdmin={isAdmin} 
          />
        </div>
      </Stack>
    </>
  );
};

export default Home;
