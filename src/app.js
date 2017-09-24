"use strict";

var m = require("mithril");
m.route.prefix('');

// コンポーネント
var Header = require('./component/header');
var SideMenu = require('./component/side_menu');
// var Editor = require('./component/editor');
var Content = require('./component/content');

// ヘッダー
m.mount(document.getElementById('header'), Header);
// サイドメニュー
m.mount(document.getElementById('documents'), SideMenu);
// エディター部分
m.route(document.getElementById('designer'), '/', {
  '/:title/:id' : Content,
  '/edit/:title/:id' : Content,
  '/': Content
});
