// e.g. "/docs/technical_documentation/webmiddle.html"
function getCurrentPageHref(currentPage) {
  return '/' + currentPage.dest.split('/').slice(1).join('/');
}

// predicate can be either a fn or just a doc
function findDocNode(docs, parents, indexes, predicate) {
  for (var i = 0; i < docs.length; i++) {
    var doc = docs[i];

    var match = (typeof predicate === 'function') ? predicate : function (doc) { return predicate === doc; };
    if (match(doc)) {
      // found
      return { doc: doc, parents: parents, indexes: indexes.concat(i) };
    } else if (doc.children) {
      // recursion
      var result = findDocNode(doc.children, parents.concat([doc.children]), indexes.concat([i]), predicate);
      if (result) return result;
    }
  }

  // not found
  return null;
}

function findCurrentDocNode(docs, parents, indexes, currentPage) {
  var currentDocHref = getCurrentPageHref(currentPage);

  return findDocNode(docs, parents, indexes, function (doc) {
    var href = calculateDocHref(doc, docs);
    return currentDocHref === href;
  });
}

// "HTML/XML/JSON to JSON" => "html-xml-json_to_json.html"
function titleToFilename(title) {
  return title.toLowerCase().replace(/ /g, '_').replace(/\//g, '-') + '.html';
}

function calculateDocHref(doc, docs) {
  var docNode = findDocNode(docs, [docs], [], doc);
  if (!docNode) return null;

  var baseHref = '/';
  for (var i = docNode.parents.length - 1; i >= 0; i--) {
    var parent = docNode.parents[i][docNode.indexes[i]];
    if (parent.baseHref) baseHref = '/' + parent.baseHref + baseHref;
  }

  var docHref;
  if (doc.href) docHref = doc.href;
  else if (doc.baseHref) docHref = 'index.html';
  else docHref = titleToFilename(doc.title);

  return '/docs' + baseHref + docHref;
}

function findPreviousDoc(docNode) {
  // use previous sibling
  var parent = docNode.parents[docNode.parents.length - 1];
  if (!parent) return null;
  var index = docNode.indexes[docNode.parents.length - 1]; // child index
  var previousSibling = parent[index - 1];
  if (previousSibling) {
    // previous sibling last children
    if (previousSibling.children) return previousSibling.children[previousSibling.children.length - 1];
    // just previous sibilng
    return previousSibling;
  }

  // use parent
  parent = docNode.parents[docNode.parents.length - 2];
  if (!parent) return null;
  index = docNode.indexes[docNode.parents.length - 2];
  return parent[index] || null;
}

function findNextDoc(docNode) {
  // use first children
  if (docNode.doc.children) return docNode.doc.children[0];

  // use next sibling
  var parent = docNode.parents[docNode.parents.length - 1];
  if (!parent) return null;
  var index = docNode.indexes[docNode.parents.length - 1]; // child index
  var nextSibling = parent[index + 1];
  if (nextSibling) return nextSibling;

  // use parent next sibling
  parent = docNode.parents[docNode.parents.length - 2];
  if (!parent) return null;
  index = docNode.indexes[docNode.parents.length - 2];
  return parent[index + 1] || null;
}

function renderDocsNav(Handlebars, docs, rootDocs, currentPage, options)  {
  if (!docs) return '';

  var currentDocHref = getCurrentPageHref(currentPage);

  var result = '<ul class="nav">';
  for (var i = 0; i < docs.length; i++) {
    var title = Handlebars.Utils.escapeExpression(docs[i].title);
    var unescapedHref = calculateDocHref(docs[i], rootDocs);
    var href = Handlebars.Utils.escapeExpression(unescapedHref);
    var active = (unescapedHref === currentDocHref);
    result += '\
      <li>\
        <a' + (active ? ' class="active" ' : ' ') + 'href="' + href + '">' + title + '</a>\
        ' + renderDocsNav(Handlebars, docs[i].children, rootDocs, currentPage, options) + '\
      </li>\
    ';
  }
  result += '</ul>';

  return new Handlebars.SafeString(result); // mark as already escaped
}

module.exports.register = function (Handlebars, options) {
  Handlebars.registerHelper('renderDocsNav', function (docs, currentPage, options) {
    return renderDocsNav(Handlebars, docs, docs, currentPage, options);
  });

  Handlebars.registerHelper('withPreviousDocsNav', function (docs, currentPage, options)  {
    var docNode = findCurrentDocNode(docs, [docs], [], currentPage);
    if (!docNode) return;
    var previousDoc = findPreviousDoc(docNode);
    if (!previousDoc) return;

    return options.fn({
      title: previousDoc.title,
      href: calculateDocHref(previousDoc, docs)
    });
  });

  Handlebars.registerHelper('withNextDocsNav', function(docs, currentPage, options)  {
    var docNode = findCurrentDocNode(docs, [docs], [], currentPage);
    if (!docNode) return;
    var nextDoc = findNextDoc(docNode);
    if (!nextDoc) return;

    return options.fn({
      title: nextDoc.title,
      href: calculateDocHref(nextDoc, docs)
    });
  });
};
