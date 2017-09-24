'use strinct';

var m = require('mithril');
var Documents = require('../model/documents');

// タイトル一覧
module.exports = {
  // リストの初期化
  oninit: function () {
    console.log('side menu on init =================');
    Documents.loadList();
  },
  view: function () {
    return m('aside.menu',
      [
        // 検索フォーム
        m('.menu-label',
          m('p.control.has-icon.is-centered',
            [
              m('input.input.is-small[type=text][placeholder=Search]', {
                oninput: m.withAttr('value', Documents.search)
              }),
              m('i.fa.fa-search')
            ]
          )
        ),
        m('ul.menu-list', Documents.list.map(function (item) {
            return m('li',
              m('a', {
                  href: item.link(),
                  oncreate: m.route.link,
                  onupdate: m.route.link
                }, item.title()
              )
            )

          })
        )
      ]
    )
  }
};
