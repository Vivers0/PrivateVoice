# Private Voice
[![Build Status](https://travis-ci.org/Vivers0/PrivateVoice.svg?branch=master)](https://travis-ci.org/Vivers0/PrivateVoice)
## About
**private.js** - Creating private rooms in the category in which you specify (or in which the main voice channel is located)
**privateWithParent.js** - Automatic creation of private rooms and categories. If you turn off the bot, then it will stop working in the category in which it was before!
**easyPrivateVoices.coffee** - Simple private rooms on CoffeeScript

## Usage
Transfer the file to the config **cfg/config.json** and enter all the necessary data:
```json
    {
        "token": "",
        "voiceID": "",
        "parentID": ""
    }
```
Next, go to the console and enter one of the commands you need:
- **npm run start** for private.js
- **npm run startParent** for privateWithParent.js
- **npm run startEasy** for easyPrivateVoice.coffee

## P.S.
Code creator - [Dzoom](https://yougame.biz/threads/88864)
Bug fixes and code completion - Vivers
