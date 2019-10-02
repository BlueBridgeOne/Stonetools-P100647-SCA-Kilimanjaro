/*===========================================

  BB1 - G Truslove

  Date: Feb 2018

  ===========================================*/

define('ContactUs.RequestCallback.ThankYou.View'
, [
    'Backbone'
  , 'Backbone.CompositeView'
  , 'request_callback_thankyou.tpl'
  , 'jQuery'
  , 'underscore'
  ]
, function
  (
    Backbone
  , BackboneCompositeView
  , requestCallbackThankYouTpl
  , jQuery
  , _
  )
{
  'use strict';

  return Backbone.View.extend({

 getBreadcrumbPages: function()
    {
      return [{
        text: _('Schedule a Call').translate()
      , href: '/schedule-a-call'
      },{
        text: _('Thank You').translate()
      , href: '/schedule-a-call/thank-you'
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
  , template: requestCallbackThankYouTpl

    // Set the page title
  ,
        getTitle: function() {
          return SC.Tools.getTitle("Thank You");
        },
        getMetaDescription: function() {
            return "Thank you for cantacting us. We'll get back to you as soon as possible.";
          }
          ,
        
        getAddToHead: function() {
          return SC.Tools.getSEO({ title:"Thank You", summary: this.getMetaDescription()});
        }
  });
});