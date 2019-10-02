/*
  BB1 G Truslove - Nov 2017
  Knowledge Base Article Keywords for links
*/

define('ArticleKeywords.Model', [
    'SC.Model'
  ],
  function(SCModel) {
    return SCModel.extend({
      name: 'ArticleKeywords',

      list: function(language) {

        var filters = [],columns = [];


        filters.push(['isinactive', 'is', 'F']);
        filters.push('AND');
        filters.push(['custrecord_bb1_sca_ak_language', 'anyof', language.toString()]);


        columns.push(new nlobjSearchColumn('name'));
        columns.push(new nlobjSearchColumn('custrecord_bb1_sca_ak_type'));
        columns.push(new nlobjSearchColumn('custrecord_bb1_sca_ak_language'));
        columns.push(new nlobjSearchColumn('custrecord_bb1_sca_ak_url'));

        var searchresults = nlapiSearchRecord('customrecord_bb1_sca_articlekeyword', null, filters, columns);

        var res;
        var List = [];
        for (var i in searchresults) {
          res = searchresults[i];
          List.push({
            name: res.getValue("name"),
            type: res.getValue("custrecord_bb1_sca_ak_type"),
            language: res.getValue("custrecord_bb1_sca_ak_language"),
            url: res.getValue("custrecord_bb1_sca_ak_url")
          });
        }
        //nlapiLogExecution("ERROR", "SCA Article Keywords", JSON.stringify(List));

        return List;

      }
    });
  })