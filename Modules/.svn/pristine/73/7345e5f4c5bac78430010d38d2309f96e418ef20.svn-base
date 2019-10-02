/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Quote
define('Quote', [
	'Quote.Router'

	, 'underscore', 'Utils'
], function(
	QuoteRouter

	, _
) {
	'use strict';

	//@class Quote @extend ApplicationModule
	return {
		//@property {MenuItem} MenuItem
		aMenuItems: [{
			parent: 'orders',
			id: 'quotes',
			name: _('Quotes').translate(),
			url: 'quotes',
			index: 5,
			permission: 'transactions.tranFind.1,transactions.tranEstimate.1'
		},{
			parent: 'orders',
			id: 'requestquotes',
			name: _('Request a Quote').translate(),
			url: 'request-a-quote',
			index: 6,
			permission: 'transactions.tranEstimate.2'
		}]

		//@method mountToApp
		//@param {ApplicationSkeleton} application
		//@return {QuoteRouter} Returns an instance of the quote router used by the current module
		,
		mountToApp: function(application) {
		return null;
			return new QuoteRouter(application);
		}
	};
});