/* BB1 G Truslove Jan 2018 */

define('ShopWindow.Router', [
	'Backbone', 'ShopWindow.List.View', 'ShopWindow.Collection'
], function(Backbone, ShopWindowListView, Collection) {

	return Backbone.Router.extend({
		initialize: function(application) {
			this.application = application;
		},
		routes: {

			'shopwindow': 'ShopWindow'
		},
		ShopWindow: function() {

			var collection = new Collection();
			var view = new ShopWindowListView({ collection: collection, application: this.application });
			collection.fetch().done(function() {
				collection.comparator = function(model) {
					return model.get('parent');
				}
				collection.sort();
				var parent;
				collection.map(function(cat) { //sort the cats into parent cats.
					if (parent != cat.get("parent")) {
					var fullurl=cat.get("fullurl");
					var slash=fullurl.indexOf("/",1);
					if(slash>-1){
					var fullurl=fullurl.substring(0,slash);
					}
						parent = cat.get("parent");
						cat.set("newparent", true);
						cat.set("parenturl", fullurl);
						cat.set("parenticon", "/icons/shopwindow"+fullurl+".png");
						

					}

				});
				view.showContent();

			});
		}
	});
});