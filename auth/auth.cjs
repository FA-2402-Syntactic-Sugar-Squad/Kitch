const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { verifyToken } = require("./middleware.cjs");
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const signToken = ({ id, isAdmin }) => jwt.sign({ id, isAdmin }, process.env.JWT_SECRET);

// Register a new user account
router.post("/register", async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;

    //Prevent admin through a post
    // delete req.body.isAdmin;

    const user = await prisma.users.create({
      data: req.body
    });

    // Create a token with user info
    const token = signToken(user);

    res.status(201).send({ token });
  } catch (error) {
    next(error);
  }
});

// Login to an existing user account
router.post("/login", async (req, res, next) => {
  try {
    const user = await prisma.users.findFirst({
      where: {
        username: req.body.username,
      },
    });
    console.log("USername:", user)
    if(!user) {
      return res.status(401).send("no user");
    }

    const isIn = await bcrypt.compare(req.body.password, user.password);

    if (!isIn) {
      return res.status(401).send("Invalid login credentials.");
    }

    // Create a token with user info
    const token = signToken(user);

    res.send({ token });
  } catch (error) {
    next(error);
  }
});

// Get the currently logged in user
router.get("/me", verifyToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await prisma.users.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      return res.status(404).send('User not found.');
    }

    res.send(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

