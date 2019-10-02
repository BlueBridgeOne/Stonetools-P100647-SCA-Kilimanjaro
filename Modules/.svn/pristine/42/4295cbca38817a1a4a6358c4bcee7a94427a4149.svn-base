// BB1.ContactManagement.Model.js
// -----------------------
// BB1.ContactManagement model
// @module BB1.ContactManagement
define(
	'BB1.ContactManagement.Model',
	[
		'Backbone',
		'underscore',
		'Utils'
	],
	function (
		Backbone,
		_
	)
{
	'use strict';
	// @class BB1.ContactManagement.Model Model for handling Contact Management (CRUD) @extends Backbone.Model

 return Backbone.Model.extend(
 {
  
  urlRoot: '/app/site/hosting/scriptlet.nl?script=240&deploy=1&compid=4554490&h=706ae3304ddf43ca6ef0&action=contacts',
  
  validation: {
   firstname: { required: true, msg: _('First Name is required').translate() },
   lastname: { required: true, msg: _('Last Name is required').translate() },
   email: { required: true, pattern: 'email', msg: _('Email is required').translate() }
  }

 });

});