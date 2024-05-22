import { useEffect, useState } from 'react';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const Recipes = ({ token, onRecipeSelect }) => {
  const [recipes, setRecipes] = useState([]);

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

  const handleClick = (recipe) => {
    onRecipeSelect(recipe);
  };

  if (!recipes) {
    return <h2>Loading..</h2>
  }

  return (
    <>
      <h3>Recipes</h3>
      {/* DISPLAY ALL RECIPES ON Home Page */}
      {token ? (
        <>
          {recipes.map((curRecipe) => {
            return (
              <Card style={{ width: '18rem' }} key={curRecipe.id}>
                <Card.Img variant="top" src={curRecipe.imageurl} />
                <Card.Body>
                  <Card.Title>{curRecipe.title}</Card.Title>
                  <Button variant="primary" onClick={() => handleClick(curRecipe)}>See Recipe</Button>
                </Card.Body>
              </Card >
            )
          })}
        </>
      ) : (
        <>
          {recipes.map((curRecipe) => {
            return (
              <Card style={{ width: '18rem' }} key={curRecipe.id}>
                <Card.Img variant="top" src={curRecipe.imageurl} />
                <Card.Body>
                  <Card.Title>{curRecipe.title}</Card.Title>
                  <Card.Text>
                    Must be logged in to see details.
                  </Card.Text>
                  <Button variant="primary">See Recipe</Button>
                </Card.Body>
              </Card >
            )
          })}
        </>
      )}
    </>
  )
}

export default Recipes;