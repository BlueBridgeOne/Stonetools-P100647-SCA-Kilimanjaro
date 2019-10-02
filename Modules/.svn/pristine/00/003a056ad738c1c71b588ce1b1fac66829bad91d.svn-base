/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module GlobalViews
define(
	'Articles.Video.View'
,	[	'articles_video.tpl'

	,	'Backbone.CompositeView'

	,	'Backbone'
	,	'underscore'
	,	'Utils'
	]
,	function(
		articles_video_tpl

	,	BackboneCompositeView

	,	Backbone
	,	_
	,	Utils
	)
{
	'use strict';

	// @class GlobalViews.Confirmation.View @extends Backbone.View
	return Backbone.View.extend({

		template: articles_video_tpl

	,	title: _('Video').translate()

	,	page_header: _('Video').translate()
,	modalClass: 'global-views-modal-large'

		//@method initialize
		//@param {GlobalViews.Confirmation.Initialize.Options} options
		//@return {Void}
	,	initialize: function (options)
		{
			this.title = options.title || this.title;
			this.youtube=options.youtube;
			this.page_header = options.title || this.page_header;
			this.className = options.className || '';

			BackboneCompositeView.add(this);

this.once('afterViewRender', function ()
			{
				var self = this;
				self.$containerModal.on('shown.bs.modal', function ()
				{
					self.$containerModal.off('shown.bs.modal');
				});

			}, this);


			
		}


		// @method getTitle This method returns the name the current browser window will have.
		// This is called by Content.EnhancedViews
		// @return {String}
	,	getTitle: function getTitle ()
		{
			return Utils.translate('Video');
		}

		// @method getContext
		// @return {GlobalViews.Confirmation.View.Context}
	,	getContext: function getContext ()
		{
			// @class GlobalViews.Confirmation.View.Context
			return {
			youtube:this.youtube
			,height:parseInt(($(window).height()||800)*.75)
			};
			// @class GlobalViews.Confirmation.View
		}
	});
});
