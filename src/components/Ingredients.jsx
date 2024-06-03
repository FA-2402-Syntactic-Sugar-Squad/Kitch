import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import './Ingredients.css'; 

const Ingredients = ({ selectedIngredients = [], setSelectedIngredients }) => {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await fetch('/api/ingredients');
        const data = await response.json();
        setIngredients(data);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      }
    };

    fetchIngredients();
  }, []);

  const handleIngredientClick = (ingredient) => {
    const ingredientId = ingredient.id;
    const ingredientName = ingredient.name;
    const selectedIngredient = { id: ingredientId, name: ingredientName };

    if (selectedIngredients.some(ingredient => ingredient.id === ingredientId)) {
      setSelectedIngredients(selectedIngredients.filter(ingredient => ingredient.id !== ingredientId));
    } else {
      setSelectedIngredients([...selectedIngredients, selectedIngredient]);
    }
  };

  return (
    <Container>
      <h2>All Ingredients</h2>
      <div className="ingredients-container">
        {ingredients.map(ingredient => (
          <Button
            key={ingredient.id}
            variant={selectedIngredients.some(selected => selected.id === ingredient.id) ? 'primary' : 'outline-primary'}
            className="ingredient-button"
            onClick={() => handleIngredientClick(ingredient)}
          >
            {ingredient.name}
          </Button>
        ))}
      </div>
    </Container>
  );
};

export default Ingredients;
