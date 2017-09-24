var m = require('mithril');

var Header = require('./header');
var SideMenu = require('./side_menu');
var Editor = require('./editor');

module.exports = {
  view: function (vnode) {
    return [
      m('section#header', m(Header)),
      m('section.main-contents', m('.columns', [
        m('#documents.documents.column.is-2', m(SideMenu)),
        m('#designer.designer.column.is-10', m(Editor, vnode.attrs))
      ])),
      m('#temp.temp')
    ];
  }
}