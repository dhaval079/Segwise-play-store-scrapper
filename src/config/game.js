// src/config/game.js
module.exports = {
    gameInfo: {
      packageName: process.env.PACKAGE_NAME || 'com.superplaystudios.dicedreams',
      gameName: 'Dice Dreams',
      developer: 'SuperPlay',
      storeUrl: 'https://play.google.com/store/apps/details?id=com.superplaystudios.dicedreams'
    },
    
    // Classification keywords specific to Dice Dreams
    classificationKeywords: {
      bugs: [
        'bug',
        'glitch',
        'not working',
        'broken',
        'stuck',
        'freeze',
        'frozen',
        'cant play',
        "can't play",
        'not loading'
      ],
      crashes: [
        'crash',
        'force close',
        'closes',
        'stop working',
        'stops working',
        'shut down',
        'shuts down',
        'keeps closing'
      ],
      complaints: [
        'expensive',
        'too many ads',
        'unfair',
        'rigged',
        'pay to win',
        'p2w',
        'difficult',
        'hard',
        'impossible',
        'losing coins',
        'lost coins',
        'steal',
        'stole',
        'scam',
        'cheat',
        'hackers',
        'hacking'
      ],
      praises: [
        'love',
        'great',
        'awesome',
        'amazing',
        'fun',
        'addictive',
        'addicting',
        'good',
        'best',
        'excellent',
        'perfect',
        'fantastic',
        'wonderful',
        'enjoyable',
        'entertaining'
      ]
    }
  };