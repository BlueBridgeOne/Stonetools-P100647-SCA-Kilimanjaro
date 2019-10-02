//@module Article - BB1 GTruslove Nov 2017 - Connect to article keywords. Data model.
define('ArticleKeywords.Model',
  [
  'Backbone',
  'underscore',
  'Utils',
  'Backbone.CachedModel'
  ],
  function (Backbone, _,Utils,BackboneCachedModel) {
    return BackboneCachedModel.extend({
      urlRoot: Utils.getAbsoluteUrl('services/ArticleKeywords.Service.ss')
    });
  }
);