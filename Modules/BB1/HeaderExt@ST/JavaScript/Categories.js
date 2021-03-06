/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Categories.js
// -------------
// Utility Class to handle the Categories tree
define('Categories', [
	'SC.Configuration', 'underscore'
], function(
	Configuration, _
) {
	'use strict';

	return {

		topLevelCategories: [],
		checkWebsiteSelection: function(categories) { //Check if this cat is allowed on this website.
			for (var i = categories.length - 1; i >= 0; i--) {
				if (!SC.Tools.showItem(categories[i].custrecord_bb1_website_se)) {
					categories.splice(i, 1);
				} else {
					if (categories[i].categories) {
						this.checkWebsiteSelection(categories[i].categories);
					}
				}

			}
		},
		makeNavigationTab: function(categories, adjustLevel) {

				this.checkWebsiteSelection(categories);

				adjustLevel = adjustLevel | 0;
				var result = [],
					self = this,
					change = false,
					swap;


				do { //Sort into alphabetic order
					change = false;
					for (var i = 0; i < categories.length - 1; i++) {
						if (categories[i].name > categories[i + 1].name) {
							change = true;
							swap = categories[i];
							categories[i] = categories[i + 1];
							categories[i + 1] = swap;
						}
					}
				} while (change);


				_.each(categories, function(category) {
					var href = category.fullurl
						,
						tab = {
							'href': href,
							'text': category.name,
							'data': {
								hashtag: '#' + href,
								touchpoint: 'home'
							},
							'class': 'header-menu-level' + (parseInt(category.level) + adjustLevel) + '-anchor',
							'data-type': 'commercecategory'
						};

					if (category.categories) {
						tab.categories = self.makeNavigationTab(category.categories, adjustLevel);
					}

					result.push(tab);
				});

				return result;
			}

			,
		addToNavigationTabs: function(categories) {
				if (Configuration.get('categories.addToNavigationTabs')) {

					var self = this,
						navigationData = Configuration.get('navigationData'),
						index = -1;


					for (var i = 0; i < navigationData.length; i++) {
						if (navigationData[i].id === 'CategoryParent') {
							index = i;

							break;
						}
					}

					if (index !== -1) {
						var tabs = self.makeNavigationTab(categories, 1);

						var topLevel = navigationData[index];
						topLevel.categories = [];


						_.each(tabs, function(tab, position) {
							topLevel.categories.push(tab);
						});
					}
					this.application.trigger('Configuration.navigationData');
				}
			}

			,
		getTopLevelCategoriesUrlComponent: function() {
				return this.topLevelCategories;
			}

			,
		mountToApp: function(application) {
			if (Configuration.get('categories')) {
				var self = this,
					categories = SC.CATEGORIES;
				//delete SC.CATEGORIES.categories;

				this.application = application;

				_.each(categories, function(category) {
					self.topLevelCategories.push(category.fullurl);
				});

				this.addToNavigationTabs(categories);
			}
		}
	};
});