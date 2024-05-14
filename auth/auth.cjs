const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const prisma = require("../db/connection.js");
const { verifyToken } = require("./middleware.js");

const signToken = ({ id, isAdmin }) => jwt.sign({ id, isAdmin }, process.env.JWT_SECRET);

// Register a new user account
router.post("/register", async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;

    //Prevent admin through a post
    delete req.body.isAdmin;

    const user = await prisma.user.create({
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
    const user = await prisma.user.findFirst({
      where: {
        username: req.body.username,
      },
    });
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
    const user = await prisma.user.findUnique({
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

