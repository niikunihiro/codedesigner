var
  TAFFY = require('node-taffydb').TAFFY,
  taffyDB = null
;

if (taffyDB === null) {
  taffyDB = TAFFY();
}

module.exports = taffyDB;
