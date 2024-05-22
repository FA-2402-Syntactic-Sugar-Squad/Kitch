const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const reviewsRouter = express.Router();
const verifyAdmin = require('./../auth/middleware.cjs');

// // Middleware to verify admin


// Get all ratings and reviews
reviewsRouter.get('/', async (req, res, next) => {
  try {
    const ratings = await prisma.rating.findMany();
    const reviews = await prisma.review.findMany();
    res.json({ ratings, reviews });
  } catch (error) {
    console.error('Error getting ratings and reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Moderate (update) a review
reviewsRouter.put('/review/:id', verifyAdmin, async (req, res, next) => {
  try {
    const reviewId = parseInt(req.params.id);
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: req.body,
    });
    res.json(updatedReview);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a rating
reviewsRouter.delete('/rating/:id', verifyAdmin, async (req, res, next) => {
  try {
    const ratingId = parseInt(req.params.id);
    await prisma.rating.delete({
      where: { id: ratingId },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting rating:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a review
reviewsRouter.delete('/review/:id', verifyAdmin, async (req, res, next) => {
  try {
    const reviewId = parseInt(req.params.id);
    await prisma.review.delete({
      where: { id: reviewId },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = reviewsRouter;
