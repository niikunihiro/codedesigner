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
  console.log('Doc constructor');
  console.log(data);
  this.id = m.prop(data.id);
  this.body = m.prop(data.body);
  this.created = m.prop(data.created);
  this.updated = m.prop(data.updated);
}

Doc.read = function (id) {
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
  // TODO saveに成功したら一覧部分を更新する

};

Doc.update = function () {};

module.exports = Doc;