//@module BB1.ContactManagement
define('BB1.ContactManagement.List.Actions.View',
[
		'BB1.ContactManagement.Model',
		'AjaxRequestsKiller',
  'GlobalViews.Message.View',

 'contact_management_list_actions.tpl',
 
 'Backbone',
 'underscore'
	]
,	function (
		ContactManagementModel,
		AjaxRequestsKiller,
  GlobalViewsMessageView,
	
		contact_management_list_actions_tpl,

	 Backbone,
	 _
	)
{
	'use strict';

	//@class BB1.ContactManagement.List.Actions.View @extend Backbone.View
	return Backbone.View.extend({

		//@property {Function} template
		template: contact_management_list_actions_tpl,

		//@property {Object} events
		events: {
			'click [data-action="edit-user"]': 'editContact',
			'click [data-action="delete-user"]': 'deleteContact'
		},
  
		//@method initialize
		initialize: function (options)
		{
   this.application = options.application;
		},
  
		//@method editContact
		editContact: function (e)
		{
   var contactId = jQuery(e.target).closest('[data-id]').data('id');
			Backbone.history.navigate('user-management/' + contactId, {trigger: true});
		},
  
		//@method deleteContact
		deleteContact: function (e)
		{
   var contactId = jQuery(e.target).closest('[data-id]').data('id');
   // delete model
   
   var view = this.options.view,
       model = view.collection.get(contactId);

   model.destroy().done(function () {
    var message = _('Contact has been deleted.').translate(),
        messageView = new GlobalViewsMessageView({message: message, closable: true, type: "success"});
    messageView.render();
    view.showContent();
    view.$('[data-confirm-message]').empty().append(messageView.$el);
   });
		}
	});

});