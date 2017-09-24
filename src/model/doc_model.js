"use strict";

var
  prop = require('mithril/stream'),
  moment = require('moment'),
  taffyDB = require('./../adapter/taffy_db'),
  uuid = require('node-uuid'),
  FileSaver = require('file-saver'),
  marked = require('./../adapter/marked')
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
  if (data && data.title && data.id) {
    this.link = prop('/' + encodeURIComponent(data.title) + '/' + encodeURIComponent(data.id.replace(/-/g, '_')))
    this.id = prop(data.id);
    this.title = prop(data.title);
    this.body = prop(data.body);
    this.created = prop(data.created);
    this.updated = prop(data.updated);
  } else {
    this.link = prop('/');
    this.id = prop('');
    this.title = prop('');
    this.body = prop('');
    this.created = prop('');
    this.updated = prop('');
  }

  this.marked = function () {
    var text = this.body();
    if (text === '') {
      return '';
    }

    // if (vm.previous_edit === text) {
    //   return vm.rendered;
    // }

    this.rendered = marked.render(text);
    // vm.previous_edit = text;
    return this.rendered;
  }
}
/**
 * 画面初期化時に呼ぶ
 * @returns {Array}
 */
Doc.readStorage = function () {
  console.log('doc readStorage() ================');
  var
    list = [],
    src = localStorage.getItem('docs'),
    json = []
    ;
  if (src) {
    json = JSON.parse(src);
    taffyDB.insert(json);
    taffyDB().each(function (record) {
      // Docモデルのコレクションにする
      list.push(new Doc(record));
    });
  }
  return list;
}

Doc.read = function () {
  var list = [];
  taffyDB().each(function (record) {
    list.push(new Doc(record));
  });
  return list;
}

Doc.search = function (keyword) {
  var list = [];
  taffyDB({body: {likenocase: keyword}}).each(function (record) {
    list.push(new Doc(record));
  });
  return list;
}

Doc.find = function (id) {
  var data = taffyDB({id : {is : id}}).first();
  return data;
}

Doc.save = function (doc) {
  var
    now = moment().format('YYYY-MM-DD HH:mm:ss'),
    data = {
      id : uuid.v1(),
      title : doc.body().split(/\r\n|\r|\n/)[0].replace('# ', ''),
      body : doc.body(),
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

/**
 * update item
 * @param doc
 */
Doc.update = function (doc) {
  var
    now = moment().format('YYYY-MM-DD HH:mm:ss'),
    data,
    json
  ;
  data = {
    id : doc.id(),
    title : doc.body().split(/\r\n|\r|\n/)[0].replace('# ', ''),
    body :   doc.body(),
    created : doc.created(),
    updated : now
  };

  taffyDB({id: doc.id()}).update(data);
  json = taffyDB().stringify();
  localStorage.setItem('docs', json);
  return new Doc(data);
};

/**
 * delete item from taffy and localStorage by id
 * @param id
 */
Doc.delete = function (id) {
  var json;
  taffyDB({id: id}).remove();
  json = taffyDB().stringify();
  localStorage.setItem('docs', json);
};

/**
 * download item by markdown file.
 * @param doc
 */
Doc.download = function (doc) {
  const body = doc.body();
  const filename = doc.title() + ".md";
  const blob = new Blob([body], {type : "text/markdown;charset=utf-8"});
  FileSaver.saveAs(blob, filename);
}

module.exports = Doc;
