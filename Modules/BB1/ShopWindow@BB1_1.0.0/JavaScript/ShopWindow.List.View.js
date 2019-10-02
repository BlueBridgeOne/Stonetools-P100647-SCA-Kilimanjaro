/*BB1 G Truslove 2018*/
define('ShopWindow.List.View', [
    'Backbone',
    'shopwindow_list.tpl', 'Backbone.CollectionView', 'Backbone.CompositeView','ShopWindow.Details.View'
  ],
  function(Backbone, shopwindow_list_tpl, CollectionView, CompositeView,ShopWindowDetailsView) {
    return Backbone.View.extend({
      initialize: function(options) {
        CompositeView.add(this);
        this.application = options.application;
        this.collection = options.collection;
        

      },
      getTitle: function() {
        return SC.Tools.getTitle("Shop Window");
      },
      getCanonical: function() {
        return "/shopwindow";
      },
      getMetaDescription: function() {
          return "A visual view of all Stonetools categories.";
        }

        // @method getMetaKeywords @return {String}
        ,
      getAddToHead: function() {
        return SC.Tools.getSEO({ title: "Shop Window", summary: "A visual view of all Stonetools categories." });
      },
      getBreadcrumbPages: function getBreadcrumbPages() {
        var breadcrumbs = [];
        breadcrumbs.push({ href: "/shopwindow", text: "Shop Window" });
        return breadcrumbs;
      },
      childViews: {
      'ShopWindow.Collection': function() {
      
        return new CollectionView({
          'childView': ShopWindowDetailsView,
          'collection': this.collection
        });
      }
      }
      ,
      getContext: function() {
        return {};
      },

      template: shopwindow_list_tpl

    });
  }
)