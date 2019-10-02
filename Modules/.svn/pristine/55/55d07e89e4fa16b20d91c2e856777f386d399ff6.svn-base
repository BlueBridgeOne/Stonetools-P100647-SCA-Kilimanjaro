/*BB1 G Truslove Jane 2018*/
define('ShopWindow.Details.View', [
    'Backbone',
    'shopwindow_details.tpl'
  ],
  function(Backbone, shopwindow_details_tpl) {
    return Backbone.View.extend({
      getContext: function() {

        return {
          'name': this.model.get('name'),
          'thumbnail': this.model.get('thumbnailurl'),
          'url': this.model.get('fullurl'),
          'parent': this.model.get('parent'),
          'newparent': this.model.get('newparent'),
          'parenturl': this.model.get('parenturl'),
          'parenticon': this.model.get('parenticon')
        }
      },

      template: shopwindow_details_tpl

    });
  }
)