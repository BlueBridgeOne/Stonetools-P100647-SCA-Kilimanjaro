/*
	BB1 G Truslove - Nov 2017
	Knowledge Base Article Keywords List
*/

function service (request)
{
	'use strict';

	var Application = require('Application');

	try
	{
		var language = request.getParameter('language')||1;
			var ArticleKeywords = require('ArticleKeywords.Model');
			Application.sendContent(ArticleKeywords.list(language) || []);
	}
	catch (e)
	{
		Application.sendError(e);
	}
}