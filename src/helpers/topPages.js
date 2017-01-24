// "dist/docs/whatever" => "/docs", "dist" => "/"
function getCurrentTopHref(currentPage) {
  return '/' + (currentPage.dirname.split('/')[1] || '');
}

module.exports.register = function (Handlebars, options)  { 
  Handlebars.registerHelper('isCurrentTopHref', function (topHref, currentPage, options)  {
    var currentTopHref = getCurrentTopHref(currentPage);
    return (topHref === currentTopHref) ? options.fn(this) : '';
  });

  Handlebars.registerHelper('findTopTitle', function(topPages, currentPage, options) {
    var currentTopHref = getCurrentTopHref(currentPage);
    var currentItem = topPages.find(function(item) {
      return item.href === currentTopHref;
    });
    return currentItem.title;
  });
};