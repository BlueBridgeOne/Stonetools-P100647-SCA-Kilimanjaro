/* BB1 G Truslove 2015 */

define('Sidebar.Collection',
  [
  'Backbone',
  'ArticleOverview.Model'
  ],
  function (Backbone, Model) {
    return Backbone.Collection.extend({
      model: Model,
      url: _.getAbsoluteUrl('services/ArticleOverview.Service.ss')
    });
  }
);