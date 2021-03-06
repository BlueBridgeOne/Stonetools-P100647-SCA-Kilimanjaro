/*
  BB1 G Truslove - Nov 2017
  Knowledge Base Articles Overview for sidebar
*/

define('ArticleOverview.Model', [
    'SC.Model'
  ],
  function(SCModel) {
    return SCModel.extend({
      name: 'ArticleOverview',

      getSiteCode:function(site){
switch(site){
case "Ireland":
return "3";
case "France":
return "4";
case "Global":
return "5";
}
return "2";

      },list: function(site,language,types) {

        var filters = [],
          columns = [];


        filters.push(['isinactive', 'is', 'F']);
        filters.push('AND');
        filters.push(['custrecord_bb1_sca_a_language', 'anyof', language.toString()]);
        filters.push('AND');
        filters.push(['custrecord_bb1_sca_a_approved', 'is', 'T']);
filters.push('AND');
        filters.push(['custrecord_bb1_sca_a_priority', 'anyof', [1, 2, 3, 4]]);
        if(types){
        filters.push('AND');
filters.push(['custrecord_bb1_sca_a_type', 'anyof', types]);
}
if(site){
        filters.push('AND');
        filters.push(['custrecord_147_cseg_bb1_website_se', 'anyof', "@NONE@","1",this.getSiteCode(site)]);
        }
        columns.push(new nlobjSearchColumn('custrecord_bb1_sca_a_url'));

        var SC = new nlobjSearchColumn('custrecord_bb1_sca_a_type');
        SC.setSort(false);
        columns.push(SC);

        SC = new nlobjSearchColumn('name');
        SC.setSort(false);
        columns.push(SC);



        var searchresults = nlapiSearchRecord('customrecord_bb1_sca_article', null, filters, columns);

        var res;
        var List = [];
        var lasttype, newtype;
        
        for (var i in searchresults) {
          res = searchresults[i];
          newtype = res.getValue("custrecord_bb1_sca_a_type");
          if (List.length > 0 && newtype != lasttype) { //Nesting views in backbone seems to be too much hassle, so just adding a endoftype check.
            List.push({ type:lasttype,endoftype: true });
          }
          List.push({
            internalid: res.getId(),
            name: res.getValue("name"),
            type: newtype,
            url: res.getValue("custrecord_bb1_sca_a_url"),
            firsttype: newtype != lasttype
          });
          lasttype = newtype;

        }
        if (List.length > 0) { //Nesting views in backbone seems to be too much hassle, so just adding a endoftype check.
          List.push({ type:lasttype,endoftype: true, end: true });
        }

        //nlapiLogExecution("ERROR", "SCA Article Sidebar", JSON.stringify(List));

        return List;

      }
    });
  })