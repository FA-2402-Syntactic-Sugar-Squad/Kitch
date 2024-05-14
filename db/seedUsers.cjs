const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Seed Users table
  const admin1 = await prisma.users.create({
    data: {
      username: 'admin1',
      email: 'admin1@example.com',
      password: 'admin1',
      isadmin: true,
    },
  });
  
  const admin2 = await prisma.users.create({
    data: {
      username: 'admin2',
      email: 'admin2@example.com',
      password: 'admin2',
      isadmin: true,
    },
  });
  
  const admin3 = await prisma.users.create({
    data: {
      username: 'admin3',
      email: 'admin3@example.com',
      password: 'admin3',
      isadmin: true,
    },
  });
  
  const admin4 = await prisma.users.create({
    data: {
      username: 'admin4',
      email: 'admin4@example.com',
      password: 'admin4',
      isadmin: true,
    },
  });
 



  // Seed Users_Recipes table
  const userRecipe = await prisma.users_recipes.create({
    data: {
      userId: user.id,
      recipeId: recipe.id,
      rating: 5,
      reviewMsg: 'Test Review',
    },
  });

  // Seed Preferences table
  const preference = await prisma.preferences.create({
    data: {
      userId: user.id,
      glutenFree: false,
      ketogenic: false,
      lactoVegetarian: false,
      ovoVegetarian: false,
      vegan: false,
      pescetarian: false,
      paleo: false,
      primal: false,
      lowFODMAP: false,
      whole30: false,
    },
  });

  console.log({ user, recipe, userRecipe, preference });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
