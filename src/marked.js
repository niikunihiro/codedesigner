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
    var mermaidId = 'mermaidId' + uuid.v1().replace(/-/g, '').substr(0, 7);
    var cb = function(svgCode, bindFunctions){
      console.log(svgCode);
    };
    var element = document.getElementById('temp');
    var graph = mermaidAPI.render(mermaidId, code, cb, element);
    if (graph == null) {
      element.textContent = null;
      return '';
    }
    return '<div class="mermaid">'+graph+'</div>';
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