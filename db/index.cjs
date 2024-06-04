require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

// *** ATTN: ADMIN FUNCTIONS START *** \\
//admin: get all ratings and reviews
const adminPrivRatingsAndReviews = async () => {
  try {
    const allUserRatingsAndReviews = await prisma.ratingsAndReviews.findMany({
      include: {
        recipe: true, //including related recipe data
      }
    });
    return allUserRatingsAndReviews;
  } catch (error) {
    console.log("Error caught when fetching everyone's rating and reviews:", error);
  }
};

//admin: delete reviews
const adminPrivDeleteReviewMsg = async (id) => {
  try {
    const updatedRatingAndReview = await prisma.ratingsAndReviews.update({
      where: { id: id },
      data: { reviewMsg: "" }, //could not update to null since the field is not nullable
    });
    return updatedRatingAndReview;
  } catch (error) {
    console.log("Error deleting review message:", error);
  }
};

const adminPrivUpdateRecipeImageUrl = async (recipeId, newImageUrl) => {
  try {
    const recipe = await prisma.recipes.findUnique({
      where: {
        id: recipeId,
      },
    });
    if (!recipe) {
      throw new Error(`Recipe with ID ${recipeId} not found`);
    }
    const updatedRecipeImage = await prisma.recipes.update({
      where: {
        id: recipeId,
      },
      data: {
        imageurl: newImageUrl,
      },
    });
    console.log(`Successfully updated image URL for recipe with ID ${recipeId}.`);
    return updatedRecipeImage;
  } catch (error) {
    console.log("Error caught when updating an image on recipes", error);
  }
};
// *** ATTN: ADMIN FUNCTIONS END *** \\


// *** ATTN: USERS FUNCTIONS START *** \\
//user: get profile
const getUserInfo = async (id) => {
  try {
    const userInfo = await prisma.users.findUnique({
      where: { id: id },
      select: {
        id: true,
        username: true,
        email: true,
        users_recipes: true,
        preferences: true,
        isadmin: true,
      },
    });
    console.log("Fetched user info:", userInfo);
    return userInfo;
  } catch (error) {
    console.log("Error caught when trying to obtain user information", error)
  }
};

//user: update preferences
const updateUserPreferences = async (userId, newPreferences) => {
  try {
    let preferenceRecord = await prisma.preferences.findFirst({
      where: {
        userId: userId,
      },
    });

    if (!preferenceRecord) {
      // Create a new preferences record if none exists
      preferenceRecord = await prisma.preferences.create({
        data: { userId: userId, ...newPreferences }
      });
    } else {
      // Update the existing preferences record
      preferenceRecord = await prisma.preferences.update({
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
    }
    console.log("Updated preferences in the database:", preferenceRecord);
    return preferenceRecord;
  } catch (error) {
    console.log("Error caught when trying to update user preferences", error);
  }
};

const updateUserPassword = async (userId, currentPassword, newPassword) => {
  try {
    const user = await prisma.users.findUnique({ where: { id: userId } });

    if (!user) {
      throw new Error("User not found");
    }

    // Verify current password
    const isPasswordValid = bcrypt.compareSync(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Hash the new password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return updatedUser;
  } catch (error) {
    console.log("Error caught when trying to update user password", error);
    throw error;
  }
};

//user: update ratings on saved recipes
const updateRating = async (recipeId, userId, rating) => {
  try {
    const updatedRating = await prisma.users_recipes.update({
      where: {
        userId_recipeId: {
          userId: userId,
          recipeId: recipeId,
        },
      },
      data: {
        rating: parseFloat(rating),
      },
    });
    return updatedRating;
  } catch (error) {
    console.log("Error updating rating:", error);
    throw error;
  }
};

//user: update reviews on saved recipes
const updateReview = async (recipeId, userId, reviewMsg) => {
  try {
    const updatedReview = await prisma.users_recipes.update({
      where: {
        userId_recipeId: {
          userId: userId,
          recipeId: recipeId,
        },
      },
      data: {
        reviewMsg: reviewMsg || "",
      },
    });
    return updatedReview;
  } catch (error) {
    console.log("Error updating review:", error);
    throw error;
  }
};

//user: view ratings and reviews
const viewAllRatingAndReviews = async (id) => {
  try {
    const allRatingAndReviews = await prisma.users_recipes.findMany({
      where: {
        id,
        rating: { not: null },
      }, select: {
        id: true,
        rating: true,
        reviewMsg: true,
      }
    });
    return allRatingAndReviews;
  } catch (error) {
    console.log("Error caught when viewing ratings and reviews");
  }
};

//user: delete review and rating
const deleteRatingAndReview = async (id) => {
  //limit for rating (?) - could be a front end limitation
  try {
    const ratingAndReviewToDelete = await prisma.users_recipes.update({
      where: {
        id: id,
      }, data: {
        rating: null,
        reviewMsg: null
      }
    })
    return ratingAndReviewToDelete;
  } catch (error) {
    console.log("Error caught when deleting a rating and review", error);
  }
};

//user: save a recipe
const saveARecipe = async (userId, recipeId) => {
  try {
    const savedRecipe = await prisma.users_recipes.create({
      data: {
        userId: userId,
        recipeId: recipeId,
      },
    });
    console.log("Recipe saved:", savedRecipe);
    return savedRecipe;
  } catch (error) {
    console.log("Error caught when saving a recipe", error);
  }
};

//user: view all saved recipes
const viewAllSavedRecipes = async (userId) => {
  try {

    const savedRecipes = await prisma.users_recipes.findMany({
      where: {
        userId: parseInt(userId),
      },
      include: {
        recipes: {
          select: {
            title: true,
            imageurl: true,
          },
        },
      },
    });
    if (savedRecipes.length === 0) {
      return [];
    }

    return savedRecipes;

  } catch (error) {
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

// *** ATTN: USERS FUNCTIONS END *** \\

// *** ATTN: RECIPES FUNCTIONS START *** \\
// Function to create a rating for a recipe
const createRatingForRecipe = async (recipeId, rating) => {
  try {
    const ratingFloat = parseFloat(rating);
    const createdRating = await prisma.ratingsAndReviews.create({
      data: {
        recipeId: recipeId,
        rating: ratingFloat,
        reviewMsg: "", // Add an empty string for reviewMsg
      },
    });
    return createdRating;
  } catch (error) {
    console.log("Error caught when creating rating for recipe:", error);
    throw error;
  }
};

// Function to create a review for a recipe
const createReviewForRecipe = async (recipeId, reviewMsg, rating = 0) => {
  try {
    const createdReview = await prisma.ratingsAndReviews.create({
      data: {
        reviewMsg: reviewMsg,
        rating: rating,
        recipe: {
          connect: {id: recipeId}
        }
      },
    });
    return createdReview;
  } catch (error) {
    console.log("Error caught when creating review for recipe:", error);
    throw error;
  }
};
// *** ATTN: RECIPES FUNCTIONS END *** \\

module.exports = {
  adminPrivRatingsAndReviews,
  adminPrivDeleteReviewMsg,
  adminPrivUpdateRecipeImageUrl,
  getUserInfo,
  updateUserPreferences,
  updateUserPassword,
  updateRating,
  updateReview,
  viewAllRatingAndReviews,
  deleteRatingAndReview,
  saveARecipe,
  viewAllSavedRecipes,
  checkSingleSavedRecipe,
  createRatingForRecipe,
  createReviewForRecipe,
}