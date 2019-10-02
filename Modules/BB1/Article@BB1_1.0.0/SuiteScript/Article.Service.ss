/*
	BB1 G Truslove - Nov 2017
	Knowledge Base Articles
*/

function service (request)
{
	'use strict';

	var Application = require('Application');

	try
	{
		
			var method = request.getMethod()
			,	url = request.getParameter('url'),type = request.getParameter('type')
			,language = request.getParameter('language')||1
			,site = request.getParameter('site')||"UK"
			,query = request.getParameter('query')
			,showonhomepage = request.getParameter('showonhomepage')||false
			,	Article = require('Article.Model')
			,	data = JSON.parse(request.getBody() || '{}');

if(type){
	type=type.split(",");
}
			switch (method)
			{
				case 'GET':
					Application.sendContent(url ? Article.get(url,site,language) : (Article.list(type,site,language,showonhomepage,query) || []));
				break;

				default: 
					// methodNotAllowedError is defined in ssp library commons.js
					Application.sendError(methodNotAllowedError);
			}
		
	}
	catch (e)
	{
		nlapiLogExecution("ERROR", "SCA Article Service Error", e.toString());
		Application.sendError(e);
	}
}