'use strict';

var m = require('mithril');
var doc_model = require('./doc_model');
var marked = require('./marked');

// ビューモデル
var vm = {
  id: m.prop(''),
  edit: null,
  error_msg : [],
  previous_edit: '',
  rendered: '',
  init: function() {
    vm.list = doc_model.readStorage();
    // 編集中のデータを入れるプロパティ
    vm.edit = m.prop('');
  },
  initList: function () {
    vm.list = doc_model.read();
  },
  new: function () {
    vm.id = m.prop('');
    vm.edit = m.prop('');
  },
  read: function (id) {
    var docs = vm.list().filter(function(doc){
      return doc.id() === id;
    });
    if (docs.length < 1) {
      return false;
    }
    var doc = docs[0];
    vm.id = m.prop(doc.id());
    vm.edit = m.prop(doc.body());
    return true;
  },
  search: function (value) {
    vm.list = doc_model.search(value);
  },
  download : function () {
    var docs = vm.list().filter(function(doc){
      return doc.id() === vm.id();
    });
    if (docs.length < 1) {
      return false;
    }
    doc_model.download(docs[0]);
  },
  marked: function () {
    var text = vm.edit();
    if (text === '') {
      return '';
    }

    if (vm.previous_edit === text) {
      return vm.rendered;
    }

    vm.rendered = marked.render(text);
    vm.previous_edit = text;
    return vm.rendered;
  },
  insert: function () {
    var body = vm.edit();
    var doc;

    // 入力チェック
    if (!vm.validate(body)) {
      var message = vm.error_msg.join("\n");
      alert(message);
      return false;
    }

    // vm.id()が空の場合はINSERT
    doc = doc_model.save(vm.edit());
    vm.list = doc_model.read();
    // 新規登録完了時は編集画面にリダイレクトするのでリンクを返す
    return doc.link();
  },
  update: function () {
    var
      id = vm.id(),
      body = vm.edit()
    ;

    // 入力チェック
    if (!vm.validate(body)) {
      var message = vm.error_msg.join("\n");
      alert(message);
      return false;
    }

    // 更新判定（データの読み込みにtaffyDB使うかも）
    var docs = vm.list().filter(function (doc) {
      return doc.id() === id;
    });
    if (docs.length === 0) {
      alert('更新できませんでした。');
      return;
    }
    doc_model.update(vm.edit(), docs[0]);
    vm.list = doc_model.read();
    return;
  },
  delete : function () {
    var id = vm.id();
    // 存在確認
    var docs = vm.list().filter(function (doc) {
      return doc.id() === id;
    });
    if (docs.length === 0) {
      alert('削除できませんでした。');
      return;
    }

    // 削除処理
    doc_model.delete(id);
    // プロパティの初期化
    vm.new();
    // リストの再読み込み
    vm.list = doc_model.read();
    return;
  },
  validate : function (body) {
    vm.error_msg = [];
    /*
     * TODO エラー判定もうちょっと作り込む。例えばXSSとか
     */
    if (body.length < 10) {
      vm.error_msg.push('もっと入力してからのsaveじゃないとNG!!');
      return false;
    }

    return true;
  }
}

module.exports = vm;
