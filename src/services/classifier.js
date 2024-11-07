const { NlpManager } = require('node-nlp');
const gameConfig = require('../config/game');

class ReviewClassifier {
  constructor() {
    this.manager = new NlpManager({ languages: ['en'] });
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    Object.entries(gameConfig.classificationKeywords).forEach(([category, keywords]) => {
      keywords.forEach(keyword => {
        this.manager.addDocument('en', keyword, category);
        this.manager.addDocument('en', `${keyword}!`, category);
        this.manager.addDocument('en', `${keyword}.`, category);
        this.manager.addDocument('en', `the game ${keyword}`, category);
        this.manager.addDocument('en', `this game ${keyword}`, category);
        this.manager.addDocument('en', `game ${keyword}`, category);
        
        if (category === 'bugs' || category === 'crashes') {
          this.manager.addDocument('en', `${keyword} after update`, category);
          this.manager.addDocument('en', `${keyword} on level`, category);
          this.manager.addDocument('en', `${keyword} when playing`, category);
        }
      });
    });

    this.manager.addDocument('en', 'dice not rolling', 'bugs');
    this.manager.addDocument('en', 'lost my progress', 'complaints');
    this.manager.addDocument('en', 'lost all my dice', 'complaints');
    this.manager.addDocument('en', 'disappeared coins', 'complaints');
    this.manager.addDocument('en', 'cant attack', 'bugs');
    this.manager.addDocument('en', "can't roll", 'bugs');
    this.manager.addDocument('en', 'rolls not working', 'bugs');
    this.manager.addDocument('en', 'village gone', 'complaints');
    this.manager.addDocument('en', 'love rolling dice', 'praises');
    this.manager.addDocument('en', 'fun attacking', 'praises');

    console.log('Training review classifier...');
    await this.manager.train();
    this.initialized = true;
    console.log('Review classifier training completed');
  }

  async classify(text) {
    if (!this.initialized) {
      await this.init();
    }

    try {
      const result = await this.manager.process('en', text.toLowerCase());      if (result.intent && result.score > 0.6) {
        return result.intent;
      }
      return 'other';
    } catch (error) {
      console.error('Error classifying review:', error);
      return 'other';
    }
  }
}

module.exports = new ReviewClassifier();