const shared = require('../../tailwind.config.js');
module.exports = {
  ...shared,
  content: ['./app/**/*.{js,jsx}', '../../packages/**/*.{js,jsx}'],
};
