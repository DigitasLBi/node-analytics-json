#! /usr/bin/env node

var dtas = dtas || {};

dtas.json = (function() {
  var fs = require('fs'),
      util = require('util');

  function init() {
    process.argv.forEach(function (val, index, array) {
      switch(val) {
        case '-c':
          clean(array[index + 1]);
          break;

        case '-v':
          convert(array[index + 1]);
          break;

        case '-h':
          help();
          break;

        default:
      }
    });
  }

  function convert(file) {
    var Converter = require("csvtojson").core.Converter;
    var csvConverter = new Converter();

    csvConverter.on("end_parsed", function(jsonObj) {
      cleanUpJSON('temp.json', jsonObj, false);
    });

    csvConverter.from(file);
  }

  function clean(file) {
    var data = readJSON(file, cleanUpJSON);
  }

  function cleanUpJSON(file, data, parse) {
    data = (parse === true) ? removeNulls(JSON.parse(data)) : removeNulls(data);
   
    //TODO Need to remove this and add elsewhere as an option
    data = convertToHashMap(data);

    writeJSON(file + '.tmp', data);

    function removeNulls(obj) {
      var isArray = obj instanceof Array;
      
      for (var k in obj) {
        if (obj[k] === null || obj[k] === 'null' || obj[k] === '') {
          isArray ? obj.splice(k, 1) : delete obj[k];
        }
        else if (typeof obj[k] === "object") {
          removeNulls(obj[k]);
        }
      }
    
      return obj;
    }
  }

  function convertToHashMap(json) {
    var arr = json.csvRows,
        len = arr.length,
        map = {};

    for (var i = 0; i < len; i++) {
      obj = arr[i];
      map[i + 2] = obj;
    }
    
    return map;
  }

  function readJSON(file, callback) {
    fs.readFile(file, 'utf8', function (err, data) {
      if (err) {
        console.log('Error: ' + err);
        return;
      }

      callback(file, data, true);
    });
  }

  function writeJSON(path, data) {
    fs.writeFile(path, JSON.stringify(data, null, 2), function(err) {
      if (err) {
        console.log(err);
      } 
      else {
        console.log("The file was saved!");
      }
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
