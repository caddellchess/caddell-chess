const fs = require('fs');
const ini = require('js-ini');

const getAllBooks = async () => {
  const booksArray = [];
  const rawBooks = ini.parse(fs.readFileSync('./books/books.ini', 'utf-8'));
  for (const property in rawBooks) {
    booksArray.push({
      mri: property,
      hmi: rawBooks[property].large
    });
  }
  return booksArray;
}

module.exports = getAllBooks;
