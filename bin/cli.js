#! /usr/bin/env node
const { hello } = require('../src/index.js');

if (!process.argv[2]) {
    console.log('Add meg paraméternek a nevedet!');
    return;
}

hello(`${process.argv[2]}-cica`);