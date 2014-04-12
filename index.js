#! /usr/bin/env node

var dtas = dtas || {};

dtas.json = (function() {
  var fs = require('fs');
  var util = require('util');

  function init() {
    process.argv.forEach(function (val, index, array) {
      switch(val) {
        case '-c':
          clean(array[index + 1]);
          break;

        case '-h':
          help();
          break;

        default:
      }
    });
  }

  function clean(file) {
    fs.readFile(file, 'utf8', function (err, data) {
      if (err) {
        console.log('Error: ' + err);
        return;
      }
 
      data = JSON.parse(data);
      console.dir(data);
    });
  }

  function help() {
    console.log('Sorry, there is no help yet!');
  } 

  return {
    init: init
 }; 
}());

dtas.json.init();
