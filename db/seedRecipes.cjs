const axios = require("axios");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedDatabase(numRecipes) {
  try {
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/random?number=${numRecipes}&apiKey=c89dd5c7bea0447594cf74b149427e34`
    );
    const recipes = response.data.recipes;

    for (const recipe of recipes) {
      const {
        id: recipeId,
        title,
        analyzedInstructions,
        servings,
        extendedIngredients,
        image: imageurl,
        glutenFree,
        ketogenic,
        lactoVegetarian,
        ovoVegetarian,
        vegan,
        pescetarian,
        paleo,
        primal,
        lowFODMAP,
        whole30,
        "lacto ovo vegetarian": lactoOvoVegetarian,
      } = recipe;

      const newRecipe = await prisma.recipes.create({
        data: {
          id: recipeId,
          title,
          instructions: generateInstructions(analyzedInstructions),
          servings,
          imageurl: imageurl,
          glutenFree: glutenFree || false,
          ketogenic: ketogenic || false,
          lactoVegetarian: lactoOvoVegetarian ? true : lactoVegetarian || false,
          ovoVegetarian: lactoOvoVegetarian ? true : ovoVegetarian || false,
          vegan: vegan || false,
          pescetarian: pescetarian || false,
          paleo: paleo || false,
          primal: primal || false,
          lowFODMAP: lowFODMAP || false,
          whole30: whole30 || false,
        },
      });

      for (const ingredient of extendedIngredients) {
        const { id: ingredientId, name, aisle } = ingredient;

        let existingIngredient = await prisma.ingredients.findUnique({
          where: { id: ingredientId },
        });

        if (!existingIngredient) {
          existingIngredient = await prisma.ingredients.create({
            data: {
              id: ingredientId,
              name,
              category: aisle,
            },
          });
        }

        await prisma.recipes_ingredients.create({
          data: {
            recipeId,
            ingredientsId: ingredientId,
          },
        });
      }

      console.log(`Recipe "${title}" seeded successfully!`);
    }

    console.log("Database seeding completed!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

function generateInstructions(analyzedInstructions) {
  let instructions = "";

  analyzedInstructions.forEach((instruction) => {
    instruction.steps.forEach((step) => {
      instructions += `${step.step}\n`;
    });
  });

  return instructions;
}

seedDatabase(20);
