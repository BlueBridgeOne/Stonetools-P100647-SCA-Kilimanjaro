define('RegisterCAA.Form.LC.Model', [
    'Backbone', 
    'underscore', 
    'Utils'
  ], function(
    Backbone, 
    _, 
    Utils
  ) {
    'use strict';
  
    return Backbone.Model.extend({
      urlRoot: Utils.getAbsoluteUrl('services/RegisterCAA.Service.ss'),
      validation: {

        company: {
          required: true,
          msg: 'Please enter a company name'
        },

        primaryaddress_addr1: {
          required: true,
          msg: 'Please enter the first line of your address'
        },
        primaryaddress_city: {
          required: true,
          msg: 'Please enter a city'
        },
        primaryaddress_zip: {
          required: true,
          msg: 'Please enter a zip / postcode'
        },

        registrationnumber: {
          required: true,
          msg: 'Please enter a company registration number',
          pattern: 'number'
        },
        vatnumber: {
          required: true,
          msg: 'Please enter a VAT number',
          pattern: 'number'
        },

        phone: [{
          required: true,
          msg: 'Please enter a telephone number'
        }, {
          pattern: 'number',
          min: 10,
          msg: 'Please enter a valid number'
        }],

        generalemailaddress: [{
          required: true,
          msg: 'Please enter an email address'
        }, {
          pattern: 'email',
          msg: 'Please enter a valid email address'
        }],

        companywebsite: [{
          required: false,
          msg: 'Please enter a website address'
        },{
          pattern: 'url',
          msg: 'Please enter a valid website url'
        }],


        billingaddress_addr1: {
          required: function(val, attr, computed) {
            return (computed.billingaddress_checkbox) ? true : false
          },
          msg: 'Please enter the first line of your address'
        },
        billingaddress_city: {
          required: function(val, attr, computed) {
            return (computed.billingaddress_checkbox) ? true : false
          },
          msg: 'Please enter a city'
        },
        billingaddress_zip: {
          required: function(val, attr, computed) {
            return (computed.billingaddress_checkbox) ? true : false
          },
          msg: 'Please enter a zip / postcode'
        },


        shippingaddress_addr1: {
          required: function(val, attr, computed) {
            return (computed.shippingaddress_checkbox) ? true : false
          },
          msg: 'Please enter the first line of your address'
        },
        shippingaddress_city: {
          required: function(val, attr, computed) {
            return (computed.shippingaddress_checkbox) ? true : false
          },
          msg: 'Please enter a city'
        },
        shippingaddress_zip: {
          required: function(val, attr, computed) {
            return (computed.shippingaddress_checkbox) ? true : false
          },
          msg: 'Please enter a zip / postcode'
        },


        director_firstname: {
          required: true,
          msg: 'Please enter a firstname'
        },
        director_lastname: {
          required: true,
          msg: 'Please enter a last name'
        },


        authorisedpurchasers_firstname: {
          required: true,
          msg: 'Please enter a first name'
        },
        authorisedpurchasers_lastname: {
          required: true,
          msg: 'Please enter a last name'
        },
        authorisedpurchasers_email: [{
          required: true,
          msg: 'Please enter an email address'
        }, {
          pattern: 'email',
          msg: 'Please enter a valid email address'
        }],


        arcd_firstname: {
          required: true,
          msg: 'Please enter a first name'
        },
        arcd_lastname: {
          required: true,
          msg: 'Please enter a last name'
        },
        arcd_phone: [{
          required: true,
          msg: 'Please enter a telephone number'
        }, {
          pattern: 'number',
          min: 10,
          msg: 'Please enter a valid number'
        }],
        arcd_email: [{
          required: true,
          msg: 'Please enter an email address'
        }, {
          pattern: 'email',
          msg: 'Please enter a valid email address'
        }],


        tr_businessname: {
          required: true,
          msg: 'Please enter a business name'
        },
        tr_firstname: {
          required: true,
          msg: 'Please enter a first name'
        },
        tr_lastname: {
          required: true,
          msg: 'Please enter a last name'
        },
        // tr_phone: [{
        //   required: true,
        //   msg: 'Please enter a telephone number'
        // }, {
        //   pattern: 'number',
        //   min: 10,
        //   msg: 'Please enter a valid number'
        // }],


        requested_credit: {
          required: true,
          msg: 'Please enter a numerical amount',
          pattern: 'number'
        },


        confirmation_firstname: {
          required: true,
          msg: 'Please enter a first name'
        },
        confirmation_lastname: {
          required: true,
          msg: 'Please enter a last name'
        },
        confirmation_title: {
          required: true,
          msg: 'Please enter a title'
        },
        confirmation_email: [{
          required: true,
          msg: 'Please enter an email address'
        }, {
          pattern: 'email',
          msg: 'Please enter a valid email address'
        }],
        confirmation_date: {
          required: true,
          msg: 'Please enter a valid date'
        },

        // company_director: {
        //   // fn: 'validateName'
        //   required: true,
        //   msg: 'Please enter a firstname'
        // },

        host: {},
        type: {}

      },

      validateName: function(value, attr, computedState) {
        console.log(value, attr, computedState)
        if(value !== 'something') {
          return 'Name is invalid';
        }
      }
    
    });
  });