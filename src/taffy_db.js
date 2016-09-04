var
  TAFFY = require('taffy'),
  taffyDB = null
;

if (taffyDB === null) {
  taffyDB = TAFFY();
}

module.exports = taffyDB;
