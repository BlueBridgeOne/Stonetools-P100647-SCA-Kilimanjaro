// BB1.ContactManagement.js
// -----------------
// Defines the ContactManagement module. (Model, Views, Router)
// @module BB1.ContactManagement
define(
	'BB1.ContactManagement',
	[
  'BB1.ContactManagement.Router',
  'BB1.ContactManagement.PrimaryStatus.Model',
  'MenuTree.View',
  
  'SC.Configuration',

  'underscore',
  'Utils'
	],
	function (
  ContactManagementRouter,
  ContactManagementPrimaryStatusModel,
  MenuTreeView,
  
  Configuration,
  
  _
	)
{
	'use strict';

	var menu_items = function (application)
	{
  return null;
	};

 var contactManagementPromise = jQuery.Deferred();
 
	var ContactManagementModule = function() 
	{
		var mountToApp = function (application)
		{
			application.ContactManagementModule = ContactManagementModule;
			return new ContactManagementRouter(application);
		};

  var primaryContactStatus = new ContactManagementPrimaryStatusModel();
  
  contactManagementPromise = primaryContactStatus.fetch();
  
  contactManagementPromise.done(function(data) {
   if (data.isPrimaryContact) {
    var menu_tree = MenuTreeView.getInstance();

    menu_tree.addMenuItem(
     function (application)
     {
      return {
       id: 'user_management',
       name: _('Manage My Team').translate(),
       index: 10,
       permission: 'lists.listContacts.3',
       children: [
        {
         parent: 'user_management',
         id: 'user_management_list',
         name: _('View All My Team Members').translate(),
         url: 'user-management',
         index: 1
        },
        {
         parent: 'user_management',
         id: 'user_management_detail',
         name: _('Add A Team Member').translate(),
         url: 'user-management/new',
         index: 2
        }
       ]
      };
     }
    );

    menu_tree.updateMenuItemsUI();
   }

  });

		return {
			Router: ContactManagementRouter,
   mountToApp: mountToApp,
   MenuItems: menu_items
		};
	}();

 ContactManagementModule.contactManagementPromise = contactManagementPromise;
 
	return ContactManagementModule;
 
});