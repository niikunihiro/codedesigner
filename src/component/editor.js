'use strict';

var m = require('mithril');
var velocity = require('velocity-animate');
var Documents = require('../model/documents');

module.exports = {
  oninit: function (vnode) {
    console.log('エディター oninit');
    vnode.state.notification = '';
    vnode.state.doc = Documents.load(vnode.attrs.id);
    vnode.state.is_new = (typeof vnode.attrs.id === "undefined");

    vnode.state.save = function () {
      if (vnode.state.doc.id().length < 1) {
        var newDoc = Documents.add(vnode.state.doc);
        console.log(newDoc);
        // 新規登録完了時は編集画面にリダイレクト
        m.route.set(newDoc.link());
      } else {
        var editDoc = Documents.edit(vnode.state.doc);
        if (!editDoc) {
          // エラー時はアラート
          alert('更新できませんでした。');
          return;
        }
        vnode.state.notify("saved");
        m.route.set(editDoc.link());
      }
    };

    vnode.state.delete = function () {
      if (!confirm('Are you sure you want delete this?')) {
        return;
      }
      if (!Documents.destroy(vnode.state.doc)) {
        alert('削除できませんでした。');
        return;
      }
      m.route.set('/');
    };

    vnode.state.download = function () {
      Documents.download(vnode.state.doc);
    };

    vnode.state.key_save = function (e) {
      console.log('key down ===============')
      console.log(e);
      if ((e.ctrlKey || e.metaKey) && e.keyCode === 83) {
        console.log('keyCode is 83')
        vnode.state.save();
      }
      return true;
    };

    vnode.state.notify = function (msg) {
      vnode.state.notification = msg;
      var el = document.getElementById('notification');
      velocity(el, {opacity: 0.7}, {duration: 2000, complete: function(){
        velocity(el, {opacity: 0}, {duration: 2000});
      }});
    };
  },
  oncreate: function(vnode) {
    console.log("エディター created =================================")
  //   console.log('id: ' + vnode.attrs.id);
    vnode.state.doc = Documents.load(vnode.attrs.id);
    console.log(vnode.state.doc);
  },
  onupdate: function(vnode) {
    console.log("エディター updated =================================")
  //   console.log('id: ' + vnode.attrs.id);
    vnode.state.doc = Documents.load(vnode.attrs.id);
    console.log(vnode.state.doc);
  },
  view: function (vnode) {
    return m('.columns',
      [
        m('.column.is-6',
          [
            m('#viewer.content', [m.trust(vnode.state.doc.marked())]),
            m('#notifier.is-pulled-right',[
              m("span#notification.tag.is-success",
                vnode.state.notification
              )
            ])
          ]
        ),
        m('.column.is-6',
          [
            m('p.control',
              m(
                'textarea.textarea[name="editor"]',
                {
                  oninput: m.withAttr('value', vnode.state.doc.body),
                  // onkeydown: vnode.state.key_save,
                  // config: function (element, isInitialized) {
                  //   console.log('save button');
                  //   if (isInitialized) return;
                  //   element.focus();
                  // }
                },
                vnode.state.doc.body()
              )
            ),
            m('p.control',
              [
                m('a.button.is-primary', {onclick: vnode.state.save}, [
                  m('span.icon', m('i.fa.fa-hdd-o[area-hidden=true]')),
                  m('span', 'Save')
                ]),
                m.trust('&nbsp;'),
                // m('input.button.is-success[type="submit"][value="Sync"]')
                m('a.button.is-danger', {
                    onclick: vnode.state.delete,
                    class: vnode.state.is_new ? 'is-disabled' : ''
                  },
                  [
                    m('span.icon', m('i.fa.fa-trash-o[area-hidden=true]')),
                    m('span', 'Delete')
                  ]
                ),
                m.trust('&nbsp;'),
                m('a.button.is-info', {
                    onclick: vnode.state.download,
                    class: vnode.state.is_new ? 'is-disabled' : ''
                  },
                  [
                    m('span.icon', m('i.fa.fa-cloud-download[area-hidden=true]')),
                    m('span', 'Download')
                  ]
                )
              ]
            )
          ]
        )
      ]
    );
  }
}
