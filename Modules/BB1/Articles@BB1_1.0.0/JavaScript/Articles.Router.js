/*BB1 G Truslove 2017*/
define('Articles.Router', [
  'Backbone',
  'Articles.List.View',
  'Articles.View',
  'Article.Model',
  'ArticleKeywords.Model',
  'Articles.Collection',
  'Article'
], function(Backbone, ListView,PageView, Model,KeywordsModel, Collection,Article) {
  //console.log("Create Articles");
  
  return Backbone.Router.extend({
    initialize: function(application) {
      this.application = application;
    },
    routes: {
'articles/search/:query':'ArticleSearch',
'articles':'ArticlesList',
'support':'SupportList',
'resources':'ResourcesList',
'working-together':'WorkingTogetherList',
'explore':'ExploreList',
'careers':'CareersList',

'support/contact-stonetools':'SupportContactStonetoolsList',
'support/delivery-and-fulfilment':'SupportDeliveryandFulfilmentList',
'support/my-account':'SupportMyAccountList',
'support/ordering':'SupportOrderingList',
'support/managing-my-stock':'SupportManagingMyStockList',
'support/site-security':'SupportSiteSecurityList',
'support/warranty':'SupportWarrantyList',
'support/returns':'SupportReturnsList',
'support/legal':'SupportLegalList',
'resources/product-highlights':'ResourcesProductHighlightsList',
'resources/reference':'ResourcesReferenceList',
'resources/troubleshooting':'ResourcesTroubleshootingList',
'resources/health-and-safety':'ResourcesHealthAndSafetyList',
'resources/how-to-guides':'ResourcesHowToGuidesList',
'resources/tools-for-my-industry':'ResourcesToolsForMyIndustryList',
'resources/tools-for-stone-working-jobs':'ResourcesToolsforStoneWorkingJobs',
'resources/tools-for-different-stones':'ResourcesToolsforDifferentStones',
'resources/maintaining-stone-at-home':'ResourcesMaintainingStoneatHome',
'working-together/key-benefits':'WorkingTogetherKeyBenefitsList',
'working-together/your-job-role':'WorkingTogetherYourJobRoleList',
'explore/stonetools-policies':'ExploreStonetoolsPoliciesList',
'explore/stonetools-brand':'ExploreStonetoolsBrandList',
'explore/about-stonetools':'ExploreAboutStonetoolsList',
'explore/the-world-of-stonetools':'ExploreTheWorldofStonetoolsList',

'careers/working-at-stonetools':'CareersWorkingAtStonetoolsList',
'careers/job-vacancy':'CareersJobVacancyList',

'support/contact-stonetools/:id':'ArticleDetails',
'support/delivery-and-fulfilment/:id':'ArticleDetails',
'support/my-account/:id':'ArticleDetails',
'support/ordering/:id':'ArticleDetails',
'support/managing-my-stock/:id':'ArticleDetails',
'support/site-security/:id':'ArticleDetails',
'support/warranty/:id':'ArticleDetails',
'support/returns/:id':'ArticleDetails',
'support/legal/:id':'ArticleDetails',
'resources/product-highlights/:id':'ArticleDetails',
'resources/reference/:id':'ArticleDetails',
'resources/troubleshooting/:id':'ArticleDetails',
'resources/health-and-safety/:id':'ArticleDetails',
'resources/how-to-guides/:id':'ArticleDetails',
'resources/tools-for-my-industry/:id':'ArticleDetails',
'resources/tools-for-stone-working-jobs/:id':'ArticleDetails',
'resources/tools-for-different-stones/:id':'ArticleDetails',
'resources/maintaining-stone-at-home/:id':'ArticleDetails',
'working-together/key-benefits/:id':'ArticleDetails',
'working-together/your-job-role/:id':'ArticleDetails',
'explore/stonetools-policies/:id':'ArticleDetails',
'explore/stonetools-brand/:id':'ArticleDetails',
'explore/about-stonetools/:id':'ArticleDetails',
'explore/the-world-of-stonetools/:id':'ArticleDetails',

'careers/working-at-stonetools/:id':'ArticleDetails',
'careers/job-vacancy/:id':'ArticleDetails',

'other/:id':'ArticleDetails'

      

    },
      ArticleDetails: function(id) {
      var model = new Model();
      var keywordsmodel = new KeywordsModel();
      var view = new PageView({model:model,application: this.application,keywords:keywordsmodel});
      
      model.fetch({data: {
            url: id,
            language:Article.getLanguage(),
            site:SC.Tools.getSiteCountry()
          }}).done(function() {
//Once we have the article model, then load the keywords.
keywordsmodel.fetch({data:{language:Article.getLanguage()}}).done(function() {
        view.showContent();
        });

      });
    },
    ArticleList: function(type) {
      var collection = new Collection();
      var view = new ListView({
        collection: collection,
        application: this.application,
        type:type,
        sidebarTypes:Article.getSidebarTypes(type)
      });
      var sectionTypes=Article.getSectionTypes(type);
      collection.fetch({data: {
            type: sectionTypes?sectionTypes.join(','):undefined,
            language:Article.getLanguage(),
            site:SC.Tools.getSiteCountry()

          }}).done(function() {
        view.showContent();
      });
    },
    ArticleSearch: function(query) {
      var collection = new Collection();
      var view = new ListView({
        collection: collection,
        application: this.application,
        type:0,
        query:query
      });
      
      collection.fetch({data: {
            query: query,
            language:Article.getLanguage(),
            site:SC.Tools.getSiteCountry()

          }}).done(function() {
        view.showContent();
      });
    },
    ArticlesList: function() {
      this.ArticleList(0);
    },
    SupportList: function() {
      this.ArticleList(-1);
    },
     ResourcesList: function() {
      this.ArticleList(-2);
    },
     WorkingTogetherList: function() {
      this.ArticleList(-3);
    },
     ExploreList: function() {
      this.ArticleList(-4);
    },
    CareersList: function() {
      this.ArticleList(-5);
    },
    SupportContactStonetoolsList: function() {
      this.ArticleList(1);
    },
    SupportDeliveryandFulfilmentList: function() {
      this.ArticleList(2);
    },
    SupportMyAccountList: function() {
      this.ArticleList(3);
    },
    SupportOrderingList: function() {
      this.ArticleList(4);
    },
    SupportManagingMyStockList: function() {
      this.ArticleList(5);
    },
    SupportSiteSecurityList: function() {
      this.ArticleList(6);
    },
    SupportWarrantyList: function() {
      this.ArticleList(26);
    },
    SupportReturnsList: function() {
      this.ArticleList(27);
    },
    SupportLegalList: function() {
      this.ArticleList(28);
    },
    ResourcesProductHighlightsList: function() {
      this.ArticleList(29);
    },
    ResourcesReferenceList: function() {
      this.ArticleList(30);
    },
    ResourcesTroubleshootingList: function() {
      this.ArticleList(31);
    },
    ResourcesHealthAndSafetyList: function() {
      this.ArticleList(42);
    },
    ResourcesHowToGuidesList: function() {
      this.ArticleList(32);
    },
     ResourcesToolsForMyIndustryList: function() {
      this.ArticleList(43);
    },
    ResourcesToolsforStoneWorkingJobs: function() {
      this.ArticleList(44);
    },
    ResourcesToolsforDifferentStones: function() {
      this.ArticleList(45);
    },
    ResourcesMaintainingStoneatHome: function() {
      this.ArticleList(46);
    },
    WorkingTogetherKeyBenefitsList: function() {
      this.ArticleList(33);
    },
    WorkingTogetherYourJobRoleList: function() {
      this.ArticleList(34);
    },
    ExploreStonetoolsPoliciesList: function() {
      this.ArticleList(35);
    },
    ExploreStonetoolsBrandList: function() {
      this.ArticleList(36);
    },
    ExploreAboutStonetoolsList: function() {
      this.ArticleList(37);
    },
    ExploreTheWorldofStonetoolsList: function() {
      this.ArticleList(38);
    },
    CareersWorkingAtStonetoolsList: function() {
      this.ArticleList(40);
    },
    CareersJobVacancyList: function() {
      this.ArticleList(41);
    },
    OtherList: function() {
      this.ArticleList(39);
    }
    
  });
});