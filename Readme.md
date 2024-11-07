# Play Store Reviews Dashboard

## Table of Contents
* [Overview](#overview)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Prerequisites](#prerequisites)
* [Project Structure](#project-structure)
* [Installation](#installation)
* [Configuration](#configuration)
* [API Documentation](#api-documentation)
* [Deployment](#deployment)
* [Implementation Details](#implementation-details)
* [Development Choices](#development-choices)
* [Credits](#credits)

## Overview
This project is a Play Store review monitoring dashboard that helps game developers track and analyze their app reviews. It automatically scrapes reviews daily, classifies them into categories using natural language processing, and provides a simple interface to search and analyze the data.

### Live Demo
* Deployed URL: [Your deployed URL here]
* Test Credentials: [If applicable]

## Features
* **Automated Review Scraping**
  * Daily scraping of Play Store reviews
  * Rolling 7-day data retention
  * Automatic review classification

* **Review Classification Categories**
  * Bugs: Reviews mentioning software bugs
  * Complaints: General negative feedback
  * Crashes: App crash reports
  * Praises: Positive feedback
  * Other: Unclassified reviews

* **Dashboard Features**
  * Date-based filtering
  * Category-based filtering
  * 7-day trend visualization
  * Daily review summaries
  * Review statistics

## Tech Stack
* **Backend**
  * Node.js
  * Express.js
  * MongoDB
  * node-nlp (for review classification)
  * node-cron (for scheduled tasks)

* **Frontend**
  * HTML/CSS/JavaScript
  * Chart.js (for visualizations)

* **APIs & Services**
  * Google Play Developer API
  * MongoDB Atlas

* **DevOps**
  * Docker
  * Docker Compose
  * Railway (for deployment)

## Prerequisites
* Node.js (v14 or higher)
* MongoDB
* Docker and Docker Compose (for containerized deployment)
* Google Play Console account
* Google Cloud Platform account

## Project Structure
```
play-store-reviews/
├── src/
│   ├── models/
│   │   └── Review.js
│   ├── services/
│   │   ├── classifier.js
│   │   └── reviewFetcher.js
│   ├── routes/
│   │   └── api.js
│   └── app.js
├── public/
│   └── index.html
├── tests/
├── Dockerfile
├── docker-compose.yml
├── package.json
├── .env.example
└── README.md
```

## Installation

### Local Setup
```bash
# Clone the repository
git clone [your-repo-url]
cd play-store-reviews

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start MongoDB (if running locally)
mongod

# Start the application
npm start
```

### Docker Setup
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## Configuration

### Environment Variables
Create a `.env` file with the following variables:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/reviews
GOOGLE_CREDENTIALS_PATH=./credentials.json
PACKAGE_NAME=com.your.app.package
NODE_ENV=development
```

### Google Play Store API Setup
1. Go to Google Cloud Console (https://console.cloud.google.com/)
2. Create a new project
3. Enable Play Store API
4. Create service account credentials
5. Download credentials JSON file
6. Place credentials file in project root
7. Add service account email to Play Console
8. Grant necessary permissions

## API Documentation

### GET /api/reviews
Fetch reviews with filters

**Parameters:**
* `date` (required): Date to fetch reviews for (YYYY-MM-DD)
* `category` (optional): Review category filter

**Response:**
```json
{
  "reviews": [
    {
      "reviewId": "string",
      "content": "string",
      "rating": number,
      "date": "date",
      "category": "string",
      "userName": "string",
      "androidOsVersion": "string",
      "appVersionCode": "string",
      "appVersionName": "string"
    }
  ],
  "trend": [
    {
      "_id": "date",
      "count": number
    }
  ],
  "categorySummary": [
    {
      "_id": "string",
      "count": number
    }
  ],
  "totalCount": number
}
```

### GET /api/summary
Get daily review summary

**Parameters:**
* `date` (required): Date for summary (YYYY-MM-DD)

**Response:**
```json
[
  {
    "_id": "string",
    "count": number,
    "averageRating": number,
    "reviews": [
      {
        "content": "string",
        "rating": number
      }
    ]
  }
]
```

## Deployment

### Railway Deployment Steps
1. Create Railway account
2. Connect GitHub repository
3. Add environment variables:
   * `MONGODB_URI`
   * `GOOGLE_CREDENTIALS_PATH`
   * `PACKAGE_NAME`
   * `NODE_ENV=production`
4. Deploy application

### Manual Cloud Deployment
1. Build Docker image:
```bash
docker build -t play-store-reviews .
```

2. Push to container registry:
```bash
docker push [your-registry]/play-store-reviews
```

3. Deploy container to cloud platform

## Implementation Details

### Review Classification
The application uses natural language processing (node-nlp) for classifying reviews:
* Training data includes common phrases for each category
* Classification confidence threshold: 0.6
* Default category: "other"

### Data Storage
MongoDB schema design:
* Review document structure
* Indexing on date and category fields
* Rolling 7-day data retention

### Scheduled Tasks
* Daily review scraping at midnight
* Automatic classification of new reviews
* Clean-up of old data

## Development Choices

### Why Node.js?
* Excellent package ecosystem
* Strong async/await support
* Good performance for I/O operations
* Easy deployment options

### Why MongoDB?
* Flexible schema for review data
* Good performance for read operations
* Easy to scale
* Free tier available on MongoDB Atlas

### Classification Approach
* Used node-nlp instead of hosted LLMs for:
  * Cost effectiveness
  * Offline capability
  * Deployment simplicity
  * Lower latency

## Credits
* Built by: [Your Name]
* **Tools Used:**
  * ChatGPT for code assistance
  * Google Play Developer API documentation
  * node-nlp documentation
  * Chart.js for visualizations

## License
This project is licensed under the MIT License - see the LICENSE file for details.

---

**Note:** This project was created as part of an internship assignment for Segwise. The implementation focuses on demonstrating backend development skills, API integration, and basic frontend functionality.