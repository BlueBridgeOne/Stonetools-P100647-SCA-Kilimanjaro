/*===========================================

  BB1 - G Truslove

  Date: Feb 2018

  ===========================================*/

define('ContactUs.RegisterB2B.Model', [
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
      company: {
        required: true,
        msg: 'Please enter a company name'
      },
      email: [{
        required: true,
        msg: 'Please enter an email address'
      }, {
        pattern: 'email',
        msg: 'Please enter a valid email address'
      }],
      phone: {
        required: true,
        msg: 'Please enter a phone number'
      },
      addr1: {
        required: true,
        msg: 'Please enter an address'
      },
      city: {
        
        msg: 'Please enter a city'
      },
       state: {
        
        msg: 'Please enter a state'
      },
       zip: {
        required: true,
        msg: 'Please enter a postcode'
      },
       country: {
        required: true,
        msg: 'Please enter a country'
      },
      host: {},
      type: {}
    }
  
  });
});