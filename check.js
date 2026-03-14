const fs = require('fs');
const verses = require('./data/verses.json');
const translations = require('./data/bible-translations.json');

const missing = Object.values(verses).map(v => v.ref).filter(ref => !translations[ref]);
console.log('Missing translations for:', missing);
