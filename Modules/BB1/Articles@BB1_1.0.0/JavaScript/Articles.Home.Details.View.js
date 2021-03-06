/*BB1 G Truslove 2017*/
define('Articles.Home.Details.View', [
    'Backbone',
    'articles_home_details.tpl',
    'Article'
  ],
  function(Backbone, articles_home_details_tpl, Article) {
    return Backbone.View.extend({
      initialize: function() {
        this.on('afterViewRender', function() {
          this.$el.find("[data-bgimage]").each(function() { //Load and image then set bg image so that an event can be triggered on load.
            var bgimage = this.getAttribute("data-bgimage");
            var $self = $(this);
            $('<img/>').attr('src', bgimage).on('load', function() {
              $(this).remove(); // prevent memory leaks as @benweet suggested
              $self.css('background-image', "url('" + bgimage + "')").css('opacity', 1);
              $(window).trigger("scroll");
              //console.log(bgimage + " OK!");
            });
          });
        });
      },
      getNav: function(url) {
        if (url && url.toLowerCase().indexOf(".pdf") > -1) {
          return "ignore-click";
        }
      },
      getContext: function() {

        var priority = parseInt(this.model.get('priority'));
        var width = this.model.get('width') || 1;
        return {
          'name': this.model.get('name'),
          'priority': this.model.get('priority'),
          'colour': this.model.get('colour'),
          'content': this.model.get('content'),
          'url': this.model.get('url'),
          'image': this.model.get('image'),
          'type': this.model.get('type'),
          'typetext': Article.getTypeText(this.model.get('type')),
          'typeurl': Article.getHref(this.model.get('type')),
          'href': Article.getHref(this.model.get('type'), this.model.get('url')),
          'nav': this.getNav(this.model.get('url')),
          'internalid': this.model.get('internalid'),
          'language': this.model.get('language'),
          'buttontext': this.model.get('buttontext'),
          'largebanner': priority == 1,
          'mediumimage': priority == 2,
          'standard': priority == 3,
          'archive': priority == 4,
          'homepagebanner': priority == 6,
          'homepagetext': priority == 7,
          'homepageimage': priority == 8,
          'firstpriority': this.model.get('firstpriority'),
          'homepagewidth': width,
          'homepagewidth_full': width != 2 && width != 3 && width != 4 && width != 5 && width != 6,
          'homepagewidth_1third': width == 2,
          'homepagewidth_2thirds': width == 3,
          'homepagewidth_1quarter': width == 4,
          'homepagewidth_1half': width == 5,
          'homepagewidth_3quarters': width == 6,
        }
      },

      template: articles_home_details_tpl

    });
  }
)