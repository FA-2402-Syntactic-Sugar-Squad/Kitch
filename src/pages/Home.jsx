import { useState } from 'react';
import Recipes from '../components/Recipes';
import Ingredients from '../components/Ingredients';
import RecipeDetails from '../components/RecipeDetails';
import Stack from 'react-bootstrap/Stack';

import '../styling/Home_Register.css';
import '../styling/Animation.css';

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
            <div className="noodles">
              <div className="cap right"></div>
              <div className="cap back"></div>
              <div className="side right"></div>
              <div className="side back"></div>
              <div className="noodle noodles-1"></div>
              <div className="noodle noodles-2"></div>
              <div className="noodle noodles-3"></div>
              <div className="side left"></div>
              <div className="side front">
                <div className="eyes"></div>
                <div className="mouth"></div>
              </div>
              <div className="cap left"></div>
              <div className="cap front"></div>
            </div>
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
