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

marked.render = function (text) {
  return marked(text, { renderer: renderer })
};

module.exports = marked;