/*BB1 G Truslove 2017*/
define('Articles.View', [
    'Backbone',
    'article.tpl',
    'Article', 'Backbone.CompositeView', 'Articles.Related.View', 'SocialSharing.Flyout.View', 'Sidebar.List.View','Tracker'
  ],
  function(Backbone, article_tpl, Article, CompositeView, ItemRelationsRelatedView, SocialSharingFlyoutView, SidebarView,Tracker) {
    return Backbone.View.extend({
      initialize: function(options) {
        CompositeView.add(this);
        this.application = options.application;
        this.keywords = options.keywords;
      },
      childViews: {
        'Related.Items': function() {
          return new ItemRelationsRelatedView({
            itemsIds: this.model.get('relateditems').split(','),
            application: this.application
          });
        },
        'SocialSharing.Flyout': function() {
          return new SocialSharingFlyoutView({});
        },
        'Sidebar': function() {
var relatedcontent = Article.combineKeywords(this.model.get('relatedcontent'), this.keywords);
          
            return new SidebarView({ 'application': this.application, 'types': [this.model.get('type')], 'relatedcontent': relatedcontent,'startclosed':true,'colour':this.model.get('colour') });
          
        }
      },
      getTitle: function() {
        return SC.Tools.getTitle(this.model.get('name'));
      },
      getCanonical: function() {
        return Article.getHref(this.model.get('type'), this.model.get('url'));
      },
      getMetaDescription: function() {
          return this.model.get('summary');
        }

        // @method getMetaKeywords @return {String}
        ,
      getMetaKeywords: function() {
        return this.model.get('keywords');
      },
      getAddToHead: function() {
        return SC.Tools.getSEO({ title: this.model.get('name'), summary: this.model.get('summary'), image: this.model.get('image') });
      },
      getBreadcrumbPages: function getBreadcrumbPages() {
        var breadcrumbs = [];
        var type = this.model.get('type');
        breadcrumbs.push({ href: "/" + Article.getMainTypeUrl(type), text: Article.getMainText(type) });
        if (Article.getTypeUrl(type)) {
          breadcrumbs.push({ href: Article.getHref(type), text: Article.getTypeText(type) });
        }
        breadcrumbs.push({ });
        return breadcrumbs;
      },
      getNav: function(url) {
        if (url && url.toLowerCase().indexOf(".pdf") > -1) {
          return "ignore-click";
        }
      },
      getContext: function() {

        Tracker.getInstance().trackEvent({category:"viewArticle",action:"render",label:this.model.get('internalid')+"|"+this.model.get('name')});

        var content = Article.combineKeywords(this.model.get('content'), this.keywords);
        var relatedarticles = this.model.get('relatedarticles') || [];
        for (var i = 0; i < relatedarticles.length; i++) {
          relatedarticles[i].href = Article.getHref(relatedarticles[i].type, relatedarticles[i].url);
        }
        if (Article.showSidebar(this.model.get('type'))) {
        //Add some generic related articles
        var main = Article.getMainText(this.model.get('type'));
        var sub = Article.getTypeText(this.model.get('type'));
        if (sub) {
          relatedarticles.push({
            name: SC.Utils.translate("More " + sub),
            type: this.model.get('type'),
            href: Article.getHref(this.model.get('type'))
          });
        }
        if (main) {
          relatedarticles.push({
            name: SC.Utils.translate("More " + main),
            type: Article.getMainType(this.model.get('type')),
            href: Article.getHref(Article.getMainType(this.model.get('type')))
          });
        }
        }


        var relateditems = this.model.get('relateditems');
        var image = this.model.get('image');
        if (image && image.length == 0) {
          image = undefined;
        }
        return {
          'name': this.model.get('name'),
          'content': content,
          'relateditems': relateditems,
          'relatedarticles': relatedarticles,
          'colour': this.model.get('colour'),
          lightcolour:SC.Tools.brightenColor(this.model.get('colour'),0.44),
          lightestcolour:SC.Tools.brightenColor(this.model.get('colour'),0.88),
          'url': this.model.get('url'),
          'nav': this.getNav(this.model.get('url')),
          'image': image,
          'type': this.model.get('type'),
          'typetext': Article.getFullTypeText(this.model.get('type')),
          'typeurl': Article.getTypeUrl(this.model.get('type')),
          'internalid': this.model.get('internalid'),
          'language': this.model.get('language'),
          'hasrelatedarticles': relatedarticles.length > 0,
          'hasrelateditems': relateditems && relateditems.length > 0,
          'showSidebar': true
        }
      },

      template: article_tpl

    });
  }
)