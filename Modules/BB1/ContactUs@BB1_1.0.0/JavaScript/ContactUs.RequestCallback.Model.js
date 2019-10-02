/*===========================================

  BB1 - G Truslove

  Date: Feb 2018

  ===========================================*/

define('ContactUs.RequestCallback.Model', [
  'Backbone', 'underscore', 'Utils'
], function(
  Backbone, _, Utils
) {
  'use strict';

  return Backbone.Model.extend({
    urlRoot: Utils.getAbsoluteUrl('services/ContactUs.Service.ss')

      ,
    validation: {
      firstname: {
        required: true,
        msg: 'Please enter a first name'
      },
      lastname: {
        required: true,
        msg: 'Please enter a last name'
      },
      email: [{
        required: true,
        msg: 'Please enter an email address'
      }, {
        pattern: 'email',
        msg: 'Please enter a valid email address'
      }],
      phone: [{
        required: true,
        msg: 'Please enter a phone number'
      }],
      time: {
      fn: SC.Tools.validateTime,
        required: true
      },
      host: {},
      type: {},
      comoany:{}
    }
  
  });
});