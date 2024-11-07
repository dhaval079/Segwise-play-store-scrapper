// src/services/reviewFetcher.js
class MockReviewFetcher {
    constructor() {
      this.sampleReviews = {
        bugs: [
          "The game freezes when I try to roll dice",
          "Can't collect my rewards, button not working",
          "Village upgrade button is broken",
          "Dice not rolling properly",
          "Lost all my progress after update"
        ],
        crashes: [
          "App keeps crashing every time I open it",
          "Game crashes during battles",
          "Crashes when loading my village",
          "Force closes randomly",
          "App stopped working after update"
        ],
        complaints: [
          "Too many ads in this game",
          "It's becoming pay to win",
          "Takes too long to collect resources",
          "Too expensive",
          "Unfair matchmaking"
        ],
        praises: [
          "Love this game! So addictive",
          "Best dice game ever",
          "Great updates, keeps getting better",
          "Amazing gameplay",
          "Fun with friends"
        ],
        other: [
          "How do I connect with friends?",
          "When is the next update?",
          "Need more levels",
          "What's the max level?",
          "Looking for team members"
        ]
      };
  
      this.usernames = ["Player1", "GamerPro", "DiceKing", "RollingQueen", "LuckyDice"];
      this.versions = ["1.0.0", "1.0.1", "1.1.0", "1.1.1"];
      this.devices = ["Samsung S21", "iPhone 13", "Pixel 6", "OnePlus 9"];
    }
  
    generateReview(date) {
      // Pick a random category and then a random review from that category
      const categories = Object.keys(this.sampleReviews);
      const category = categories[Math.floor(Math.random() * categories.length)];
      const content = this.sampleReviews[category][Math.floor(Math.random() * this.sampleReviews[category].length)];
      
      // Generate ratings based on category
      let rating;
      switch(category) {
        case 'praises':
          rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars
          break;
        case 'bugs':
        case 'crashes':
          rating = Math.floor(Math.random() * 2) + 1; // 1-2 stars
          break;
        case 'complaints':
          rating = Math.floor(Math.random() * 2) + 2; // 2-3 stars
          break;
        default:
          rating = Math.floor(Math.random() * 5) + 1; // 1-5 stars
      }
  
      return {
        reviewId: `mock_${date.getTime()}_${Math.floor(Math.random() * 10000)}`,
        content,
        rating,
        date,
        userName: this.usernames[Math.floor(Math.random() * this.usernames.length)],
        appVersionName: this.versions[Math.floor(Math.random() * this.versions.length)],
        androidOsVersion: `${Math.floor(Math.random() * 5) + 8}.0`,
        deviceMetadata: {
          device: this.devices[Math.floor(Math.random() * this.devices.length)],
          sdkVersion: Math.floor(Math.random() * 5) + 26
        }
      };
    }
  
    async fetchReviews(startTime) {
      const reviews = [];
      const endTime = new Date();
      let currentDate = new Date(startTime);
  
      while (currentDate <= endTime) {
        // Generate 5-15 reviews per day
        const dailyReviewCount = Math.floor(Math.random() * 11) + 5;
        
        for (let i = 0; i < dailyReviewCount; i++) {
          const reviewTime = new Date(currentDate);
          reviewTime.setHours(Math.floor(Math.random() * 24));
          reviewTime.setMinutes(Math.floor(Math.random() * 60));
          reviewTime.setSeconds(Math.floor(Math.random() * 60));
          
          reviews.push(this.generateReview(reviewTime));
        }
  
        currentDate.setDate(currentDate.getDate() + 1);
      }
  
      return reviews;
    }
  
    async fetchLast7DaysReviews() {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return this.fetchReviews(sevenDaysAgo);
    }
  }
  
  module.exports = MockReviewFetcher;