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
		var language = request.getParameter('language')||1;
		var types = request.getParameter('types'),site = request.getParameter('site')||"UK";
		if(types){
			types=types.split(',')
		}
			var ArticleOverview = require('ArticleOverview.Model');

			Application.sendContent(ArticleOverview.list(site,language,types) || []);
		
	}
	catch (e)
	{
		Application.sendError(e);
	}
}