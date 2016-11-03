'use strict';

var m = require('mithril');
var vm = require('../view_model');

module.exports = {
  controller: function () {
    this.new = function () {
      vm.new();
      return m.route('/');
    }
  },
  view: function (ctrl) {
    return m('nav.nav', [
        m('.nav-left',
          m('a.nav-item.is-5.title', {onclick: ctrl.new},
            [
              m('span.fa-stack',
                [
                  m('i.fa.fa-circle.fa-stack-2x'),
                  m('i.fa.fa-book.fa-stack-1x.fa-inverse[aria-hidden="true"]')
                ]
              ),
              m('h1', 'CodeDesigner')
            ]
          )
        ),
        m('.nav-center',
          m('a.nav-item[href=https://github.com/niikunihiro/codedesigner]',
            m('span.icon',
              m('i.fa.fa-github')
            )
          )
        ),
        m('span.nav-toggle[id="nav-toggle"]',
          [
            m('span'),
            m('span'),
            m('span')
          ]
        ),
        m('.nav-right.nav-menu[id="nav-menu"]',
          m('span.nav-item',
            m('a.button.is-success', {onclick: ctrl.new},
              [
                m('span.icon',
                  m('i.fa.fa-pencil-square-o')
                ),
                m('span', 'New')
              ]
            )
          )
        )
      ]
    );
  }
};
