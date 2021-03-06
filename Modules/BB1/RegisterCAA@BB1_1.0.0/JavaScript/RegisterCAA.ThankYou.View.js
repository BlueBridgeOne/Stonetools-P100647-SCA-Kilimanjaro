define('RegisterCAA.ThankYou.View'
, [
    'Backbone'
  , 'Backbone.CompositeView'
  , 'register_caa_thankyou.tpl'
  , 'jQuery'
  , 'underscore'
  ]
, function
  (
    Backbone
  , BackboneCompositeView
  , RegisterCAAThankYouTpl
  , jQuery
  , _
  )
{
  'use strict';

  return Backbone.View.extend({

 getBreadcrumbPages: function()
    {
      return [{
        text: _('Credit Account Application').translate()
      , href: '/credit-account-application'
      },{
        text: _('Thank You').translate()
      , href: '/credit-account-application/thank-you'
      }]
    }

    // The main use of this is to make this view a Backbone.FormView, so that we can use its functionality.
  , initialize: function(options)
    {
      this.options = options;
      this.application = options.application;

      BackboneCompositeView.add(this);
    }

    // Quite simply, the template we want to use.
  , template: RegisterCAAThankYouTpl

    // Set the page title
  ,
        getTitle: function() {
          return SC.Tools.getTitle("Thank You");
        },
        getMetaDescription: function() {
            return "Thanks for contacting us. Your request for a trade account has been received. We will review your details get back to you shorty.";
          }
          ,
        
        getAddToHead: function() {
          return SC.Tools.getSEO({ title:"Thank You", summary: this.getMetaDescription()});
        }
  });
});