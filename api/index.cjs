const express = require("express");
const apiRouter = express.Router();

apiRouter.get("/", (req, res) => {
  res.send("This is the root for /api")
});

//write route for ingredients

//write route for recipes
const recipesRouter = require("./recipes.cjs");
apiRouter.use("/recipes", recipesRouter);

//write route for auth

//export
module.exports = apiRouter;