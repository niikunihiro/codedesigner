"use strict";

var express = require("express");

var app = express();

app.set('port', (process.env.PORT || 8080));
app.use(/\/.+\/[\da-z]{8}_([\da-z]{4}_){3}[\da-z]{12}/, express.static("public/index.html"));
app.use(express.static("public"));

app.listen(app.get('port'), function () {
  console.log("start listening at " + app.get('port'));
});
