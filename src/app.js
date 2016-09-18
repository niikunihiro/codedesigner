"use strict";

var
  m = require("mithril"),
  marked = require('./marked'),
  moment = require('moment'),
  uuid = require('node-uuid'),
  doc_model = require('./doc_model')
;

/**
 * 1. データの読み込みと表示
 * 2. モジュール化
 * 3.1. 更新処理
 * 3.2. 削除処理
 * 4. 登録・更新・削除後の一覧の再読み込み
 * TODO 5. 全体的な調整（入力チェック、後はmithrilに合わせる）
 * TODO 6. herokuにあげる
 */

// ビューモデル
var vm = {
  id: m.prop(''),
  edit: null,
  init: function() {
    vm.list = doc_model.readStorage();
    // 編集中のデータを入れるプロパティ
    vm.edit = m.prop('');
  },
  initList: function () {
    vm.list = doc_model.read();
  },
  read: function (id) {
    var docs = vm.list().filter(function(doc){
      return doc.id() === id;
    });
    if (docs.length < 1) {
      return m.route('/');
    }
    var doc = docs[0];
    vm.id = m.prop(doc.id());
    vm.edit = m.prop(doc.body());
  },
  search: function (value) {
    vm.list = doc_model.search(value);
  },
  marked: function (data) {
    if (data === '') {
      return '';
    }
    return marked.render(data);
  },
  save: function () {
    var
      id = vm.id(),
      body = vm.edit(),
      doc
    ;

    /*
     * TODO エラー判定ちゃんと作る
     */
    if (body.length < 10) {
      alert('もっと入力してからのsaveじゃないとNG!!');
      return false;
    }
    if (id.length < 1) {
      // vm.id()が空の場合はINSERT
      doc = doc_model.save(vm.edit());
      vm.list = doc_model.read();
      // 新規登録完了時は編集画面にリダイレクト
      m.route(doc.link());
      return;
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
    vm.edit = m.prop('');
    vm.list = doc_model.read();
    m.route('/');
    return;
  }
}


// タイトル一覧
var SideMenu = {
  controller: function(){
    this.search = function(value){
      vm.search(value);
    }
    vm.init();
  },
  view: function (ctrl) {
    return m('aside.menu',
      [
        // 検索フォーム
        m('.menu-label',
          m('p.control.has-icon.is-centered',
            [
              m('input', {type: 'text', class: 'input is-small', placeholder: 'Search', oninput: m.withAttr('value', ctrl.search)}),
              m('i', {class: 'fa fa-search'})
            ]
          )
        ),
        m('ul.menu-list', vm.list().map(function (item) {
            return m('li', m('a', {href: item.link(), config: m.route}, item.title()))
          })
        )
      ]
    )
  }
};

// エディター部分
var Editor = {
  controller: function () {
    var id = m.route.param('id');

    this.save = function () {
      vm.save();
    }

    this.delete = function () {
      vm.delete();
    }

    this.key_save = function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        vm.save();
        return false;
      }
    }

    if (typeof id !== "undefined") {
      // idがある時はデータを読み込む
      this.id = id.replace(/_/g, '-');
      vm.read(this.id);
      // リストの初期化
      vm.initList();

      return false;
    }
  },
  view: function (ctrl) {
    return m('.columns',
      [
        m('.column',
            [
              m('p.control',
                m(
                  'textarea.textarea[name="editor"]',
                  {
                    oninput: m.withAttr('value', vm.edit),
                    /*config: function (element) {element.focus();},*/
                    onkeydown: ctrl.key_save
                  },
                  vm.edit()
                )
              ),
              m('p.control',
                [
                  m('input', {type: 'submit', value: 'Save', onclick: ctrl.save, class: 'button is-primary'}),
                  m.trust('&nbsp;'),
                  // m('input.button.is-success[type="submit"][value="Sync"]')
                  // TODO 新規登録時は隠す
                  m('input', {type: 'submit', value: 'Delete', onclick: ctrl.delete, class: 'button is-danger'})
                ]
              )
            ]
        ),
        m('.column',
          m('.content[id="viewer"]', [m.trust(vm.marked(vm.edit()))])
        )
      ]
    );
  }
}


m.mount(document.getElementById('documents'), SideMenu);

m.route.mode = "pathname";
m.route(document.getElementById('designer'), '/', {
  '/': Editor,
  '/:title/:id' : Editor
});