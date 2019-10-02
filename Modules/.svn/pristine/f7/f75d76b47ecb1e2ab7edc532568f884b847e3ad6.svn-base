/*BB1 G Truslove 2017*/
define('Articles.List.View', [
	'Backbone', 'articles_list.tpl', 'Backbone.CollectionView', 'Backbone.CompositeView', 'Articles.Details.View', 'Sidebar.List.View', 'Article','Tools'
], function(Backbone, articles_list_tpl, CollectionView, CompositeView, ArticlesDetailsView, SidebarView, Article,Tools) {
	return Backbone.View.extend({
		initialize: function(options) {
			CompositeView.add(this);
			this.application = options.application;
			this.collection = options.collection;
			this.type = options.type;
			this.query = options.query;
			this.sidebarTypes = options.sidebarTypes;
			self=this;
this.on('afterViewRender', function() {
setTimeout(function(){ SC.Tools.resizeResponsiveColumns(self.$el); }, 100); //Make the columns the same size. Bit of a hack to use setTimeout
	
});
		},
		getQueryText: function() {
		if(this.query){
		return " | "+this.query;
		}else{
		return "";
		}
		},
		getTitle: function() {
		//console.log(this.type);
			return SC.Tools.getTitle(Article.getTypeText(this.type)+this.getQueryText());
		},
		getCanonical: function() {
			return Article.getHref(this.type);
		},
		getMetaDescription: function() {
			return SC.Utils.translate(Article.getFullTypeText(this.type)+this.getQueryText());
		},
		getAddToHead: function() {
			return SC.Tools.getSEO({ title: Article.getFullTypeText(this.type), summary: this.getMetaDescription() });
		},
		getBreadcrumbPages: function getBreadcrumbPages ()
  {
  var breadcrumbs=[];
  
  breadcrumbs.push({href:"/"+Article.getMainTypeUrl(this.type),text:Article.getMainText(this.type)});
  if(Article.getTypeUrl(this.type)){
  breadcrumbs.push({href:Article.getHref(this.type),text:Article.getTypeText(this.type)});
  }
  if(this.query){
  breadcrumbs.push({text:this.query});
  }
  				return breadcrumbs;
  },
		childViews: {
			'Articles.Collection': function() {
				//console.log("Main: "+JSON.stringify(this.collection));
				return new CollectionView({
					'childView': ArticlesDetailsView,
					'collection': this.collection,
					'type': this.type
				});
			},
			'Sidebar': function() {
			
				if (Article.showSidebar(this.type)) {
					return new SidebarView({ 'application': this.application,'types':this.sidebarTypes,'query':this.query });
				} else {
					return null;
				}
			}
		},
		template: articles_list_tpl,
		getContext: function() {
			return { type: this.type, bannertext: Article.getBannerText(this.type),
			showSidebar:Article.showSidebar(this.type),bannerimage:Article.getMainTypeBanner(this.type),empty:this.collection.length==0 }
		}
	});
});