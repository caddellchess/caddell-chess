const fs = require('fs');
const ini = require('js-ini');

const getEnginePersonalities = async engine => {
  personalities = {};
  if (engine == 'd-rodent4') {
    fs.readdirSync('./engines/rodent4/personalities').forEach(file => {
      if (file.endsWith('.txt')) {
        const personalityFile = ini.parse(fs.readFileSync(`./engines/rodent4/personalities/${file}`, 'utf-8'), {delimiter: 'name'});
        const pf = Object.keys(personalityFile)[0];
        personalities[pf] = { hmi: pf, mri: file }
      }
    });
  } else {
    const rawPersonalities = ini.parse(fs.readFileSync(`./personalities/${engine}.ini`, 'utf-8'));
    for (const personality in rawPersonalities) {
      personalities[personality] = [];
      for (trait in rawPersonalities[personality]) {
        personalities[personality].push({
          personalityKey: trait,
          personalityValue: rawPersonalities[personality][trait]
        });
      }
    }
  }
  return personalities;
}

module.exports = getEnginePersonalities;
