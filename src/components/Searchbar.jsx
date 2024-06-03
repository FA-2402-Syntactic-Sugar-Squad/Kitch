import React from 'react';
import AsyncSelect from 'react-select/async';
import Container from 'react-bootstrap/Container';

const Searchbar = ({ selectedIngredients, setSelectedIngredients }) => {
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
      console.error('Error fetching data:', error);
      return [];
    }
  };

  const handleSelectChange = (selectedOptions) => {
    const selectedValues = selectedOptions.map(option => ({
      id: option.value,
      name: option.label,
    }));
    setSelectedIngredients(selectedValues);
  };

  return (
    <Container>
      <AsyncSelect
        isMulti
        cacheOptions
        loadOptions={loadOptions}
        value={selectedIngredients.map(ingredient => ({ value: ingredient.id, label: ingredient.name }))}
        onChange={handleSelectChange}
      />
    </Container>
  );
};

export default Searchbar;
