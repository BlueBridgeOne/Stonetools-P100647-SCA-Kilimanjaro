/*BB1 G Truslove 2017*/
define('Articles.Home.View', [
	'Backbone', 'articles_home.tpl', 'Backbone.CollectionView', 'Backbone.CompositeView', 'Articles.Home.Details.View', 'Article'
], function(Backbone, articles_home_tpl, CollectionView, CompositeView, ArticlesHomeDetailsView, Article) {
	return Backbone.View.extend({
		initialize: function(options) {
			CompositeView.add(this);
			this.application = options.application;
			this.collection = options.collection;
			this.type = options.type;
			self=this;
this.on('afterViewRender', function() {
setTimeout(function(){ SC.Tools.resizeResponsiveColumns(self.$el); }, 100); //Make the columns the same size. Bit of a hack to use setTimeout
	
});
		},
		childViews: {
			'Articles.Collection': function() {
				return new CollectionView({
					'childView': ArticlesHomeDetailsView,
					'collection': this.collection,
					'type': this.type
				});
			}
		},
		template: articles_home_tpl,
		getContext: function() {
			return {loaded:this.collection.length>0 }
		}
	});
});