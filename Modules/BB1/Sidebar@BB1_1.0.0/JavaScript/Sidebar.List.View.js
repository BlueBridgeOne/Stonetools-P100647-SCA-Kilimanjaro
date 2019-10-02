/* BB1 G Truslove 2015 */

define('Sidebar.List.View', [
	'Backbone', 'sidebar_list.tpl', 'Backbone.CollectionView', 'Backbone.CompositeView', 'ArticleOverview.Model',
	'Sidebar.Collection', 'SC.Configuration', 'Article', 'ArticleKeywords.Model'
], function (Backbone, sidebar_list_tpl, CollectionView, CompositeView, Model, Collection, Configuration, Article, KeywordsModel) {
	return Backbone.View.extend({
		initialize: function (options) {
			CompositeView.add(this);
			this.application = options.application;
			this.types = options.types;
			this.relatedcontent = options.relatedcontent;
			this.startclosed = options.startclosed;
			this.colour = options.colour;
			this.query = options.query;

			this.keywordsmodel = new KeywordsModel();

			if (options.collection) {
				this.collection = options.collection;
			} else {
				var self = this;
				self.application = options.application;
				self.collection = new Collection();
				self.collection.fetch({
					data: {
						language: Article.getLanguage(),
						types: this.types ? this.types.join(',') : undefined
					}
				}).done(function (data) {
					self.collection = new Collection(data);

					self.collection.map(function (link) {

						var startclosed = false;
						if (link.get('firsttype')) {
							startclosed = SC.Tools.getValue("sidebartype" + link.get('type')) != "F";
							//console.log("sidebartype"+link.get('type')+":"+startclosed);
						}

						link.set('typetext', Article.getBannerText(link.get('type')));
						link.set('nav', self.getNav(link.get('url')));
						link.set('href', Article.getHref(link.get('type'), link.get('url')));
						link.set('typeurl', Article.getTypeUrl(link.get('type')));
						link.set('startclosed', startclosed);

					});


					self.keywordsmodel.fetch({
						data: {
							language: Article.getLanguage()
						}
					}).done(function () { //Get the article keywords at this point.
						self.render();

					});



				});
			}
		},
		getNav: function (url) {
			if (url && url.toLowerCase().indexOf(".pdf") > -1) {
				return "ignore-click";
			}
		},
		events: {
			'click .accordion-grey': 'showAccordion',
			'keypress [data-type="article-input"]': 'submitOnEnter'
		},
		submitOnEnter: function (e) {
			if (e.keyCode === 13) {
				e.preventDefault(e);
				console.log(e.target.value);
				if (e.target.value && e.target.value.length > 1) {
					Backbone.history.navigate('articles/search/' + encodeURIComponent(e.target.value), {
						trigger: true
					});
				}
			}
		},
		showAccordion: function (e) {
			
			e.preventDefault();
			var $acc = $(e.target);

			if (!$acc.hasClass("accordion-grey")) {
				$acc = $acc.closest(".accordion-grey");
			}
			$acc.toggleClass("accordionactive");
			var type = $acc.attr("data-type");
			console.log("showAccordion "+type);
			if ($acc.hasClass("accordionactive")) {
				SC.Tools.setValue("sidebartype" + type, "F");
			} else {
				SC.Tools.setValue("sidebartype" + type, "T");
			}
			$acc = $acc.next();
			$acc.slideToggle();

		},
		childViews: {
			'Sidebar.Collection': function () {
				return new CollectionView({
					'childView': SidebarDetailsView,
					'collection': this.collection,
					'startclosed': this.startclosed
				});
			}
		},

		template: sidebar_list_tpl,

		getContext: function () { //Collate all the information together for the sidebar.

			var data;
			var index = -1;
			var keywords = [];
			
				do {
					index++;
					data = this.keywordsmodel.get(index);
					if (data) {
						keywords.push({
							name: data.name,
							type: data.type,
							url: "/articles/search/"+data.name
						});
					}
				} while (data);
			
			console.log(SC.Tools.getValue("sidebartypeKeywords"));
			return {
				relatedcontent: this.relatedcontent,
				collection: this.collection,
				query: this.query,
				keywords: keywords,
				'startkeywordsclosed': SC.Tools.getValue("sidebartypeKeywords")=="T"
			};
		}
	});
});