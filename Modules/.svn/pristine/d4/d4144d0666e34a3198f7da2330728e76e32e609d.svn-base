// BB1.ContactManagement.Collection.js
// -----------------------
// BB1.ContactManagement collection
// @module BB1.ContactManagement
define(
	'BB1.ContactManagement.Collection',
	[
  'BB1.ContactManagement.Model',
  
		'Backbone',
		'underscore',
		'Utils'
	],
	function (
  ContactManagementModel,
  
		Backbone,
		_
	)
{
	'use strict';
	// @class BB1.ContactManagement.Collection Collection for handling Contact Management (CRUD) @extends Backbone.Collection

 return Backbone.Collection.extend(
 {
  
  url: '/app/site/hosting/scriptlet.nl?script=240&deploy=1&compid=4554490&h=706ae3304ddf43ca6ef0&action=contacts',

  model: ContactManagementModel,

  initialize: function ()
  {
   this.once('sync reset', function ()
   {
    if (!this.original)
    {
     this.original = this.clone();
    }
   });
  },

  parse: function (response)
  {
   this.totalRecordsFound = response.totalRecordsFound;
   this.recordsPerPage = response.recordsPerPage;

   return response.users;
  },

  update: function (options)
  {
   var filter = options.filter || {},
       sort = options.sort || {};

   this.fetch({
    data: {
     filter: filter.value,
     sort: sort.value,
     order: options.order,
     page: options.page
    },
    reset: true,
    killerId: options.killerId
   });
  }
  
 });

});