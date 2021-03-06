// BB1.ContactManagement.Router.js
// -----------------------
// Router for handling Contact Management
// @module BB1.ContactManagement
define(
	'BB1.ContactManagement.Router',
	[
		'BB1.ContactManagement.Model',
		'BB1.ContactManagement.Collection',
		'BB1.ContactManagement.Details.View',
		'BB1.ContactManagement.List.View',
		'AjaxRequestsKiller',
  'GlobalViews.Message.View',

		'Backbone',
		'underscore',
		'jQuery',
		'Utils',
	],
	function (
		ContactManagementModel,
		ContactManagementCollection,
		ContactManagementDetailsView,
		ContactManagementListView,
		AjaxRequestsKiller,
  GlobalViewsMessageView,
	
		Backbone,
		_,
		jQuery
	)
{
	'use strict';

	// @class BB1.ContactManagement.Router @extends Backbone.Router
	return Backbone.Router.extend({

  routes: 
  {
   'user-management': 'showContactList',
   'user-management?:options': 'showContactList',
   'user-management/new': 'showContactNew',
   'user-management/:id': 'showContactDetail'
  },

  initialize: function (application)
  {
   this.application = application;
  },

  showContactNew: function (options)
  {
   var self = this,
       model = new ContactManagementModel(),
       view = new ContactManagementDetailsView({
        application: this.application,
        params: _.parseUrlOptions(options),
        model: model
       });

   view.model.on('reset destroy change add', function () {
    self.application.getLayout().once('afterAppendView', function (view) {
     var message = _('Your contacts have been updated.').translate(),
         messageView = new GlobalViewsMessageView({message: message, closable: true, type: "success"});
     messageView.render();
     view.$('[data-confirm-message]').empty().append(messageView.$el);
    });
    if (self.inModal && self.$containerModal)
    {
     self.$containerModal.modal('hide');
     self.destroy();
    }
    Backbone.history.navigate('user-management', {trigger: true});
   }, view);
   view.showContent();
  },

  showContactDetail: function (id, options)
  {
   var self = this,
       model = new ContactManagementModel(),
       view = new ContactManagementDetailsView({
        application: this.application,
        params: _.parseUrlOptions(options),
        model: model
       });

   model.fetch({
    data: {
     contact_id: id
    },
    killerId: AjaxRequestsKiller.getKillerId(),
    success: function () {
     view.model.on('reset destroy change add', function () {
      self.application.getLayout().once('afterAppendView', function (view) {
       var message = _('Your contacts have been updated.').translate(),
           messageView = new GlobalViewsMessageView({message: message, closable: true, type: "success"});
       messageView.render();
       view.$('[data-confirm-message]').empty().append(messageView.$el);
      });
      if (self.inModal && self.$containerModal)
      {
       self.$containerModal.modal('hide');
       self.destroy();
      }
      Backbone.history.navigate('user-management', {trigger: true});
     }, view);
     view.showContent();
    }
   });
  },

  showContactList: function (options)
  {
   var parsedOptions = _.parseUrlOptions(options),
       collection = new ContactManagementCollection(),
       view = new ContactManagementListView({
        application: this.application,
        collection: collection,
        options: parsedOptions,
        page: parsedOptions && parsedOptions.page
       });
   
   view.collection.on('reset', view.render, view);
   view.showContent();
  }

	});
});
