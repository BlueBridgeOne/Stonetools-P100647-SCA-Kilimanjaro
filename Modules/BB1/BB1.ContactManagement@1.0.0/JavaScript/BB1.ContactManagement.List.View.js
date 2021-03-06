// BB1.ContactManagement.List.View.js
// -----------------------
// Views for viewing Contact list.
// @module BB1.ContactManagement
define(
	'BB1.ContactManagement.List.View',
	[
  'BB1.ContactManagement.List.Actions.View',
		'ListHeader.View',
		'SC.Configuration',
		'GlobalViews.Pagination.View',
		'GlobalViews.ShowingCurrent.View',
		'RecordViews.Actionable.View',

		'contact_management_list.tpl',

		'Backbone',
		'Backbone.CompositeView',
		'Backbone.CollectionView',
		'underscore',
		'jQuery',
		'Utils'
	],
	function (
  ContactManagementListActionsView,
		ListHeaderView,
		Configuration,
		GlobalViewsPaginationView,
		GlobalViewsShowingCurrentView,
		RecordViewsActionableView,

		contact_management_list_tpl,

		Backbone,
		BackboneCompositeView,
		BackboneCollectionView,
		_,
		jQuery
	)
{
	'use strict';

	// @class BB1.ContactManagement.List.View @extends Backbone.View
	return Backbone.View.extend({

		template: contact_management_list_tpl,

		title: _('Manage My Team').translate(),

		page_header: _('Manage My Team').translate(),

  menuItem: 'user_management_list',
  
		attributes: {
			'class': 'user-management-list'
		},

		initialize: function (options)
		{
			this.options = options;
			this.application = options.application;
			this.listenCollection();
			this.setupListHeader();

			this.options.showCurrentPage = true;

			BackboneCompositeView.add(this);
		},

		setupListHeader: function()
		{
			this.listHeader = new ListHeaderView({
				view: this,
				application: this.application,
				collection: this.collection,
				filters: this.initialiseFilterOptions(),
				sorts: this.sortOptions,
				hidePagination: false
			});
		},

  listenCollection: function ()
  {
   this.setLoading(true);

   this.collection.on({
    request: jQuery.proxy(this, 'setLoading', true),
    reset: jQuery.proxy(this, 'setLoading', false)
   });
  },

  setLoading: function (is_loading)
  {
   this.isLoading = is_loading;
  },

  initialiseFilterOptions: function() 
  {
   return null;
  },
  
  sortOptions: null,

		//@method getSelectedMenu
		getSelectedMenu: function ()
		{
			return 'user_management_list';
		},
  
		//@method getBreadcrumbPages
		getBreadcrumbPages: function ()
		{
			return {
				text: this.title,
				href: '/user-management'
			};
		},

		childViews: {
   
			'ContactManagement.List': function ()
			{
    var self = this,
        records_collection = new Backbone.Collection(this.collection.map(function (current_contact)
				{
					return new Backbone.Model({
						touchpoint: 'customercenter',

						title: current_contact.get('name'),
      
						detailsURL: '#/user-management/' + current_contact.get('internalid'),
      
						internalid: current_contact.get('internalid'),
      
						columns: [
							{
								label: _('Job Title:').translate(),
								type: 'jobtitle',
								name: 'jobtitle',
								value: current_contact.get('jobtitle')
							},
							{
								label: _('Email:').translate(),
								type: 'email',
								name: 'email',
								value: current_contact.get('email')
							},
       {
								label: _('Login Access:').translate(),
								type: 'loginaccess',
								name: 'loginaccess',
								value: current_contact.get('loginaccess_text')
							}
						]
					});
				}));

				return new BackboneCollectionView({
					childView: RecordViewsActionableView,
					collection: records_collection,
					viewsPerRow: 1,
     childViewOptions: {
						actionView: ContactManagementListActionsView,
					 actionOptions: {
							application: self.application,
       view: self
						}
					}
				});
			},
   
			'GlobalViews.Pagination': function()
			{
				return new GlobalViewsPaginationView(_.extend({
					totalPages: Math.ceil(this.collection.totalRecordsFound / this.collection.recordsPerPage)
				}, Configuration.defaultPaginationSettings));
			},
   
			'GlobalViews.ShowCurrentPage': function()
			{
				return new GlobalViewsShowingCurrentView({
					items_per_page: this.collection.recordsPerPage,
		 		total_items: this.collection.totalRecordsFound,
					total_pages: Math.ceil(this.collection.totalRecordsFound / this.collection.recordsPerPage)
				});
			},
   
			'List.Header': function ()
			{
				return this.listHeader;
			}
   
		},

		// @method getContext @return BB1.ContactManagement.List.View.Context
		getContext: function()
		{
			// @class BB1.ContactManagement.List.View.Context
			return {
				// @property {String} pageHeader
				pageHeader: this.page_header,
				// @property {Boolean} hasContacts
				hasContacts: this.collection.length,
				// @property {Boolean} isLoading
				isLoading: this.isLoading,
				// @property {Boolean} showPagination
				showPagination: !!(this.collection.totalRecordsFound && this.collection.recordsPerPage),
				// @property {Boolean} showCurrentPage
				showCurrentPage: this.options.showCurrentPage,
				//@property {Boolean} showBackToAccount
				showBackToAccount: Configuration.get('siteSettings.sitetype') === 'STANDARD'
			};
		}
  
	});
});
