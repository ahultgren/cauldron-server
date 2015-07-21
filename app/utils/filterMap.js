'use strict';

module.exports = (fn, map) => {
  var result = [];

  for(let item of map) { // eslint-ignore-line
    if(fn(item[1])) {
      result.push(item[1]);
    }
  }

  return result;
};
