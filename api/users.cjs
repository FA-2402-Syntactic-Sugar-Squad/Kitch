//imports
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { getUserInfo, updateUserPreferences, updateRatingsAndReviews, viewAllRatingAndReviews, deleteRatingAndReview, saveARecipe, viewAllSavedRecipes, deleteASavedRecipe, checkSingleSavedRecipe, createRatingAndReviewForRecipe } = require("../db/index.cjs");
const { verifyToken } = require("../auth/middleware.cjs");
const express = require("express");
const usersRouter = express.Router();

//PATH: api/users/
usersRouter.get("/", async (req, res) => {
  res.send("This is the users route");
});

//GET: Profile
usersRouter.get("/profile", verifyToken, async (req, res) => {
  try{
    const id = req.user.id;

    const fetchProfile = await getUserInfo(id);
    if (!fetchProfile) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send(fetchProfile);
  } catch (error) {
    console.log("Error caught when fetching profile");
    res.status(500).send({message: "Internal server error"});
  }
});

//PUT: update preferences
usersRouter.put("/preferences", verifyToken, async (req, res) => {
  try{
    const id = req.user.id;
    const newPreferences = req.body;

    const updatedPreferences = await updateUserPreferences(id, newPreferences);
    if(!updatedPreferences){
      return res.status(404).send({message: "Preferences not found"});
    }
    res.send(updatedPreferences);
  }catch(error){
    console.log("Error caught when updating preferences", error);
  }
});

//PUT: update reviews & ratings on saved recipes
usersRouter.put("/update-rating-and-review/:id", verifyToken, async (req, res) => {
  try{
    const { rating, reviewMsg } = req.body;
    const userId = req.user.userId;
    const savedRecipeId = parseInt(req.params.id);

    const updatedRatingAndReview = await updateRatingsAndReviews(savedRecipeId, rating, reviewMsg);
    res.send(updatedRatingAndReview);
  }catch(error){
    console.log("Error caught when creating rating and review:", error);
  }
});

//Post: create reviews and ratings on non-saved recipes anonymously - NOT WORKING
usersRouter.post("/recipes/:recipeId/ratings-reviews", async (req, res) => {
  try{
    const { rating, reviewMsg } = req.body;
    const recipeId= parseInt(req.params.recipeId);

    const createdRatingAndReview = await createRatingAndReviewForRecipe(recipeId, rating, reviewMsg);
    res.send(createdRatingAndReview);
  } catch(error){
    res.status(500).send({ message: "Failed to create rating and review" });
  }
})

//GET: see their reviews & ratings
usersRouter.get("/ratings-and-reviews", verifyToken, async (req, res) => {
  try{
    const userId = req.user.userId;
    const viewMyRatingsAndReviews = await viewAllRatingAndReviews(userId);
    res.send(viewMyRatingsAndReviews);
  }catch(error){
    console.log("Error caught when fetching all ratings and reviews:", error);
  }
});

//DELETE: delete reviews & ratings
usersRouter.put("/ratings-and-reviews/:id", verifyToken, async (req, res) => {
  try{
    const id = parseInt(req.params.id);
    // const { rating, reviewMsg } = req.body;

    const deleteCurrentReviewAndRating = await deleteRatingAndReview(id);
    res.send(deleteCurrentReviewAndRating);
  }catch(error){
    console.log("Error caught when deleting rating and review:", error);
  }
});

//POST: save recipes
usersRouter.post("/save-recipe", verifyToken, async (req, res) => {
  try{
    const { userId, recipeId } = req.body;
    const saveCurRecipe = await saveARecipe(userId, recipeId);
    res.send(saveCurRecipe);
  } catch(error){
    console.log("Error caught when saving a recipe:", error)
  }
});

//GET: see all saved recipes
usersRouter.get("/saved-recipes", verifyToken, async (req, res) => {
  try{
    const { userId } = req.user;

    const savedRecipe = await viewAllSavedRecipes(userId);
    res.send(savedRecipe);
  } catch(error){
    console.log("Error caught when fetching all saved recipes:", error)
  }
});

//GET: see 1 saved recipe
usersRouter.get("/saved-recipes/:id", verifyToken, async (req, res) => {
  try{
    const { userId } = req.user;
    const id = parseInt(req.params.id);

    const currentRecipe = await checkSingleSavedRecipe(userId, id);
    res.send(currentRecipe);
  }catch(error){
    console.log("Error caught when seeing single recipe", error);
  }
});

//Delete recipe
usersRouter.delete("/saved-recipes/:id", verifyToken, async (req, res) => {
  try{
    const { userId } = req.user;
    const id = parseInt(req.params.id);

    const deleteRecipe = await deleteASavedRecipe(id);
    res.send(deleteRecipe);
  }catch(error){
    console.log("Error caught when deleting a recipe", error);
    res.status(500).send({ message: "Failed to delete recipe" });
  }
});

//export
module.exports = usersRouter;