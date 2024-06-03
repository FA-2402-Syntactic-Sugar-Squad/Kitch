import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

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

  const handleIngredientChange = (event) => {
    const ingredientId = event.target.value;
    const ingredientName = event.target.name;
    const selectedIngredient = { id: ingredientId, name: ingredientName };

    if (event.target.checked) {
      if (!selectedIngredients.some(ingredient => ingredient.id === ingredientId)) {
        setSelectedIngredients([...selectedIngredients, selectedIngredient]);
      }
    } else {
      setSelectedIngredients(selectedIngredients.filter(ingredient => ingredient.id !== ingredientId));
    }
  };

  return (
    <Container>
      <h2>All Ingredients</h2>
      <Form>
        {ingredients.map(ingredient => (
          <Form.Check
            key={ingredient.id}
            type="checkbox"
            label={ingredient.name}
            value={ingredient.id}
            name={ingredient.name}
            onChange={handleIngredientChange}
            // checked={selectedIngredients.some(selected => selected.id === ingredient.id)}
          />
        ))}
      </Form>
    </Container>
  );
};

export default Ingredients;
