var marked = require('marked');
var mermaidAPI = require('./mermaid_api');
var uuid = require('node-uuid');

marked.setOptions({
  sanitize: true
});

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
  var reg = /^\[[ x]\] +/;
  if (!reg.test(text)) {
    // checkboxのマークアップがない場合はそのまま返す
    return '<li>' + text + '</li>\n';
  }
  // checkの有無を確認
  var checked = /^\[x\] +/.test(text);
  var checkbox = '<input type="checkbox"' + (checked ? ' checked="checked"' : '') + '>&nbsp;';
  // マークアップをcheckboxに置換する
  text = text.replace(reg, checkbox);
  return '<li><label>' + text + '</label></li>\n';
};

renderer.code = function(code, lang, escaped) {
  if(/^sequenceDiagram/.test(code) || /^graph/.test(code)) {
    // console.log(code);
    return '<div class="mermaid">'+mermaidAPI.render(uuid.v1(), code)+'</div>';
  }

  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return '<pre><code>'
      + (escaped ? code : escape(code, true))
      + '\n</code></pre>';
  }

  return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '\n</code></pre>\n';
};

marked.render = function (text) {
  return marked(text, { renderer: renderer })
};

module.exports = marked;