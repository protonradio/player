#!/usr/bin/env node

const fs = require('fs');

const explodeVersionString = (s) => s.split('.').map(Number);
const collapseVersionString = (vs) => vs.join('.');

const RELEASE_TYPE = process.argv[2];
if (!['release', 'patch'].includes(RELEASE_TYPE)) {
  throw new Error('Must specify either `release` or `patch` as argument');
}

const packageJSON = JSON.parse(fs.readFileSync('./package.json'));
const currentVersion = explodeVersionString(packageJSON.version);

if (RELEASE_TYPE === 'release') {
  const currentDate = new Date();
  packageJSON.version = collapseVersionString([
    currentDate.getFullYear().toString().substr(2),
    currentDate.getMonth() + 1,
    0,
  ]);
} else {
  packageJSON.version = collapseVersionString([
    currentVersion[0],
    currentVersion[1],
    currentVersion[2] + 1,
  ]);
}

fs.writeFileSync('./package.json', JSON.stringify(packageJSON, null, 2));
