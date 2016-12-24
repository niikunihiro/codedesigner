"use strict";

var m = require("mithril");

// コンポーネント
var Header = require('./component/header');
var SideMenu = require('./component/side_menu');
var Editor = require('./component/editor');

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
