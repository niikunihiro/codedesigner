"use strict";

var fs = require("fs");
var express = require("express");
var bodyParser = require("body-parser");

var app = express();

app.use(/\/.+\/[0-9a-z_]+/, express.static("public/index.html"));
app.use(express.static("public"));
app.use(bodyParser.json());

// AJAXアクセスのリスト取得用のAPI
app.get("/api/index", function (req, res) {
  console.log("get /api/index");
  var source = [];
  try {
    var sources = JSON.parse(fs.readFileSync("data.json", "utf8"));
    if (sources.hasOwnProperty('data')) {
      source = sources.data;
    }
  } catch(e) {
    // pass
  }
  console.log(source);
  res.send(source);
});

// AJAXアクセスのページ保存用のAPI
app.post("/api/:pagename", function (req, res) {
  console.log("post /api/" + req.params.pagename);
  var source;
  try {
    source = JSON.parse(fs.readFileSync("wiki.json", "utf8"));
  } catch(e) {
    source = {};
  }
  source[req.params.pagename] = req.body.source;
  fs.writeFileSync("wiki.json", JSON.stringify(source));
  res.status(200).end();
});

console.log("start listening at 8000");
app.listen(8000);
