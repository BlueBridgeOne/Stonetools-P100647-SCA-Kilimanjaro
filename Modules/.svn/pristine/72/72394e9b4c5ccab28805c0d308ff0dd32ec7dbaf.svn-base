/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module ProductDetails
define(
	'ProductDetails.Full.View', [
		'ProductDetails.Base.View', 'SC.Configuration'

		, 'ItemRelations.Related.View', 'ItemRelations.Correlated.View'

		, 'ProductDetails.Information.View'

		, 'SocialSharing.Flyout.View'

		, 'product_details_full.tpl'

		, 'underscore',
		'Article'

	],
	function(
		ProductDetailsBaseView, Configuration

		, ItemRelationsRelatedView, ItemRelationsCorrelatedView

		, ProductDetailsInformationView

		, SocialSharingFlyoutView

		, product_details_full_tpl

		, _, Article
	) {
		'use strict';

		//@class ProductDetails.Full.View Handles the PDP and quick view @extend Backbone.View
		return ProductDetailsBaseView.extend({

			//@property {Function} template
			template: product_details_full_tpl

				//@property {Object} attributes List of HTML attributes applied by Backbone into the $el
				,
			attributes: {
				'id': 'ProductDetails.Full.View',
				'class': 'view product-detail'
			}


			,
			bindings: _.extend({}, ProductDetailsBaseView.prototype.bindings, {})

				//@method initialize Override default method to update the url on changes in the current product
				//@param {ProductDetails.Full.View.Initialize.Options} options
				//@return {Void}
				,
			initialize: function initialize() {
					ProductDetailsBaseView.prototype.initialize.apply(this, arguments);

					this.model.on('change', this.updateURL, this);

				}

				,
			events: {
				'click .accordion': 'showAccordion'
			},
			showAccordion: function(e) {
				e.preventDefault();
				var $acc = $(e.target);

				if (!$acc.hasClass("accordion")) {
					$acc = $acc.closest(".accordion");
				}
				$acc.toggleClass("accordionactive");

				$acc.next().slideToggle();


			},
			childViews: _.extend({}, ProductDetailsBaseView.prototype.childViews, {
					'Correlated.Items': function() {
						return new ItemRelationsCorrelatedView({
							itemsIds: this.model.get('item').get('internalid'),
							application: this.application
						});

					},
					'Related.Items': function() {
						return new ItemRelationsRelatedView({
							itemsIds: this.model.get('item').get('internalid'),
							application: this.application
						});
					},
					'Product.Information': function() {
						return new ProductDetailsInformationView({
							model: this.model
						});
					},
					'SocialSharing.Flyout': function() {
						return new SocialSharingFlyoutView({});
					}
				})

				//@method destroy Override default method to detach from change event of the current product
				//@return {Void}
				,
			destroy: function destroy() {
					this.model.off('change');
					return this._destroy();
				}

				//@method showOptionsPusher Override parent method to allow hide/show the option's pusher on mobile depending on the configuration value: ItemOptions.maximumOptionValuesQuantityWithoutPusher
				//@return {Booelan}
				,
			showOptionsPusher: function showOptionsPusher() {
					var options_values_length = _.reduce(this.model.get('options').map(function(option) {
						if (_.isArray(option.get('values'))) {
							var invalid_values = _.filter(option.get('values'), function(value) {
								return !value.internalid;
							});

							return option.get('values').length - invalid_values.length;
						}
						return 0;
					}), function(memo, num) {
						return memo + num;
					}, 0);

					return options_values_length > Configuration.get('ItemOptions.maximumOptionValuesQuantityWithoutPusher', 1);
				}

				//@method getContext
				//@return {ProductDetails.Full.View.Context}
				,
			getFileIcon:function(ext) { //return an icon class for a download link icon
				switch (ext) {
					case "doc":
					case "docx":
						return "icon-word";
					case "xls":
					case "xlsx":
						return "icon-excel";
					case "ppt":
					case "pptx":
						return "icon-powerpoint";
					case "pdf":
						return "icon-pdf";
					case "zip":
						return "icon-zip";
				}
				return "icon-document";
			},
			getContext: function getContext() {
				var lang = Article.getLanguageCode();
				var item = this.model.get("item");

				var storedetaileddescription = item.get("storedetaileddescription");
				if (lang == "fr") {
					storedetaileddescription = item.get("custitem_bb1_sca_description_" + lang);
				}
storedetaileddescription = Article.combineKeywords(storedetaileddescription, this.options.keywords);
				var additional = {
				overview:storedetaileddescription,
					features: Article.combineKeywords(item.get("custitem_bb1_sca_features_" + lang), this.options.keywords),
					techspecs: Article.combineKeywords(item.get("custitem_bb1_sca_techspecs_" + lang), this.options.keywords),
					instructions: Article.combineKeywords(item.get("custitem_bb1_sca_instructions_" + lang), this.options.keywords),
					safety: Article.combineKeywords(item.get("custitem_bb1_sca_safety_" + lang), this.options.keywords),
					included: Article.combineKeywords(item.get("custitem_bb1_sca_included_" + lang), this.options.keywords),
					recommended: Article.combineKeywords(item.get("custitem_bb1_sca_recommended_" + lang), this.options.keywords)
				};
				var downloads = item.get("custitem_bb1_sca_downloaddata");

				if (downloads) { //Attach download links to additional texts.
				
downloads=downloads.split("{f}").join("/documents/products");

					downloads = downloads.split(',');
					var filename, url, parts, downloadLang, ext, dot;
					for (var i = 0; i < downloads.length; i++) {
					url = downloads[i];
						filename = downloads[i];
						dot = filename.lastIndexOf("/");
						if(dot>-1){
						filename=filename.substring(dot+1);
						}
						dot = filename.lastIndexOf(".");
						if (dot > -1) {
							ext = filename.substring(dot + 1);
						} else {
							ext = "";
						}
						
						//console.log(filename);

						
						parts = filename.split('_');
						downloadLang = parts[2].toLowerCase();
						//console.log("Languages: "+Article.getLanguageCode()+"=="+downloadLang);
						if(Article.getLanguageCode()==downloadLang){
						//console.log("type="+parts[3]);
						switch (parts[3]) {
							case "C": //Colour Chart
								additional.overview = (additional.overview || "") + "<a class=\"article-doc-link\" href=\"" + url + "\" data-navigation=\"ignore-click\"><i class=\"" + this.getFileIcon(ext) + "\"></i> " + (parts[6]||_("Colour Chart").translate()) + "</a>";
								break;
							case "E": //Certificate
								additional.features = (additional.features || "") + "<a class=\"article-doc-link\" href=\"" + url + "\" data-navigation=\"ignore-click\"><i class=\"" + this.getFileIcon(ext) + "\"></i> " + (parts[6]||_("Certificate").translate()) + "</a>";
								break;
							case "R": //Test Results
								additional.features = (additional.features || "") + "<a class=\"article-doc-link\" href=\"" + url + "\" data-navigation=\"ignore-click\"><i class=\"" + this.getFileIcon(ext) + "\"></i> " + (parts[6]||_("Test Results").translate()) + "</a>";
								break;
							case "T": //Technical Data Sheet
								additional.techspecs = (additional.techspecs || "") + "<a class=\"article-doc-link\" href=\"" + url + "\" data-navigation=\"ignore-click\"><i class=\"" + this.getFileIcon(ext) + "\"></i> " + (parts[6]||_("Technical Data Sheet").translate()) + "</a>";
								break;
							case "P": //Parts Diagram
								additional.techspecs = (additional.techspecs || "") + "<a class=\"article-doc-link\" href=\"" + url + "\" data-navigation=\"ignore-click\"><i class=\"" + this.getFileIcon(ext) + "\"></i> " + (parts[6]||_("Parts Diagram").translate()) + "</a>";
								break;
							case "I": //Instructions
								additional.instructions = (additional.instructions || "") + "<a class=\"article-doc-link\" href=\"" + url + "\" data-navigation=\"ignore-click\"><i class=\"" + this.getFileIcon(ext) + "\"></i> " + (parts[6]||_("Instructions").translate()) + "</a>";
								break;
							case "M": //Manual
								additional.instructions = (additional.instructions || "") + "<a class=\"article-doc-link\" href=\"" + url + "\" data-navigation=\"ignore-click\"><i class=\"" + this.getFileIcon(ext) + "\"></i> " + (parts[6]||_("Manual").translate()) + "</a>";
								break;
							case "S": //Safety Data Sheet
								additional.safety = (additional.safety || "") + "<a class=\"article-doc-link\" href=\"" + url + "\" data-navigation=\"ignore-click\"><i class=\"" + this.getFileIcon(ext) + "\"></i> " + (parts[6]||_("Safety Data Sheet").translate()) + "</a>";
								break;
								
						}
						}
					}
				}

				var details = ProductDetailsBaseView.prototype.getContext.apply(this, arguments);

				//@class ProductDetails.Full.View.Context @extend ProductDetails.Base.View.Context
				return _.extend(details, {
					item: item,
					additional: additional,
					youtube: item.get("custitem_bb1_sca_youtube_video"),
					storedetaileddescription: storedetaileddescription,
					deliveryMessage:SC.Tools.getDeliveryMessage(),
					deliveryMessageTime:SC.Tools.getDeliveryMessageTime()

				});

				//@class ProductDetails.Full.View
			}
		});
	});

//@class ProductDetails.Full.View.Initialize.Options @extend ProductDetails.Base.View.Initialize.Options