// BB1.ContactManagement.Details.View.js
// -----------------------
// Views for Contact Management details.
// @module BB1.ContactManagement
define(
	'BB1.ContactManagement.Details.View',
	[
		'SC.Configuration',
		'Profile.Model',
		'Backbone.FormView',

		'contact_management_details.tpl',

		'jQuery',
		'Backbone',
		'underscore'
	],
	function (
		Configuration,
		ProfileModel,
		BackboneFormView,

		contact_management_details_tpl,

		jQuery,
		Backbone,
		_
	)
{
	'use strict';

	// @class BB1.ContactManagement.Details.View @extends Backbone.View
	return Backbone.View.extend({
  
		template: contact_management_details_tpl,

		title: _('Contact').translate(),

  page_header: _('Contact').translate(),

  attributes: {
   'class': 'contact-management-detail-page'
  },

  menuItem: 'user_management_detail',
  
  events: {
   'submit form': 'saveForm',
   'click [data-action="reset"]': 'resetForm'
  },

		initialize: function (options)
		{
			this.options = options;
			this.application = options.application;
   
			BackboneFormView.add(this);
		},

		//@method getSelectedMenu
		getSelectedMenu: function ()
		{
			return 'user_management_detail';
		},
  
		//@method getBreadcrumbPages
		getBreadcrumbPages: function ()
		{
			return [
				{
					text: _('Manage My Team').translate(),
					href: '/user-management'
				},
				{
					text: _('Contact: #$(0)').translate(this.model.get('internalid')),
					href: '/user-management/' + this.model.get('internalid')
				}
			];
		},

  resetForm: function (e)
  {
   e.preventDefault();
   this.showContent();
  },
  
		// @method getContext @return BB1.ContactManagement.Details.View.Context
		getContext: function ()
		{
			var options = this.options || {},
							model = this.model,
							manage = options.manage ? options.manage + '-' : '';
			
			//@class Address.List.View.Context
			return {
				//@property {String} pageHeader
				pageHeader: this.page_header,
				//@property {Backbone.Model} model
				model: model,
				//@property {String} manage
				manage: manage,
				//@property {Boolean} inModal
				isInModal: this.inModal,
				//@property {Boolean} hasLoginAccess
				hasLoginAccess: model.get("loginaccess") == "T"
			};
		}
  
	});
});