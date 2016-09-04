"use strict";

var
  taffyDB = require('./taffy_db'),
  m = require('mithril')
;

// モデルクラス
var Title = function (data, isInitial) {
  this.id = m.prop(data.id);
  this.title = m.prop(data.title);
  this.link = m.prop("/" + encodeURIComponent(data.title) + '/' + encodeURIComponent(data.id.replace(/-/g, '_')))
};

// サーバからタイトル一覧を取得する
Title.list = function() {
  return m.request({method: 'GET', url: '/api/index', type: Title})
};

// ローカルストレージからタイトル一覧を取得する
Title.readStorage = function() {
  var
    list = [],
    src = localStorage.getItem('docs'),
    json = []
    ;
  if (src) {
    json = JSON.parse(src);
    taffyDB.insert(json);
    taffyDB().each(function (record, i) {
      list.push(new Title(record));
    });
  }
  return m.prop(list);
}

module.exports = Title;