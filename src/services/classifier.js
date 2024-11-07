const { NlpManager } = require('node-nlp');

class ReviewClassifier {
  constructor() {
    this.manager = new NlpManager({ languages: ['en'] });
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    const trainingData = {
      crashes: [
        'app keeps crashing',
        'crashes every time',
        'force close',
        'stops working',
        'app crashed',
        'application crash',
        'keeps stopping'
      ],
      bugs: [
        'found a bug',
        'this feature is broken',
        'not working properly',
        'glitch',
        'bug in the game',
        'something is wrong',
        'broken functionality'
      ],
      complaints: [
        'poor performance',
        'terrible app',
        'bad experience',
        'waste of time',
        'too many ads',
        'not worth it',
        'disappointed'
      ],
      praises: [
        'great app',
        'love this game',
        'awesome experience',
        'best game ever',
        'fantastic app',
        'wonderful game',
        'excellent'
      ]
    };

    Object.entries(trainingData).forEach(([category, phrases]) => {
      phrases.forEach(phrase => {
        this.manager.addDocument('en', phrase, category);
      });
    });

    await this.manager.train();
    this.initialized = true;
  }

  async classify(text) {
    if (!this.initialized) {
      await this.init();
    }

    const result = await this.manager.process('en', text);
    if (result.intent && result.score > 0.6) {
      return result.intent;
    }
    return 'other';
  }
}

module.exports = new ReviewClassifier();