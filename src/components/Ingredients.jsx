import { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

const Ingredients = ({ token, isAdmin }) => {
  const [ingredientsByCategory, setIngredientsByCategory] = useState({});
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [deletedIngredients, setDeletedIngredients] = useState([]);

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

  const handleIngredientClick = (ingredientId) => {
    setSelectedIngredients((prevSelectedIngredients) => {
      if (prevSelectedIngredients.includes(ingredientId)) {
        return prevSelectedIngredients.filter(id => id !== ingredientId);
      } else {
        return [...prevSelectedIngredients, ingredientId];
      }
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try{
      const shouldFetchRecipes = selectedIngredients.length > 0;
      if (shouldFetchRecipes){
        await fetchRecipesByIngredient();
      } else {
        await Promise.all(
          selectedIngredients.map(ingredientId =>
            axios.delete(`/api/admin/ingredients/${ingredientId}`, {
              headers: {
                "Authorization": `Bearer ${token}`
              }
            })
          )
        );
        setDeletedIngredients(selectedIngredients);
        setSelectedIngredients([]);
      }
    } catch (error) {
      console.log('Error caught when deleting ingredients', error);
    }
  };

  const handleEdit = (ingredient) => {
    // Logic to handle edit
  };

  return (
    <>
      <h2>Select your ingredients</h2>
      {isAdmin && selectedIngredients.length > 0 && (
        <p>Deleted ingredients: {deletedIngredients.join(', ')}</p>
      )}
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
        <Button type="submit" className="btn btn-primary mt-3">Search</Button>
        {isAdmin && (
            <Button
              variant="danger"
              type="button"
              className="btn btn-danger mt-3 ml-3"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete the selected ingredients?')) {
                  handleSubmit();
                }
              }}
              disabled={selectedIngredients.length === 0}
            >
              Delete
            </Button>
          )}
      </Form>
    </>
  );
};

export default Ingredients;
