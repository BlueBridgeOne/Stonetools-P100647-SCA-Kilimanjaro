/*
  BB1 G Truslove - Jan 2018
  ShopWindow
*/

define('ShopWindow.Model', [
    'SC.Model'
  ],
  function(SCModel) {
    return SCModel.extend({
      name: 'ShopWindow',
      list: function() {

        try {
          var filters = [],
            columns = [];

var BrandsId=185; //Hard coded category value

          filters.push(['isinactive', 'is', 'F']);
          filters.push('AND');
          filters.push(['displayinsite', 'is', 'T']);
          filters.push('AND');
          filters.push(['primaryparent', 'noneof', [BrandsId]]);
          filters.push('AND');
          filters.push(['internalid', 'noneof', [BrandsId]]);

          columns.push(new nlobjSearchColumn('primaryparent'));
          
          columns.push(new nlobjSearchColumn('fullurl'));
          columns.push(new nlobjSearchColumn('thumbnailurl'));



          var SC = new nlobjSearchColumn('name');
          SC.setSort(false);
          columns.push(SC);

          




          var searchresults = nlapiSearchRecord('commercecategory', null, filters, columns);

          var res;
          var List = [];

          for (var i in searchresults) {
            res = searchresults[i];
            if (res.getValue("primaryparent")) {
if(res.getText("primaryparent")!="More"){
              List.push({
                internalid: res.getId(),
                name: res.getValue("name"),
                thumbnailurl: res.getValue("thumbnailurl"),
                fullurl: res.getValue("fullurl"),
                parent:res.getText("primaryparent")
              });
              }
            }

          }

          return List;
        } catch (err) {
          nlapiLogExecution("ERROR", "SCA ShowWindow Error", err.toString());
          return []
        }
      }
    });
  })