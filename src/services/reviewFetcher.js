const { google } = require('googleapis');
const { JWT } = require('google-auth-library');

class PlayStoreReviewFetcher {
  constructor(credentialsPath, packageName) {
    this.packageName = packageName;
    this.credentials = require(credentialsPath);
    this.init();
  }

  init() {
    const client = new JWT({
      email: this.credentials.client_email,
      key: this.credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/androidpublisher']
    });

    this.androidPublisher = google.androidpublisher({
      version: 'v3',
      auth: client
    });
  }

  async fetchReviews(startTime) {
    try {
      const reviews = [];
      let token;

      do {
        const response = await this.androidPublisher.reviews.list({
          packageName: this.packageName,
          maxResults: 100,
          token,
          startTime: startTime.toISOString()
        });

        if (response.data.reviews) {
          reviews.push(...response.data.reviews);
        }

        token = response.data.tokenPagination?.nextPageToken;
      } while (token);

      return reviews.map(review => ({
        reviewId: review.reviewId,
        content: review.comments[0].userComment.text,
        rating: review.comments[0].userComment.starRating,
        date: new Date(review.comments[0].userComment.lastModified.seconds * 1000),
        userName: review.authorName,
        androidOsVersion: review.comments[0].userComment.androidOsVersion,
        appVersionCode: review.comments[0].userComment.appVersionCode,
        appVersionName: review.comments[0].userComment.appVersionName,
        deviceMetadata: review.comments[0].userComment.deviceMetadata
      }));
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  }

  async fetchLast7DaysReviews() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return this.fetchReviews(sevenDaysAgo);
  }
}

module.exports = PlayStoreReviewFetcher;