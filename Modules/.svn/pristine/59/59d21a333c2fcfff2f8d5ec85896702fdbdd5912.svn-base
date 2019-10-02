/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ItemRelations
define('Articles.Related.Collection'
,	[	'SC.Configuration'
	,	'Item.Collection'

	,	'underscore'
	,	'Utils'
	]
,	function (
		Configuration
	,	ItemCollection

	,	_
	)
{
	'use strict';


	//@class Articles.Related.Collection @extends Item.Collection
	return ItemCollection.extend({

		initialize: function (options)
		{
   // console.log(Configuration.get('facebook.enable'));

    
			this.searchApiMasterOptions = Configuration.searchApiMasterOptions.CmsAdapterSearch;
			//console.log("this.searchApiMasterOptions: "+JSON.stringify(this.searchApiMasterOptions));
			this.itemsIds = _.isArray(options.itemsIds) ? _.sortBy(options.itemsIds, function (id) {return id;}) : [options.itemsIds];
			//console.log("this.itemsIds: "+JSON.stringify(this.itemsIds));
		}


		//@method fetchItems @return {jQuery.Deferred}
	,	fetchItems: function ()
		{
			return this.fetch({data:{id: this.itemsIds.join(',')}});
		}

	});
});