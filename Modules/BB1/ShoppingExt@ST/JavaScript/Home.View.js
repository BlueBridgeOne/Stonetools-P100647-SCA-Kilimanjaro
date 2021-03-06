/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Home
define(
	'Home.View', [
		'SC.Configuration', 'Utilities.ResizeImage'

		, 'home.tpl', 'Articles.Collection', 'Backbone', 'jQuery', 'underscore', 'Utils', 'Articles.Home.View', 'Article', 'Tools'
	],
	function(
		Configuration

		, resizeImage, home_tpl, Collection, Backbone, jQuery, _, Utils, ArticlesHomeView, Article, Tools
	) {
		'use strict';

		//@module Home.View @extends Backbone.View
		return Backbone.View.extend({

			template: home_tpl

				,
			getTitle: function() {
				return SC.Tools.getName();
			},
			getCanonical: function() {
				return Article.getHref("/");
			},
			getMetaDescription: function() {
					return "Shop CNC tools, diamond blades, glues, chemicals and polishing abrasives for stone, quartz and Dekton. Find all the information and guidance you need.";
				}
				,
			getMetaKeywords: function() {
				return "Stone,Tools";
			},
			getAddToHead: function() {
					return SC.Tools.getSEO({ title: "Welcome", summary: "Shop CNC tools, diamond blades, glues, chemicals and polishing abrasives for stone, quartz and Dekton. Find all the information and guidance you need.", image: Configuration.get('header.logoUrl') });
				}

				,
			attributes: {
				'id': 'home-page',
				'class': 'home-page'
			}
			,
			childViews: {
				'Articles': function() {

					var collection = new Collection();
					var view = new ArticlesHomeView({
						collection: collection,
						application: this.application
					});
					collection.fetch({
						data: {
							type: 0,
							language: Article.getLanguage(),
							showonhomepage:true,
							site:SC.Tools.getSiteCountry()
						}
					}).done(function() {
						view.render();
					});

					return view;
				}
			},
			initialize: function() {
				

				}

				// @method getContext @return Home.View.Context
				,
			getContext: function() {
				

				return {
				};
			}

		});



	});