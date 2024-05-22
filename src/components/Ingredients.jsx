import { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

const Ingredients = () => {
  const [ingredientsByCategory, setIngredientsByCategory] = useState({});
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/ingredients');
        const data = await response.json();


        const groupedIngredients = data.reduce((acc, ingredient) => {
          if (!acc[ingredient.category]) {
            acc[ingredient.category] = [];
          }
          acc[ingredient.category].push(ingredient);
          return acc;
        }, {});

        setIngredientsByCategory(groupedIngredients);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      }
    };

    fetchData();
  }, []);

  const handleIngredientClick = (ingredientId) => {
    setSelectedIngredients((prevSelectedIngredients) => {
      if (prevSelectedIngredients.includes(ingredientId)) {
        return prevSelectedIngredients.filter(id => id !== ingredientId);
      } else {
        return [...prevSelectedIngredients, ingredientId];
      }
    });
  };

  const fetchRecipesByIngredient = async () => {
    try {
      const selectedIngredientIds = selectedIngredients.join(',');
      console.log("ingredient IDs:", selectedIngredientIds)

      const response = await fetch(`/api/recipes/byIngredient/${selectedIngredientIds}`);
      //can get recipesIds here for future use
      const recipes = await response.json();
      console.log('Recipes:', recipes);
    } catch (error) {
      console.error('Error fetching recipes by ingredient:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchRecipesByIngredient();

  };

  return (
    <>
      <h2>Select your ingredients</h2>
      <Form onSubmit={handleSubmit}>
        {Object.entries(ingredientsByCategory).map(([category, categoryIngredients]) => (
          <div key={category}>
            <h3>{category}</h3>
            <div className="d-flex flex-wrap">
              {categoryIngredients.map((ingredient) => (
                <label key={ingredient.id} className="m-2 p-2 border rounded" style={{ display: 'inline-block' }}>
                  <input
                    type="checkbox"
                    checked={selectedIngredients.includes(ingredient.id)}
                    onChange={() => handleIngredientClick(ingredient.id)}
                  />
                  {ingredient.name}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button type="submit" className="btn btn-primary mt-3">Search</button>
      </Form>
    </>
  );
};

export default Ingredients;
