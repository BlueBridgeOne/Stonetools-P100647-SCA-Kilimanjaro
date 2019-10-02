/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/


define(
	'ToolLists.Email.View'
,	[	'toollists_email_view.tpl'

	,	'Backbone.CompositeView'

	,	'Backbone'
	,	'underscore'
	,	'Utils'
	]
,	function(
		toollists_email_view_tpl

	,	BackboneCompositeView

	,	Backbone
	,	_
	,	Utils
	)
{
	'use strict';

	// @class @extends Backbone.View
	return Backbone.View.extend({

		template: toollists_email_view_tpl

	,	title: _('Send Tool List Via Email').translate()

	,	page_header: _('Send Tool List Via Email').translate()

	,	events: {
			'click [data-action="confirm"]' : 'confirm'
		,	'click [data-action="cancel"]' : 'cancel'
		}

		//@method initialize
		//@param {GlobalViews.Confirmation.Initialize.Options} options
		//@return {Void}
	,	initialize: function (options)
		{
			this.callBack = options.callBack;
			this.callBackParameters = options.callBackParameters;

			this.cancelCallBack = options.cancelCallBack;
			this.cancelCallBackParameters = options.cancelCallBackParameters;

			this.title = options.title || this.title;
			this.page_header = options.title || this.page_header;
			
			BackboneCompositeView.add(this);

			this.once('afterViewRender', function ()
			{
				var self = this;
				self.$containerModal.on('shown.bs.modal', function ()
				{
					self.$containerModal.off('shown.bs.modal');
					self.$('input').focus();
				});

			}, this);
		}

		// @method confirm Invokes callBack function
		// @return {Void}
	,	confirm: function confirm ()
		{
		this.callBackParameters.email_value=this.$el.find("input").val();

			_.isFunction(this.callBack) && this.callBack.call(this, this.callBackParameters);

				this.$containerModal.modal('hide');
			
		}

		// @method cancel Invokes cancelCallBack function
		// @return {Void}
	,	cancel: function cancel ()
		{
			_.isFunction(this.cancelCallBack) && this.cancelCallBack.call(this, this.cancelCallBackParameters);

				this.$containerModal.modal('hide');
			
		}

		// @method getTitle This method returns the name the current browser window will have.
		// This is called by Content.EnhancedViews
		// @return {String}
	,	getTitle: function getTitle ()
		{
			return Utils.translate('Send Tool List Via Email');
		}

		// @method getContext
		// @return {GlobalViews.Confirmation.View.Context}
	,	getContext: function getContext ()
		{
			// @class GlobalViews.Confirmation.View.Context
			return {
				
			};
			// @class GlobalViews.Confirmation.View
		}
	});
});
