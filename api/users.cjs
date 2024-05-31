//imports
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { getUserInfo, updateUserPreferences, updateRating, updateReview, viewAllRatingAndReviews, deleteRatingAndReview, saveARecipe, viewAllSavedRecipes, checkSingleSavedRecipe } = require("../db/index.cjs");
const { verifyToken } = require("../auth/middleware.cjs");
const express = require("express");
const usersRouter = express.Router();

//PATH: api/users/
usersRouter.get("/", async (req, res) => {
  res.send("This is the users route");
});

//GET: Profile
usersRouter.get("/profile", verifyToken, async (req, res) => {
  try {
    const id = req.user.id;

    const fetchProfile = await getUserInfo(id);
    if (!fetchProfile) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send(fetchProfile);
  } catch (error) {
    console.log("Error caught when fetching profile");
    res.status(500).send({ message: "Internal server error" });
  }
});

//PUT: update preferences
usersRouter.put("/preferences", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const newPreferences = req.body;

    const updatedPreferences = await updateUserPreferences(userId, newPreferences);
    res.send(updatedPreferences);
  } catch (error) {
    console.log("Error caught when updating preferences", error);
  }
});

usersRouter.put("/update-rating/:id", verifyToken, async (req, res) => {
  try {
    const { rating } = req.body;
    const userId = req.user.userId;
    const recipeId = parseInt(req.params.id);

    const updatedRating = await updateRating(recipeId, userId, rating);
    res.send(updatedRating);
  } catch (error) {
    console.log("Error caught when updating rating:", error);
    res.status(500).send({ message: "Failed to update rating" });
  }
});

usersRouter.put("/update-review/:id", verifyToken, async (req, res) => {
  try {
    const { reviewMsg } = req.body;
    const userId = req.user.userId;
    const recipeId = parseInt(req.params.id);

    const updatedReview = await updateReview(recipeId, userId, reviewMsg);
    res.send(updatedReview);
  } catch (error) {
    console.log("Error caught when updating review:", error);
    res.status(500).send({ message: "Failed to update review" });
  }
});

//GET: see their reviews & ratings
usersRouter.get("/ratings-and-reviews", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const viewMyRatingsAndReviews = await viewAllRatingAndReviews(userId);
    res.send(viewMyRatingsAndReviews);
  } catch (error) {
    console.log("Error caught when fetching all ratings and reviews:", error);
  }
});

//DELETE: delete reviews & ratings
usersRouter.put("/ratings-and-reviews/:id", verifyToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    // const { rating, reviewMsg } = req.body;

    const deleteCurrentReviewAndRating = await deleteRatingAndReview(id);
    res.send(deleteCurrentReviewAndRating);
  } catch (error) {
    console.log("Error caught when deleting rating and review:", error);
  }
});

//POST: save recipes
usersRouter.post("/save-recipe", verifyToken, async (req, res) => {
  try {
    const { userId, recipeId } = req.body;
    const saveCurRecipe = await saveARecipe(userId, recipeId);
    res.send(saveCurRecipe);
  } catch (error) {
    console.log("Error caught when saving a recipe:", error)
  }
});

//GET: see all saved recipes
usersRouter.get("/saved-recipes", async (req, res) => {
  try {
    const userId = req.query.userId;
    const savedRecipe = await viewAllSavedRecipes(userId);
    res.send(savedRecipe);
  } catch (error) {
    console.log("Error caught when fetching all saved recipes:", error)
  }
});

//GET: see 1 saved recipe
usersRouter.get("/saved-recipes/:id", verifyToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const id = parseInt(req.params.id);

    const currentRecipe = await checkSingleSavedRecipe(userId, id);
    res.send(currentRecipe);
  } catch (error) {
    console.log("Error caught when seeing single recipe", error);
  }
});

//Delete recipe
usersRouter.delete("/saved-recipes/:userId/:recipeId", async (req, res) => {
  const userId = parseInt(req.params.userId);
  const recipeId = parseInt(req.params.recipeId);
  try {
    await prisma.users_recipes.deleteMany({
      where: {
        userId: userId,
        recipeId: recipeId
      }
    });
    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//export
module.exports = usersRouter;