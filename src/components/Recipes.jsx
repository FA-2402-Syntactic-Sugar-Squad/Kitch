import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import axios from 'axios';

import "../App.css";

const Recipes = ({ token, onRecipeSelect, searchResults, isAdmin }) => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchAllRecipes = async () => {
      try {
        const result = await fetch(`/api/recipes/`);
        const recipeResult = await result.json();
        setRecipes(recipeResult);
      } catch (error) {
        console.error("Error when trying to fetch all recipes", error);
      }
    }
    fetchAllRecipes();
  }, []);


  const handleClick = (recipe) => {
    if (token) {
      onRecipeSelect(recipe);
    } else {
      alert('You must be logged in to see the recipe details.');
    }
  };

  const handleEdit = async (recipeId) => {
    const newImageUrl = prompt('Enter the new image URL:');
    if (!newImageUrl) return;

    try {
      await axios.put(`/api/admin/${recipeId}`, { newImageUrl }, {
        headers: {
          "Authorization": `Bearer ${token}`
        },
      });
      const updatedRecipes = recipes.map(recipe =>
        recipe.id === recipeId ? { ...recipe, imageurl: newImageUrl } : recipe
      );
      setRecipes(updatedRecipes);
    } catch (error) {
      console.log('Error when trying to update image on front end.', error);
    }
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      See details
    </Tooltip>
  );
  //Button handlers end

  const recipesToDisplay = searchResults.length > 0 ? searchResults : recipes;

  if (!recipes) {
    return <h2>Loading..</h2>
  };

  return (
    <>
      <h3>Recipes</h3>
      {recipesToDisplay.length > 0 ? (
        recipesToDisplay.map((curRecipe) => (
          <OverlayTrigger
            key={curRecipe.id}
            placement="left"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip}
          >
            <Card style={{ width: '19rem' }} onClick={() => handleClick(curRecipe)} >
              <Card.Img variant="top" src={curRecipe.imageurl} className="recipe-img"/>
              <Card.Body>
                <Card.Title>{curRecipe.title}</Card.Title>
                {isAdmin && (
                  <Button variant="warning" onClick={() => handleEdit(curRecipe.id)}>Edit</Button>
                )}
              </Card.Body>
            </Card>
          </OverlayTrigger>
        ))
      ) : (
        <p>No recipes found.</p>
      )}
    </>
  );
};

export default Recipes;
