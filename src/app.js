// src/app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const path = require('path');

const Review = require('./models/Review');
const MockReviewFetcher = require('./services/reviewFetcher');
const classifier = require('./services/classifier');
const apiRoutes = require('./routes/api');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api', apiRoutes);

// Review scraping function
async function scrapeReviews() {
  try {
    console.log('Starting review scrape...');
    
    const fetcher = new MockReviewFetcher();
    const reviews = await fetcher.fetchLast7DaysReviews();
    
    console.log(`Fetched ${reviews.length} reviews`);
    
    for (const review of reviews) {
      const category = await classifier.classify(review.content);
      await Review.findOneAndUpdate(
        { reviewId: review.reviewId },
        {
          ...review,
          category
        },
        { upsert: true }
      );
    }
    console.log('Review scrape completed');
  } catch (error) {
    console.error('Error scraping reviews:', error);
  }
}

// Schedule daily scraping
cron.schedule('0 0 * * *', scrapeReviews);

// MongoDB connection
mongoose.connect("mongodb+srv://dhaval079:eren679999@cluster0.rm7on6v.mongodb.net/SegWise")
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Initialize
async function init() {
  try {
    // Initialize classifier
    await classifier.init();
    
    // Initial scrape
    await scrapeReviews();
    
    // Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Initialization error:', error);
    process.exit(1);
  }
}

init();

module.exports = app;