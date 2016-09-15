"use strict";

var
  m = require('mithril'),
  moment = require('moment'),
  taffyDB = require('./taffy_db'),
  uuid = require('node-uuid')
;

/*
初期表示時は、bodyを空でモデルを作成
編集時は、taffyからデータを読み込んでモデルを作成
入力時はビュー・モデルのプロパティに一時保存
保存時はモデルをtaffyとlocalStorageに保存する
 */

var Doc = function (data, isInitial) {
  // console.log('Doc constructor');
  // console.log(data);
  this.link = m.prop("/" + encodeURIComponent(data.title) + '/' + encodeURIComponent(data.id.replace(/-/g, '_')))
  this.id = m.prop(data.id);
  this.title = m.prop(data.title);
  this.body = m.prop(data.body);
  this.created = m.prop(data.created);
  this.updated = m.prop(data.updated);
}

Doc.readStorage = function () {
  var
    list = [],
    src = localStorage.getItem('docs'),
    json = []
    ;
  if (src) {
    json = JSON.parse(src);
    taffyDB.insert(json);
    taffyDB().each(function (record) {
      list.push(new Doc(record));
    });
  }
  return m.prop(list);
}

Doc.read = function () {
  var list = [];
  taffyDB().each(function (record) {
    list.push(new Doc(record));
  });
  return m.prop(list);
}

Doc.search = function (keyword) {
  var list = [];
  taffyDB({body: {likenocase: keyword}}).each(function (record) {
    list.push(new Doc(record));
  });
  return m.prop(list);
}

Doc.find = function (id) {
  var data = taffyDB({id : {is : id}}).first();
  return data;
}

Doc.save = function (text) {
  var
    now = moment().format('YYYY-MM-DD HH:mm:ss'),
    data = {
      id : uuid.v1(),
      title : text.split(/\r\n|\r|\n/)[0].replace('# ', ''),
      body : text,
      created : now,
      updated : now
    },
    json
    ;

  taffyDB.insert(data);
  json = taffyDB().stringify();
  localStorage.setItem('docs', json);
  return new Doc(data);
};

Doc.update = function (text, doc) {
  var
    now = moment().format('YYYY-MM-DD HH:mm:ss'),
    json
    ;
  doc.title(text.split(/\r\n|\r|\n/)[0].replace('# ', ''));
  doc.body(text);
  doc.updated(now)

  taffyDB({id: doc.id()}).update(doc);
  json = taffyDB().stringify();
  localStorage.setItem('docs', json);
};

Doc.delete = function (id) {
  var json;
  taffyDB({id: id}).remove();
  json = taffyDB().stringify();
  localStorage.setItem('docs', json);
};

module.exports = Doc;