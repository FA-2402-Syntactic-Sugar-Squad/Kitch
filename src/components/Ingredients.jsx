import React, { useState, useEffect } from 'react';

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
   
    fetchRecipesByIngredient()
       
  };

  return (
    <div>
      <h2>Select your ingredients</h2>
      <form onSubmit={handleSubmit}>
        {Object.entries(ingredientsByCategory).map(([category, categoryIngredients]) => (
          <div key={category}>
            <h3>{category}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {categoryIngredients.map((ingredient) => (
                <label key={ingredient.id} style={{ margin: '10px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
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
        <button type="submit" style={{ marginTop: '10px' }}>Search</button>
      </form>
    </div>
  );
};

export default Ingredients;
