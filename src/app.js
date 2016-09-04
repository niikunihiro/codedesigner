"use strict";

var
  m = require("mithril"),
  marked = require('marked'),
  moment = require('moment'),
  uuid = require('node-uuid'),
  title_model = require('./title_model'),
  doc_model = require('./doc_model'),
  taffyDB = require('./taffy_db')
;

/**
 * TODO 1. データの読み込みと表示
 * TODO 2. モジュール化
 * TODO 3. 更新処理
 * TODO 4. 登録・更新後の一覧の再読み込み
 * TODO 5. 全体的な調整（mithrilに合わせてちゃんと作る）
 * TODO 6. Githubに登録
 * TODO 7. herokuにあげる
 */

// ビューモデル
var vm = {
  edit: null,
  init: function() {
    // vm.list = Title.list();
    vm.list = title_model.readStorage();
    // 編集中のデータを入れるプロパティ
    vm.edit = m.prop('');
  },
  read: function (id) {
    var data = doc_model.read(id);
    // vm.edit = m.prop(data.body);
    return data.body;
  },
  marked: function (data) {
    if (data === '') {
      return '';
    }
    return marked(data);
  },
  save: function () {
    /*
     * エラー判定
     * 新規登録
     * 更新
     */
    if (vm.edit() === '') {
      alert('からじゃ');
      return;
    }
    console.log('53');
    console.log(vm.edit());
    doc_model.save(vm.edit());
  }
}


// タイトル一覧
var SideMenu = {
  controller: function(){
    vm.init();
  },
  view: function (ctrl) {
    return m('aside.menu',
      [
        m('.menu-label',
          m('p.control.has-icon.is-centered',
            [
              m('input.input.is-small[placeholder="Search"][type="text"]'),
              m('i.fa.fa-search')
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
    var self = this;
    var id = m.route.param('id');
    this.save = function () {
      vm.save();
    }

    if (typeof id !== "undefined") {
      // idがある時はデータを読み込む
      this.id = id.replace(/_/g, '-');
      this.body = vm.read(this.id);
      // テキストエリアにフォーカス

      return false;
    }

    // フォーム部分を空で表示
    // this.body = doc_model.body;
  },
  view: function (ctrl) {
    return m('.columns',
      [
        m('.column',
            [
              m('p.control',
                m('textarea.textarea[name="editor"]', {oninput: m.withAttr('value', vm.edit), config: function (element) {element.focus();}}, ctrl.body)
              ),
              m('p.control',
                [
                  m('input.button.is-primary[type="submit"][value="Save"]', {onclick: ctrl.save}),
                  m.trust('&nbsp;'),
                  // m('input.button.is-success[type="submit"][value="Sync"]')
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