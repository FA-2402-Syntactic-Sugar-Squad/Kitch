require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//recipes: get all recipes

//recipes: find single recipe

//recipes: find review and/or rating under specific rating

//user: get profile
const getUserInfo = async(id) => {
  try{
    const userInfo = await prisma.users.findUnique({
      where: { id : id },
      include: {
        users_recipes: true,
        preferences: true,
      },
    });
    return userInfo;
  }catch(error){
    console.log("Error caught when trying to obtain user information", error)
  }
};

//user: post ratings and reviews on saved recipes
const updateRatingsAndReviews = async(id, rating, reviewMsg) => {
  //limit for rating (?) - could be a front end limitation
  try{
    const updatedRatingAndReview = await prisma.users_recipes.update({
      where: {
        id: id 
      }, data: {
        rating: rating,
        reviewMsg: reviewMsg,
      }
    });
    return updatedRatingAndReview;
  } catch(error){
    console.log("Error caught when creating a rating and review", error);
  }
};

//user: leave a rating and review on recipes that are not saved.
const createRatingAndReviewForRecipe = async (recipeId, rating, reviewMsg) => {
  try{
    const createdRatingAndReview = await prisma.users_recipes.create({
      data: {
        recipeId: recipeId,
        rating: rating,
        reviewMsg: reviewMsg,
      }
    });
    return createdRatingAndReview;
  }catch (error){
    console.log("Error caught when creating rating and review for recipe:", error);
  }
}

//user: view ratings and reviews
const viewAllRatingAndReviews = async (id) => {
  try{
    const allRatingAndReviews = await prisma.users_recipes.findMany({
      where: {
        id,
        rating: { not: null},
      }, select: {
        id: true,
        rating: true,
        reviewMsg: true,
      }
    });
    return allRatingAndReviews;
  }catch(error){
    console.log("Error caught when viewing ratings and reviews");
  }
};

//user: delete review and rating
const deleteRatingAndReview = async(id) => {
  //limit for rating (?) - could be a front end limitation
  try{
    const ratingAndReviewToDelete = await prisma.users_recipes.update({
      where: {
        id: id,
      }, data: {
        rating: null,
        reviewMsg: null
      }
    })
    return ratingAndReviewToDelete;
  } catch(error){
    console.log("Error caught when deleting a rating and review", error);
  }
};

//user: save a recipe
const saveARecipe = async (userId, recipeId) => {
  try{
    const savedRecipe = await prisma.users_recipes.create({
      data: {
        userId: userId,
        recipeId: recipeId,
      },
    });
    console.log("Recipe saved:", savedRecipe);
    return savedRecipe;
  }catch(error){
    console.log("Error caught when saving a recipe", error);
  }
};

//user: view all saved recipes
const viewAllSavedRecipes = async(userId) => {
  try{
    const savedRecipes = await prisma.users_recipes.findMany({
      where:{
        userId,
      },
    });
    if (savedRecipes.length === 0){
      return [];
    } 
    
    return savedRecipes;
    
  }catch (error) {
    console.log("Error caught when fetching all saved recipes", error);
  }
};
//user: check single saved recipe
const checkSingleSavedRecipe = async (userId, id) => {
  try {
    const savedRecipe = await prisma.users_recipes.findUnique({
      where: {
        id,
        userId
        },
      });
    return savedRecipe;
  } catch (error) {
    console.log("Error caught when checking if recipe is saved", error);
    return false;
  }
};

//delete a recipe
const deleteASavedRecipe = async (id) => {
  try{
    const deleteRecipe = await prisma.users_recipes.delete({
      where: {
        id
      },
    });
    return deleteRecipe;
  }catch(error) {
    console.log("Error caught when deleting a saved recipe", error);
  }
};

module.exports = { 
  getUserInfo,
  updateRatingsAndReviews,
  createRatingAndReviewForRecipe,
  viewAllRatingAndReviews,
  deleteRatingAndReview,
  saveARecipe,
  viewAllSavedRecipes,
  checkSingleSavedRecipe,
  deleteASavedRecipe
 }