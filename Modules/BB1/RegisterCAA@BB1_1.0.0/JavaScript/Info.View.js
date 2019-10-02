define('Info.View', [
  'Backbone', 
  'Backbone.CompositeView', 
  'info.tpl', 
  'jQuery', 
  'underscore', 
  'SC.Configuration'
], function(
  Backbone, 
  BackboneCompositeView, 
  InfoTpl, 
  jQuery, 
  _, 
  Configuration
) {
  'use strict';

  return Backbone.View.extend({

    initialize: function(options) {
      BackboneCompositeView.add(this);
    },

    template: InfoTpl,

    getContext: function() {
      var companies = Configuration.get("contactUs.companies");
      var use=[];
      for (var i = 0; i < companies.length; i++) {
      if(companies[i].sitecode==SC.Tools.getSiteCode()){
        if (companies[i].address) {
          companies[i].address_formatted = companies[i].address.split(',').join('<br />');
        }
        use.push(companies[i]);
        }
      }
      return { companies: use };
    }
  });
});