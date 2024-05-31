import { useState } from 'react';
import Recipes from '../components/Recipes';
import Ingredients from '../components/Ingredients';
import RecipeDetails from '../components/RecipeDetails';
import Stack from 'react-bootstrap/Stack';
import '../styling/Home_Register.css'; // Import the custom CSS

const Home = ({ token, searchResults }) => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleSelectedRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  };

  return (
    <>
      <Stack direction="horizontal" gap={3} className="full-height">
        <div className="left-section p-2">
          <Ingredients />
        </div>
        <div className="vr" />
        <div className="center-section p-2">
          {selectedRecipe ? (
            <RecipeDetails token={token} recipe={selectedRecipe} />
          ) : (
            <p>Select a recipe to see details</p>
          )}
        </div>
        <div className="vr" />
        <div className="right-section p-2">
          <Recipes token={token} onRecipeSelect={handleSelectedRecipe} searchResults={searchResults} />
        </div>
      </Stack>
    </>
  );
};

export default Home;