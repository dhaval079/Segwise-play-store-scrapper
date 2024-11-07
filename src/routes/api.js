const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

router.get('/reviews', async (req, res) => {
  try {
    const { date, category } = req.query;
    
    const selectedDate = new Date(date);
    const startOfDay = new Date(selectedDate.setHours(0,0,0,0));
    const endOfDay = new Date(selectedDate.setHours(23,59,59,999));
    
    const reviews = await Review.find({
      date: { $gte: startOfDay, $lte: endOfDay },
      ...(category && { category })
    }).sort({ date: -1 });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const trend = await Review.aggregate([
      {
        $match: {
          date: { $gte: sevenDaysAgo },
          ...(category && { category })
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const categorySummary = await Review.aggregate([
      {
        $match: {
          date: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      reviews,
      trend,
      categorySummary,
      totalCount: reviews.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/summary', async (req, res) => {
  try {
    const { date } = req.query;
    
    const selectedDate = new Date(date);
    const startOfDay = new Date(selectedDate.setHours(0,0,0,0));
    const endOfDay = new Date(selectedDate.setHours(23,59,59,999));

    const summary = await Review.aggregate([
      {
        $match: {
          date: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          averageRating: { $avg: "$rating" },
          reviews: { $push: { content: "$content", rating: "$rating" } }
        }
      }
    ]);

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;