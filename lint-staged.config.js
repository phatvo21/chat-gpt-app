module.exports = {
  '*.{ts,html,js,json,jsx,md,ts,tsx,css}': ['prettier --write'],
  '*.ts': ['npx eslint --cache --fix'],
};
