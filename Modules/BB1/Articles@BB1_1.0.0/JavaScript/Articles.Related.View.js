/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ItemRelations
define('Articles.Related.View'
,	[	'Backbone.CollectionView'
	,	'ItemRelations.RelatedItem.View'
	,	'Articles.Related.Collection'
	,	'SC.Configuration'
	,	'Tracker'

	,	'articles_relations_related.tpl'
	,	'articles_relations_row.tpl'
	,	'articles_relations_cell.tpl'

	,	'jQuery'
	,	'Backbone'
	,	'underscore'
	,	'Utils'
	]
,	function (
		BackboneCollectionView
	,	ItemRelationsRelatedItemView
	,	ArticlesRelatedCollection
	,	Configuration
	,	Tracker

	,	articles_relations_related_tpl
	,	articles_relations_row_tpl
	,	articles_relations_cell_tpl

	,	jQuery
	,	Backbone
	,	_
	)
{
	'use strict';

	// @class ItemRelations.Related.View @extends Backbone.CollectionView
	return BackboneCollectionView.extend({

		initialize: function ()
		{
			var is_sca_advance = this.options.application.getConfig('siteSettings.sitetype') === 'ADVANCED'
			,	collection = is_sca_advance ? new ArticlesRelatedCollection({itemsIds: this.options.itemsIds}) : new Backbone.Collection()
			,	layout = this.options.application.getLayout()
			,	self = this;

			BackboneCollectionView.prototype.initialize.call(this, {
				collection: collection
			,	viewsPerRow: Infinity
			,	cellTemplate: articles_relations_cell_tpl
			,	rowTemplate: articles_relations_row_tpl
			,	childView: ItemRelationsRelatedItemView
			,	template: articles_relations_related_tpl
			});

			if (is_sca_advance)
			{
				layout.once('afterAppendView', self.loadRelatedItem, self);
				layout.currentView && layout.currentView.once('afterCompositeViewRender', self.loadRelatedItem, self);
			}
		}

	,	loadRelatedItem: function loadRelatedItem ()
		{
			var self = this;

			self.collection.fetchItems()
				.done(function ()
				{
					//Tracker.getInstance().trackProductList(self.collection, 'Related Items');
					self.render();

					var carousel = self.$el.find('[data-type="carousel-items"]');

					if(_.isPhoneDevice() === false && self.options.application.getConfig('siteSettings.imagesizes', false))
					{
						var img_min_height = _.where(self.options.application.getConfig('siteSettings.imagesizes', []), {name: self.options.application.getConfig('imageSizeMapping.thumbnail', '')})[0].maxheight;

						carousel.find('.item-relations-related-item-thumbnail').css('minHeight', img_min_height);
					}

					_.initBxSlider(carousel, Configuration.get('bxSliderDefaults', {}));
				});
		}

	,	destroy: function destroy ()
		{
			this._destroy();

			var	layout = this.options.application.getLayout();

			layout.off('afterAppendView', this.loadRelatedItems, this);
			layout.currentView && layout.currentView.off('afterCompositeViewRender', this.loadRelatedItems, this);
		}
	});
});
