var async = require("async");
var util = require("util");
var cache = require("./cache")();
var parse = require("./parse");
var fs = require("fs");
var ids = [];
var errors = [];
var completeCount = 0;
var total = 1;
import fire from './fire'

module.exports = function(ids, fn) {
  total = ids.length;

  async.eachLimit(ids, 20, processId, function(err) {
    saveErrors();
    fn(err);
  });
};


function saveErrors() {
  fs.writeFileSync("./errors.json", JSON.stringify(errors));
}

function saveResults(id, data, fn) {
  let content;
  let db = fire.database();

  try {
    content = JSON.parse(fs.readFileSync("./results/decks.json", "utf8"));
  } catch (err) {
    content = {}
  }
  content[id] = data;
  fs.writeFileSync("./results/decks.json", JSON.stringify(content,null,2), fn);
  data.cards = {};
  data.mainboard.forEach(card => {
    data.cards[card.name] = true;
  })
  data.sideboard.forEach(card => {
    if (!data.cards[card.nam]){
     data.cards[card.name] = true;
    }
  })
  db.ref('decks').push().set(data)
}

function processId(id, next) {
  process.stdout.write(" " + ((completeCount / total) * 100).toFixed() + "%\r");

  if (!cache.exists(id)) {
    return cache.update(id, function(err) {
      if (err) {
        return next(err);
      }

      process.nextTick(function() {
        processId(id, next);
      });
    });
  }

  cache.get(id, function(err, page) {
    if (err) {
      return next(err);
    }

    try {
      var data = { id: id };
      parse(page, data, function(err) {
        completeCount++;
        if (data.format === "//" || data.mainboard.length === 0) {
          errors.push(id);
          cache.invalidate(data.id, () => {
            "unlinked";
          });
        } else {
          saveResults(id, data, () => {
            "results saved";
          });
        }

        next(err);
      });
    } catch (err) {
      throw err;
      next(err);
    }
  });
}
