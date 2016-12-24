var Doc = require('../src/model/doc_model');
var assert = require('power-assert');

describe('myDoc', function () {
  it ('can create instance with data', function () {
    var data = {
      id: '01234-56789-09876',
      title: 'Lorem ipsum dolor',
      body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad, assumenda delectus fuga odit quaerat quam repellendus repudiandae totam. Ab architecto aut eaque facilis inventore labore magnam molestias officia ullam veniam?',
      created: '2016-09-22 00:38:00',
      updated: '2016-09-22 09:38:00'
    };
    var doc = new Doc(data);
    var link = '/' + encodeURIComponent(data.title) + '/' + encodeURIComponent('01234_56789_09876');
    assert(doc.link() === link);
    assert(doc.id() === data.id);
    assert(doc.title() === data.title);
    assert(doc.body() === data.body);
    assert(doc.created() === data.created);
    assert(doc.updated() === data.updated);
  })
});