const axios = require('axios');
require("dotenv").config();

//fetch from api
async function fetchRecipeData(recipeName) {
  try {
      const response = await axios.get(`https://api.spoonacular.com/recipes/search?query=${recipeName}&apiKey=67d97bb0c30f43d5840b1867b0757815`);
      return response.data.results;
  } catch (error) {
      console.error('Error fetching data from Spoonacular API:', error);
      throw error;
  }
}
//get results and seed into database 
module.exports = { fetchRecipeData };