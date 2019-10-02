/*
	BB1 G Truslove - Jan 2018
	ShopWindow - list all categories
*/

function service (request)
{
	'use strict';

	var Application = require('Application');

	try
	{
		
			var method = request.getMethod(),ShopWindow = require('ShopWindow.Model');
		switch (method)
			{
				case 'GET':
					Application.sendContent(ShopWindow.list());
				break;

				default: 
					// methodNotAllowedError is defined in ssp library commons.js
					Application.sendError(methodNotAllowedError);
			}
		
	}
	catch (e)
	{
		nlapiLogExecution("ERROR", "SCA ShopWindow Service Error", e.toString());
		Application.sendError(e);
	}
}