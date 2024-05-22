import React from 'react'
import Select from 'react-select'

const Searchbar = () => {

  const loadOptions = async (inputValue) => {
    try {
      
      const response = await fetch(`/api/ingredients/search?query=${inputValue}`);
      const data = await response.json();

      const options = data.map(item => ({
        value: item.id, 
        label: item.name 
      }));

      return options;
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  };

  return <Select loadOptions={loadOptions} />;
}

export default Searchbar;
