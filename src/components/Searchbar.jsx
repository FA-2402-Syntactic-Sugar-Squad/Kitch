import React from "react";
import AsyncSelect from "react-select/async";

import "../App.css";
import Container from "react-bootstrap/esm/Container";

const Searchbar = ({ onRecipesFetched }) => {
  const loadOptions = async (inputValue) => {
    try {
      const response = await fetch(`/api/ingredients/search?query=${inputValue}`);
      const data = await response.json();

      const options = data.map((item) => ({
        value: item.id,
        label: item.name,
      }));

      return options;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const handleSelectChange = async (selectedOptions) => {
    try {
      const selectedValues = selectedOptions.map(option => option.value);

      const response = await fetch('/api/recipes/byIngredient/' + selectedValues.join(','));
      const recipes = await response.json();
      onRecipesFetched(recipes);

      console.log('Recipes:', recipes);


    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  return (
    <Container>
      <AsyncSelect
        isMulti
        cacheOptions
        loadOptions={loadOptions}
        onChange={handleSelectChange}
      />
    </Container>

  );
};

export default Searchbar;
