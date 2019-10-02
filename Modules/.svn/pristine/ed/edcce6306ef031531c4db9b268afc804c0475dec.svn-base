define('RegisterCAA.Router', [
  'Backbone',
  'RegisterCAA.View',
  'RegisterCAA.ThankYou.View'
], function (
  Backbone,
  RegisterCAAView,
  RegisterCAAThankYouView
) {
  'use strict';

  return Backbone.Router.extend({
    routes: {
      'credit-account-application/thank-you': 'RegisterCAAThankYou',
      'credit-account-application': 'RegisterCAA'
    },

    initialize: function (application) {
      this.application = application;
    },

    RegisterCAAThankYou: function (options) {
      var view = new RegisterCAAThankYouView({
        application: this.application
      });

      view.showContent();
    },
    
    RegisterCAA: function (options) {
      var view = new RegisterCAAView({
        application: this.application,
      });
      
      view.showContent();
    }

  });
});