/*BB1 G Truslove 2018*/
define('ShopWindow.Collection',
  [
  'Backbone','underscore','Utils'
  ],
  function (Backbone,_,Utils) {
    return Backbone.CachedCollection.extend({
      url: Utils.getAbsoluteUrl('services/ShopWindow.Service.ss')
    });
  }
);