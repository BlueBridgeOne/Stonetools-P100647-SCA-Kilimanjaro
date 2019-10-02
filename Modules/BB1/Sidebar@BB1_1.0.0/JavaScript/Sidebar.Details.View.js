/* BB1 G Truslove 2015 */

define('Sidebar.Details.View', [
    'Backbone',
    'Article'
  ],
  function(Backbone, Article) {
    return Backbone.View.extend({
    getNav: function(url) {
        if (url && url.toLowerCase().indexOf(".pdf") > -1) {
          return "ignore-click";
        }
      },
      getContext: function() {
        
        return {
          'type': this.model.get('type'),
          'typetext': Article.getBannerText(this.model.get('type')),
          'name': this.model.get('name'),
          'url': this.model.get('url'),
          'nav': this.getNav(this.model.get('url')),
          'href': Article.getHref(this.model.get('type'),this.model.get('url')),
          'typeurl':Article.getTypeUrl(this.model.get('type')),
          'firsttype': this.model.get('firsttype'),
          'endoftype': this.model.get('endoftype'),
          'end': this.model.get('end')
        }
      }

    });
  }
)