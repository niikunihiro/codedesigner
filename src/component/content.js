'use strict'

var m = require('mithril');
var Docs = require('../model/documents');
var Doc  = require('../model/doc_model');

module.exports = {
  oninit: function(vd) {
    console.log('Content on init ============');
    console.log(vd.attrs.id);
    if (typeof vd.attrs.id === 'undefined') {
      console.log('oninit new ~~~~~~~~~~~~~~');
      this.document = new Doc();
    } else {
      console.log('oninit load ~~~~~~~~~~~~~~');
      this.document = Docs.load(vd.attrs.id);
    }
    console.log(vd.state.document);

    vd.state.download = function () {
      Docs.download(vd.attrs.id);
    }
  },
  oncreate: function(vd) {
    console.log('Content on create ============');
    console.log(vd.attrs.title);
    console.log(vd.state.document);
  },
  onupdate: function(vd) {
    console.log('Content on update ============');
    console.log(vd.attrs.title);
    console.log(vd.state.document);
  },
  view: function (vd) {
    return m('.columns', [
      m('.column.is-6',
        [
          m('#viewer.content', [m.trust(vd.state.document.marked())]),
          m('#notifier.is-pulled-right',[
            m("span#notification.tag.is-success",
              vd.state.notification
            )
          ])
        ]
      ),
      m('.column.is-6',
        m('p.control',
          m('textarea.textarea[name="editor"]', {
              oninput: m.withAttr('value', vd.state.document.body)
            },
            vd.state.document.body()
          )
        ),
        m('p.control',
          [
            m('a.button.is-primary', {onclick: function(){Docs.save(vd.state.document)}}, [
              m('span.icon', m('i.fa.fa-hdd-o[area-hidden=true]')),
              m('span', 'Save')
            ]),
            m.trust('&nbsp;'),
            // m('input.button.is-success[type="submit"][value="Sync"]')
            m('a.button.is-danger', {
                onclick: function () {
                  if (!confirm('Are you sure you want delete this?')) {
                    return;
                  }
                  if (!Docs.destroy(vd.attrs.id)) {
                    alert('削除できませんでした。');
                    return;
                  }
                  m.route.set('/');
                },
                class: vd.attrs.id && vd.attrs.id.length === 0 ? 'is-disabled' : ''
              },
              [
                m('span.icon', m('i.fa.fa-trash-o[area-hidden=true]')),
                m('span', 'Delete')
              ]
            ),
            m.trust('&nbsp;'),
            m('a.button.is-info', {
                onclick: vd.state.download,
                class: vd.attrs.id && vd.attrs.id.length === 0 ? 'is-disabled' : ''
              },
              [
                m('span.icon', m('i.fa.fa-cloud-download[area-hidden=true]')),
                m('span', 'Download')
              ]
            )
          ]
        )
      )
    ]);
  }
}