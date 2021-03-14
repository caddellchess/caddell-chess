const fs = require('fs');
const ini = require('js-ini');

const getEngineLevels = async (settingsEngine) => {
  let levelArray = [];
  let engineDefaults = [];
  let engineHasPersonalities = false;
  const engineUciFilePath = './engines/armv7l/' + settingsEngine + '.uci';

  try {
    if (!fs.existsSync(engineUciFilePath)) {
      return ({
        levelArray: levelArray,
        engineDefaults: engineDefaults,
        engineHasPersonalities: engineHasPersonalities
      })
    }
  } catch(err) {
    console.info(err)
  }

  const rawEngine = await ini.parse(fs.readFileSync('./engines/armv7l/' + settingsEngine + '.uci', 'utf-8'));
  for (const property in rawEngine) {
    if (property.toUpperCase() == 'DEFAULT') {
      for (const defaults in rawEngine[property]) {
        if (defaults.toUpperCase() == 'PERSONALITIES') {
          engineHasPersonalities = true;
          continue;
        } else {
          settingsPersonality = '';
        }
        engineDefaults.push({
          key: defaults,
          value: rawEngine[property][defaults]
        });
      }
      continue;
    }

    for (const level in rawEngine[property]) {
      const levelIndex = levelArray.findIndex(x => x.hmi == property.replace('@', ' '));
      if (levelIndex == -1) {
        levelArray.push({
          hmi: property.replace('@', ' '),
          mri: [{
              engineLevelKEY: level,
              engineLevelVALUE: rawEngine[property][level]
            }]
        });
      } else {
        levelArray[levelIndex].mri.push({
          engineLevelKEY: level,
          engineLevelVALUE: rawEngine[property][level]
        });
      }
    }
  }
  return ({
    levelArray: levelArray,
    engineDefaults: engineDefaults,
    engineHasPersonalities: engineHasPersonalities
  });
}

module.exports = getEngineLevels;
