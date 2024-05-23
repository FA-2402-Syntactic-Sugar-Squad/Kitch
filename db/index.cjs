require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// *** ATTN: ADMIN FUNCTIONS START *** \\
//admin: get all ratings and reviews
const adminPrivRatingsAndReviews = async () => {
  try{
    const allUserRatingsAndReviews = await prisma.ratingsAndReviews.findMany({
      include: {
        recipe: true, //including related recipe data
      }
    });
    return allUserRatingsAndReviews;
  } catch(error){
    console.log("Error caught when fetching everyone's rating and reviews:", error);
  }
};

//admin: delete reviews
const adminPrivDeleteReviewMsg = async (id) => {
  try{
    const updatedRatingAndReview = await prisma.ratingsAndReviews.update({
      where: {id: id},
      data: {reviewMsg: ""}, //could not update to null since the field is not nullable
    });
    return updatedRatingAndReview;
  }catch(error){
    console.log("Error deleting review message:", error);
  }
};

// *** ATTN: ADMIN FUNCTIONS END *** \\


// *** ATTN: USERS FUNCTIONS START *** \\
//user: get profile
const getUserInfo = async(id) => {
  try{
    const userInfo = await prisma.users.findUnique({
      where: { id : id },
      select: {
        id: true,
        username: true,
        email: true,
        users_recipes: true,
        preferences: true,
        isadmin: true,
      },
    });
    return userInfo;
  }catch(error){
    console.log("Error caught when trying to obtain user information", error)
  }
};

//user: update preferences
const updateUserPreferences = async(userId, newPreferences) => {
  try{
    const preferenceRecord = await prisma.preferences.findFirst({
      where: {
        userId: userId,
      },
    });

    if(!preferenceRecord){
      throw new Error("Preferences not found");
    }

    const updatedPreferences = await prisma.preferences.update({
      where: { id: preferenceRecord.id },
      data: newPreferences,
      select: {
        glutenFree: true,
        ketogenic: true,
        lactoVegetarian: true,
        ovoVegetarian: true,
        vegan: true,
        pescetarian: true,
        paleo: true,
        primal: true,
        lowFODMAP: true,
        whole30: true,
      },
    });
    return updatedPreferences;
  }catch(error){
    console.log("Error caught when trying to update user preferences", error);
  }
};

//user: post ratings and reviews on saved recipes
const updateRatingsAndReviews = async(id, rating, reviewMsg) => {
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

//user: leave a rating and review on recipes that are not saved. NOT WORKING
const createRatingAndReviewForRecipe = async (recipeId, rating, reviewMsg) => {
  try{
    const ratingFloat = parseFloat(rating)
    const createdRatingAndReview = await prisma.ratingsAndReviews.create({
      data: {
        recipeId: recipeId,
        rating: ratingFloat,
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
// *** ATTN: USERS FUNCTIONS END *** \\


module.exports = { 
  adminPrivRatingsAndReviews,
  adminPrivDeleteReviewMsg,
  getUserInfo,
  updateUserPreferences,
  updateRatingsAndReviews,
  createRatingAndReviewForRecipe,
  viewAllRatingAndReviews,
  deleteRatingAndReview,
  saveARecipe,
  viewAllSavedRecipes,
  checkSingleSavedRecipe,
  deleteASavedRecipe
 }