const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {
  // Seed Users table
  const hashedPass1 = await bcrypt.hash(`admin1`, 10);
  const hashedPass2 = await bcrypt.hash(`admin2`, 10);
  const hashedPass3 = await bcrypt.hash(`admin3`, 10);
  const hashedPass4 = await bcrypt.hash(`admin4`, 10);  

  const admin1 = await prisma.users.create({
    data: {
      username: 'admin1',
      email: 'admin1@example.com',
      password: hashedPass1,
      isadmin: true,
    },
  });
  
  const admin2 = await prisma.users.create({
    data: {
      username: 'admin2',
      email: 'admin2@example.com',
      password: hashedPass2,
      isadmin: true,
    },
  });
  
  const admin3 = await prisma.users.create({
    data: {
      username: 'admin3',
      email: 'admin3@example.com',
      password: hashedPass3,
      isadmin: true,
    },
  });
  
  const admin4 = await prisma.users.create({
    data: {
      username: 'admin4',
      email: 'admin4@example.com',
      password: hashedPass4,
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
