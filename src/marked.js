var marked = require('marked');
var renderer = new marked.Renderer();

renderer.table = function(header, body) {
  return '<table class="table is-bordered is-striped is-narrow">\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + '<tbody>\n'
    + body
    + '</tbody>\n'
    + '</table>\n';
};

renderer.listitem = function(text) {
  var re_checkbox = /^\[([ x])\] +/;
  if (!re_checkbox.test(text)) {
    // checkboxのマークアップがない場合はそのまま返す
    return '<li>' + text + '</li>\n';
  }
  // checkの有無を確認
  var checked = /^\[x\] +/.test(text);
  var checkbox = '<input type="checkbox"' + (checked ? ' checked="checked"' : '') + '>&nbsp;';
  // マークアップをcheckboxに置換する
  text = text.replace(re_checkbox, checkbox);
  return '<li><label>' + text + '</label></li>\n';
};

marked.render = function (text) {
  return marked(text, { renderer: renderer })
};

module.exports = marked;