'use strinct';

var m = require('mithril');
var vm = require('../view_model');

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
              m('input.input.is-small[type=text][placeholder=Search]', {oninput: m.withAttr('value', ctrl.search)}),
              m('i.fa.fa-search')
            ]
          )
        ),
        m('ul.menu-list', vm.list().map(function (item) {
            return m('li', m('a', {href: item.link(), key: item.id(), config: m.route}, item.title()))
          })
        )
      ]
    )
  }
};


module.exports = SideMenu;
