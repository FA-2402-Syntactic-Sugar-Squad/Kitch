import Recipes from "../components/Recipes";

const Home = ({ token }) => {
  return (
    <>
      <h3>Home Page</h3>
      {/* Ternary: If non-logged in user clicks a recipe, prompt to login*/}
      {/* DISPLAY ALL RECIPES FROM RECIPES.JSX */}
      {/* DISPLAY ALL Ingredients FROM ingredients.JSX */}
      <Recipes />
    </>
  )
}

export default Home;