define('RegisterCAA.View', [
  'Backbone',
  'register_caa.tpl',
  'underscore',
  'SC.Configuration',
  'RegisterCAA.Form.LC.View',
  'RegisterCAA.Form.LC.Model',
  'RegisterCAA.Form.ST.View',
  'RegisterCAA.Form.ST.Model'
], function (
  Backbone,
  RegisterCAATpl,
  _, 
  Configuration,
  FormLCView,
  FormLCModel,
  FormSTView,
  FormSTModel
) {
  'use strict';

  return Backbone.View.extend({

    attributes: {
      'class': 'contactus'
    },

    events: {
      'click .accordion-grey': 'showAccordion',
    },

    getBreadcrumbPages: function () {
      return [{
        text: _('Register CAA Application').translate(),
        href: '/revistercaa-application'
      }]
    },

    initialize: function (options) {
      this.childViewFormLC = new FormLCView({
        application: options.application,
        model: new FormLCModel()
      });
      this.childViewFormST = new FormSTView({
        application: options.application,
        model: new FormSTModel()
      });

      _.bindAll(this, 'beforeRender', 'render', 'afterRender'); 
      var _this = this; 
      this.render = _.wrap(this.render, function(render) { 
          _this.beforeRender(); 
          render(); 
          _this.afterRender(); 
          return _this; 
      }); 
    },

    template: RegisterCAATpl,

    getTitle: function () {
      return SC.Tools.getTitle("Register CAA Application");
    },

    getMetaDescription: function () {
      return "Use this Form to apply for a credit account.";
    },

    getAddToHead: function () {
      return SC.Tools.getSEO({
        title: "Register CAA Application",
        summary: this.getMetaDescription()
      });
    },

    showAccordion: function (e) {
      e.preventDefault();
      var $acc = $(e.currentTarget);

      $('.accordion-grey').not($acc).each(function(){
        $(this).removeClass('accordionactive')
        $(this).next().hide();
      });

      if($acc.hasClass('accordionactive')){
        $acc.removeClass('accordionactive')
        $acc.next().hide();
      }else{
        $acc.addClass('accordionactive')
        $acc.next().show();
      }
    },

    beforeRender: function() { 
      //do summat
    }, 

    render: function () {
      this.$el.html(this.template());
      this.$el.find('.contactus-lc-accordion').append(this.childViewFormLC.render().el);
      this.$el.find('.contactus-st-accordion').append(this.childViewFormST.render().el);
    },

    afterRender: function() { 
      this.$el.find('.soletraderaddress_state select').attr('name', 'soletraderaddress_state');
      this.$el.find('.soletraderaddress_countries select').attr('name', 'soletraderaddress_countries');
    }, 

  });
});