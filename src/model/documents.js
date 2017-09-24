var m = require('mithril');
var Doc = require('./doc_model');
/*
 *
 */
var Documents = {
  document: new Doc(),
  list: [],
  loadList: function () {
    console.log('documents loadList');
    Documents.list = Doc.readStorage();
    // console.log(Documents.list)
  },
  search: function (value) {
    Documents.list = Doc.search(value);
    // console.log(Documents.list)
  },
  load: function (id) {
    console.log('documents.load() ==================')
    if (typeof id === 'undefined') {
      return new Doc();
    }
    if (Documents.list.length < 1) {
      Documents.list = Doc.read();
    }
    var documents = Documents.contain(id);
    // console.log(documents);
    if (documents.length < 1) {
      return new Doc();
    }
    return documents[0];
  },
  save: function(doc) {
    if (doc.id().length === 0) {
      var newDoc = Documents.add(doc);
      // 新規登録完了時は編集画面にリダイレクト
      m.route.set(newDoc.link());
      m.redraw();
    } else {
      var editDoc = Documents.edit(doc);
      if (!editDoc) {
        // エラー時はアラート
        alert('更新できませんでした。');
        return;
      }
      // vnode.state.notify("saved");
      m.route.set(editDoc.link());
      m.redraw();
    }
  },
  add: function(doc) {
    console.log('documents add');
    var newDoc;
    // TODO 入力チェック
    // 保存
    newDoc = Doc.save(doc);
    // リストの更新
    Documents.list = Doc.read();
    return newDoc;
  },
  edit: function(doc) {
    console.log('documents edit');
    var newDoc;
    // TODO 入力チェック

    // list内で存在確認
    var documents = Documents.contain(doc.id());
    if (documents.length !== 1) {
      return false;
    }
    // モデルメソッドの呼び出し
    newDoc = Doc.update(doc);
    // リストの更新
    Documents.list = Doc.read();
    return newDoc;
  },
  destroy: function(id) {
    // list内で存在確認
    var documents = Documents.contain(id);
    if (documents.length !== 1) {
      return false;
    }
    Doc.delete(id);
    return true;
  },
  download: function (id) {
    var documents = Documents.contain(id);
    console.log(documents);
    if (documents.length !== 1) {
      return false;
    }

    Doc.download(documents[0]);
  },
  contain: function(id) {
    console.log('documents.contain() ===================');
    if (Documents.list.length < 1) {
      Documents.list = Doc.read();
    }
    id = id.replace(/_/g, '-');
    return Documents.list.filter(function (doc) {
      return doc.id() === id;
    });
  }
}

module.exports = Documents;
