require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const path = require('path');

const Review = require('./models/Review');
const PlayStoreReviewFetcher = require('./services/reviewFetcher');
const classifier = require('./services/classifier');
const apiRoutes = require('./routes/api');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api', apiRoutes);

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join("C://Users//rupap//.vscode//SegWise//play-store-reviews//public//index.html"));
});

// Review scraping function
async function scrapeReviews() {
  try {
    console.log('Starting review scrape...');
    const fetcher = new PlayStoreReviewFetcher(
      process.env.GOOGLE_CREDENTIALS_PATH,
      process.env.PACKAGE_NAME
    );
    
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

// Database connection
mongoose.connect("mongodb+srv://dhaval079:eren679999@cluster0.rm7on6v.mongodb.net/SegWise")
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Initialize
async function init() {
  // Initialize classifier
  await classifier.init();
  
  // Initial scrape
  await scrapeReviews();
  
  // Start server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

init().catch(console.error);

module.exports = app;