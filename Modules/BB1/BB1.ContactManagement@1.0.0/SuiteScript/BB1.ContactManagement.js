// BB1.ContactManagement.js
// ----------
define(
	'BB1.ContactManagement',
	['Application',
  'Configuration',
		'Utils',
		'Models.Init',

		'underscore'
	]
,	function (
		Application,
  Configuration,
		Utils,
  ModelsInit,

 	_
	)
{
	'use strict';

 Application.on('after:Account.register', function(model, result, data) {

  var webSiteDomain = /^https?:\/\/([^\/]+)\//i.exec(ModelsInit.session.getAbsoluteUrl2('shopping', '/'));
  
  webSiteDomain = webSiteDomain.length > 1 ? webSiteDomain[1] : '';
  
  ModelsInit.customer.updateProfile({
   customfields: {
    custentity_bb1_sca_registereddomain: webSiteDomain
   }
  });

  /*try {
   ModelsInit.session.logout();

   ModelsInit.session.login({
    email: data.email,
    password: data.password
   });  
  }
  catch (e) {
   console.log('Error occurred trying to refresh login after registration', e && e.getCode ? e.getCode() + ': ' + e.getDetails() : e);
  }*/

 });

});