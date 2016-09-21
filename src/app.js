"use strict";

var m = require("mithril");

// コンポーネント
var Header = require('./components/header');
var SideMenu = require('./components/side_menu');
var Editor = require('./components/editor');

// ヘッダー
m.mount(document.getElementById('header'), m.component(Header));
// サイドメニュー
m.mount(document.getElementById('documents'), m.component(SideMenu));

m.route.mode = "pathname";
// エディター部分
m.route(document.getElementById('designer'), '/', {
  '/': Editor,
  '/:title/:id' : Editor
});
