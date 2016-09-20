'use strict';

var m = require('mithril');
var vm = require('../view_model');

module.exports = {
  controller: function () {
    var ctrl = this;
    var id = m.route.param('id');

    this.is_new = (typeof id === "undefined");

    this.save = function () {
      if (vm.id().length < 1) {
        var link = vm.insert();
        // 新規登録完了時は編集画面にリダイレクト
        m.route(link);
      } else {
        vm.update();
      }
    }

    this.delete = function () {
      vm.delete();
      m.route('/');
    }

    this.key_save = function (e) {
      if ((e.ctrlKey || e.metaKey) && e.keyCode === 83) {
        ctrl.save();
        return false;
      }
    }

    if (typeof id !== "undefined") {
      // idがある時はデータを読み込む
      this.id = id.replace(/_/g, '-');
      if (!vm.read(this.id)) {
        return m.route('/');
      }
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
                  onkeydown: ctrl.key_save,
                  config: function (element, isInitialized) {
                    if (isInitialized) return;
                    element.focus();
                  }
                },
                vm.edit()
              )
            ),
            m('p.control',
              [
                m('a', {onclick: ctrl.save, class: 'button is-primary'}, [
                    m('span', {class: 'icon'}, m('i', {class: 'fa fa-hdd-o', 'area-hidden': true})),
                    m('span', 'Save')
                ]),
                m.trust('&nbsp;'),
                // m('input.button.is-success[type="submit"][value="Sync"]')
                m('a', {
                  onclick: ctrl.delete,
                  class: ctrl.is_new ? 'button is-danger is-disabled':'button is-danger'
                  },
                  [
                    m('span', {class: 'icon'}, m('i', {class: 'fa fa-trash-o', 'area-hidden': true})),
                    m('span', 'Delete')
                  ]
                )
              ]
            )
          ]
        ),
        m('.column',
          m('#viewer.content', [m.trust(vm.marked(vm.edit()))])
        )
      ]
    );
  }
}
