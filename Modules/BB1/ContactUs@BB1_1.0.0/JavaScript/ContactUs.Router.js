/*===========================================

  BB1 - G Truslove

  Date: Feb 2018

  ===========================================*/

define('ContactUs.Router', [
  'Backbone', 
  'ContactUs.Model', 
  'ContactUs.RequestCallback.Model', 
  /* 'ContactUs.RegisterB2B.Model',  */
  'ContactUs.View', 
  'ContactUs.ThankYou.View', 
  'ContactUs.RequestCallback.View', 
  'ContactUs.RequestCallback.ThankYou.View', 
  /* 'ContactUs.RegisterB2B.View',  */
  /* 'ContactUs.RegisterB2B.ThankYou.View' */
], function(
  Backbone, 
  Model, 
  RequestCallbackModel,
  /* RegisterB2BModel, */ 
  View, 
  ThankYouView, 
  RequestCallbackView, 
  RequestCallbackThankYouView, 
  /* RegisterB2BView, */
  /* RegisterB2BThankYouView */
) {
  'use strict';

  return Backbone.Router.extend({
    routes: {
      'contact-us': 'contactUs',
      'contact-us/thank-you': 'thankYou',
      'schedule-a-call/thank-you': 'requestCallbackThankYou',
      'schedule-a-call': 'requestCallback',
      // 'credit-account-application/thank-you': 'RegisterB2BThankYou',
      // 'credit-account-application': 'RegisterB2B',
      'bb1/translations': 'Translations'
      ,
      'bb1/scatranslations': 'SCATranslations'
    }

    ,
    initialize: function(application) {
      this.application = application;
    }
    ,
    CSVFormat:function(value){
if(value&&(value.indexOf(",")>-1||value.indexOf("\"")>-1)){
value="\""+value.split("\"").join("\\\"")+"\"";
}
return value;
    }
    ,
    SCATranslations: function(options) { //List all translations in the console
      if (SC.Translations) {
        var body = "From,To\r\n";
        for(var phrase in SC.Translations) {
          body += this.CSVFormat(phrase) + "," + this.CSVFormat(SC.Translations[phrase]) + "\r\n";
        }
        console.log(body);
      }
    },
    Translations: function(options) { //List all translations in the console
      if (SC.bb1_translations) {
        var body = "English,French\r\n";
        for(var phrase in SC.bb1_translations) {
          body += this.CSVFormat(phrase) + "," + this.CSVFormat(phrase) + "\r\n";
        }
        console.log(body);
      }
    },
    contactUs: function(options) {
      var view = new View({
        application: this.application,
        model: new Model()
      });

      view.showContent();
    },
    // RegisterB2BThankYou: function(options) {
    //   var view = new RegisterB2BThankYouView({
    //     application: this.application
    //   });

    //   view.showContent();
    // },
    // RegisterB2B: function(options) {
    //   var view = new RegisterB2BView({
    //     application: this.application,
    //     model: new RegisterB2BModel()
    //   });

    //   view.showContent();
    // },
    requestCallbackThankYou: function(options) {
      var view = new RequestCallbackThankYouView({
        application: this.application
      });

      view.showContent();
    },
    requestCallback: function(options) {
      var view = new RequestCallbackView({
        application: this.application,
        model: new RequestCallbackModel()
      });

      view.showContent();
    },
    thankYou: function(options) {
      var view = new ThankYouView({
        application: this.application
      });

      view.showContent();
    }
  });
});