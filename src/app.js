"use strict";

var m = require("mithril");

// コンポーネント
var SideMenu = require('./components/side_menu');
var Editor = require('./components/editor');

// サイドメニュー
m.mount(document.getElementById('documents'), m.component(SideMenu));

m.route.mode = "pathname";
// エディター部分
m.route(document.getElementById('designer'), '/', {
  '/': Editor,
  '/:title/:id' : Editor
});
