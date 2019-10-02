/*BB1 G Truslove 2017*/
define('Articles.Collection',
  [
  'Backbone',
  'Article.Model',
  'Utils'
  ],
  function (Backbone, Model,Utils) {
    return Backbone.Collection.extend({
      model: Model,
      url: Utils.getAbsoluteUrl('services/Article.Service.ss')
    });
  }
);