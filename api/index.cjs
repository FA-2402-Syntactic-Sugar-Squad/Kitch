const express = require("express");
const apiRouter = express.Router();

apiRouter.get("/", (req, res) => {
  res.send("This is the root for /api")
});

//write route for ingredients
const ingredientsRouter = require("./ingredients.cjs");
apiRouter.use("/ingredients", ingredientsRouter);

//write route for recipes
const recipesRouter = require("./recipes.cjs");
apiRouter.use("/recipes", recipesRouter);

//write route for users
const usersRouter = require("./users.cjs");
apiRouter.use("/users", usersRouter);

//export
module.exports = apiRouter;