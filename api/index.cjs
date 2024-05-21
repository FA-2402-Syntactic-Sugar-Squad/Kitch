const express = require("express");
const apiRouter = express.Router();

apiRouter.get("/", (req, res) => {
  res.send("This is the root for /api")
});


//write route for recipes
const recipesRouter = require("./recipes.cjs");
apiRouter.use("/recipes", recipesRouter);

//write route for users
const usersRouter = require("./users.cjs");
apiRouter.use("/users", usersRouter);

//write route for ingredients
const ingredientsRouter = require("./ingredients.cjs");
apiRouter.use("/ingredients", ingredientsRouter);

//write route for recipies by ingredient id
const recipeByIngredientRouter = require("./recipesByIngredients.cjs");
apiRouter.use("/recipes/byIngredient", recipeByIngredientRouter);

//export
module.exports = apiRouter;