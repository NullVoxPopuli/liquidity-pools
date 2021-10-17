'use strict';

module.exports = {
  mode: 'jit',
  purge: ['./app/**/*.{js,ts,hbs,html}', './pubilc/**/*.md'],
  darkMode: false,
  theme: {},
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-tables')(),
  ],
};
