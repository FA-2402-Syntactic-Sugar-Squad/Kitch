import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

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

  //Button handlers start
  const handleClick = (recipe) => {
    onRecipeSelect(recipe);
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
  //Button handlers end

  const recipesToDisplay = searchResults.length > 0 ? searchResults : recipes;

  if (!recipes) {
    return <h2>Loading..</h2>
  };

  return (
    <>
      <h3>Recipes</h3>
      {recipesToDisplay.length > 0 ? (
        recipesToDisplay.map((curRecipe) => {
          return (
            <Card style={{ width: '18rem' }} key={curRecipe.id}>
              <Card.Img variant="top" src={curRecipe.imageurl} />
              <Card.Body>
                <Card.Title>{curRecipe.title}</Card.Title>
                {token ? (
                  <>
                    <Button variant="primary" onClick={() => handleClick(curRecipe)}>See Recipe</Button>
                    {isAdmin && (
                      <Button variant="warning" onClick={() => handleEdit(curRecipe.id)}>Edit</Button>
                    )}
                  </>
                ) : (
                  <>
                    <Card.Text>Must be logged in to see details.</Card.Text>
                    <Button variant="primary">See Recipe</Button>
                  </>
                )}
              </Card.Body>
            </Card>
          );
        })
      ) : (
        <p>No recipes found.</p>
      )}
    </>
  );
}

export default Recipes;
