const fs = require('fs');
const ini = require('js-ini');

const getAllEngines = async () => {
  const rawEngines = ini.parse(fs.readFileSync('./engines/armv7l/engines.ini', 'utf-8'));
  const engineArray = [];
  for (const property in rawEngines) {
    if (!property.includes('/')) {
      engineArray.push({
        filename: property,
        hmi: rawEngines[property].large,
        fullname: rawEngines[property].name
      });
    }
  }
  return engineArray;
}

module.exports = { getAllEngines };
