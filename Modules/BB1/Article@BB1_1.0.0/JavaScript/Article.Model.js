//@module Article - BB1 GTruslove Nov 2017 - Connect to article records. Data model.
define('Article.Model',
  [
  'Backbone',
  'underscore',
  'Utils'
  ],
  function (Backbone, _,Utils) {
    return Backbone.CachedModel.extend({
      urlRoot: Utils.getAbsoluteUrl('services/Article.Service.ss')
    });
  }
);