/*************  ✨ Codeium Command ⭐  *************/
const fs = require('fs');
const quotes = require('./quotes.json');

const output = quotes.map(quote => `"${quote.quote}"~${quote.author}`).join('\n');

fs.writeFile('quotes.txt', output, (err) => {
    if (err) {
        console.error(err);
    }
    console.log('Quotes saved to quotes.txt');
});
/******  e07e3f39-ab92-4291-8244-b3b817dcd6ec  *******/