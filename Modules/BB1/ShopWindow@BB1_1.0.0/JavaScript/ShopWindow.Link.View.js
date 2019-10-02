/*===========================================

  BB1 - G Truslove

  Date: Feb 2018

  ===========================================*/

define('ShopWindow.Link.View', [
  'Backbone', 'Backbone.CompositeView', 'shopwindow_link.tpl', 'jQuery', 'underscore', 'SC.Configuration'
], function(
  Backbone, BackboneCompositeView, shopwindowLinkTpl, jQuery, _, Configuration
) {
  'use strict';

  return Backbone.View.extend({

    initialize: function(options) {

        BackboneCompositeView.add(this);
      }
      ,
    template: shopwindowLinkTpl,
    getContext: function() {
      return {  };
    }
  });
});