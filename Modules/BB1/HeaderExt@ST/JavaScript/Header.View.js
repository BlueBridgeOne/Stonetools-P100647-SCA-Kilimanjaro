/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Header
define(
	'Header.View', [
		'SC.Configuration', 'Profile.Model', 'Header.Logo.View', 'Header.MiniCart.View', 'Header.MiniCartSummary.View', 'Header.Profile.View', 'Header.Menu.View', 'SiteSearch.View'

		, 'header.tpl'

		, 'jQuery', 'Backbone', 'Backbone.CompositeView', 'underscore', 'Utils'
	],
	function(
		Configuration, ProfileModel, HeaderLogoView, HeaderMiniCartView, HeaderMiniCartSummaryView, HeaderProfileView, HeaderMenuView, SiteSearchView

		, header_tpl

		, jQuery, Backbone, BackboneCompositeView, _, Utils
	) {
		'use strict';

		// @class Header.View @extends Backbone.View
		return Backbone.View.extend({

			template: header_tpl

				,
			events: {
				'click [data-action="show-sitesearch"]': 'showSiteSearch',
				'click [data-action="show-siteglobal"]': 'showMiniGlobal',
				'click [data-action="header-sidebar-show"]': 'showSidebar',
				'click [data-action="header-sidebar-hide"]': 'hideSidebar',
				'click [data-type="header-sidebar-menu"]': 'hideSidebar',
				'click [data-type="mini-cart"]': 'hideGlobal',
				'click [data-action="show-myaccount-menu"]': 'showMyAccountMenu'
			}

			,
			initialize: function() {
				var self = this;

				BackboneCompositeView.add(this);

				Backbone.history.on('all', this.verifyShowSiteSearch, this);

				ProfileModel.getPromise().done(function() {
					self.render();
				});

				$(document).on('mouseup', function(e) {
					if ($(e.target).closest(".header-menu-global").length == 0) {
						$('[data-type="mini-global"]').parent().removeClass('open');
					}
				});
			},
			verifyShowSiteSearch: function() {

				}
				// @method showMyAccountMenu
				,
			showMyAccountMenu: function(ev) {
					console.log("show my account");
					$(".header-site-search").hide();
					ev && ev.preventDefault();
					$(".header-secondary-wrapper").slideDown();
					this.$('#myaccount-container').toggle();

				}
				// @method showSiteSearch
				,
			showSiteSearch: function(ev) {
					ev && ev.preventDefault();

this.$('#myaccount-container').hide();
					// This add a class 'active' to change button color
					this.$('[data-action="show-sitesearch"]').toggleClass('active');
					var self = this;

					this.$('[data-type="SiteSearch"]').stop(true, false).slideToggle(function() {
						// Set focus and cleans previous search
						self.getChildViewInstance('SiteSearch').showSiteSearch();
					});
				}

				//@method hideSiteSearch Auto-hide the site search form
				//@return {Void}
				,
			hideSiteSearch: function() {
					// This hide Sitesearch div
					this.$('[data-type="SiteSearch"]').slideUp();
				}
				// @method showMiniCart
				//@return {Void}
				,
			showMiniCart: function() {
				$('[data-type="mini-global"]').parent().removeClass('open');
				this.$('[data-type="mini-cart"]').parent().addClass('open');
			},
			hideGlobal: function() {
					$('[data-type="mini-global"]').parent().removeClass('open');
				}
				// @method showGlobal
				//@return {Void}
				,
			showMiniGlobal: function() {
					$('[data-type="mini-cart"]').parent().removeClass('open');
					$('[data-type="mini-global"]').parent().toggleClass('open');
				}

				// @method showSidebar
				//@return {Void}
				,
			showSidebar: function() {

					jQuery('#main').addClass('header-sidebar-opened');
				}

				// @method hideSidebar
				//@return {Void}
				,
			hideSidebar: function(e) {
					if (e.target.tagName === 'A') {
						if (this.activeLink) {
							this.activeLink.removeClass('active');
						}
						this.activeLink = jQuery(e.target);
						this.activeLink.addClass('active');
					}
					jQuery('#main').removeClass('header-sidebar-opened');
				}

				,
			childViews: {
				'Header.MiniCart': function() {
					return new HeaderMiniCartView();
				},
				'Header.MiniCartSummary': function() {
					return new HeaderMiniCartSummaryView();
				},
				'Header.Profile': function() {
					var header_profile_view_options = _.extend({
						showMyAccountMenu: true,
						application: this.options.application
					}, this.options.headerProfileViewOptions || {});

					return new HeaderProfileView(header_profile_view_options);
				},
				'Header.Logo': function() {
					return new HeaderLogoView(this.options);
				},
				'Header.Menu': function() {
					var header_view_options = _.extend({
						application: this.options.application
					}, this.options.headerProfileViewOptions || {});

					return new HeaderMenuView(header_view_options);
				},
				'SiteSearch': function() {
					return new SiteSearchView();
				}
			}

			// @method getContext
			// @return {Header.View.Context}
			,
			getContext: function getContext() {
					var environment = SC.ENVIRONMENT,
						show_languages = environment.availableHosts && environment.availableHosts.length > 1,
						show_currencies = environment.availableCurrencies && environment.availableCurrencies.length > 1 && !Configuration.get('header.notShowCurrencySelector');

					var profile = ProfileModel.getInstance(),
						is_loading = !_.getPathFromObject(Configuration, 'performance.waitForUserProfile', true) &&  ProfileModel.getPromise().state() !== 'resolved',
						is_loged_in = (profile.get('isLoggedIn') === 'T' || profile.get('isRecognized') === 'T') && profile.get('isGuest') === 'F';
					var displayName;
					if (profile.get('firstname')) {
						displayName = profile.get('firstname') + " " + profile.get('lastname')
					} else {
						displayName = profile.get('companyname');
					}
					displayName = SC.Tools.getInitials(displayName);
var siteCode=SC.Tools.getSiteCode();
if(siteCode==""){
siteCode=undefined;
}
					// @class Header.View.Context
					return {
						// @property {Boolean} showExtendedMenu
						showExtendedMenu: !is_loading && is_loged_in
							// @property {Profile.Model} profileModel
							,
						profileModel: ProfileModel.getInstance()
							// @property {Boolean} showLanguages
							,
						showLanguages: show_languages
							// @property {Boolean} showCurrencies
							,
						showCurrencies: show_currencies
							// @property {Boolean} showLanguagesOrCurrencies
							,
						showLanguagesOrCurrencies: show_languages || show_currencies
							// @property {Boolean} showLanguagesAndCurrencies
							,
						showLanguagesAndCurrencies: show_languages && show_currencies
							// @property {Boolean} isHomeTouchpoint
							,
						isHomeTouchpoint: Configuration.currentTouchpoint === 'home'
							// @property {String} cartTouchPoint
							,
						cartTouchPoint: Configuration.get('modulesConfig.Cart.startRouter', false) ? Configuration.currentTouchpoint : 'viewcart'
							// @property {String} displayName
							,
						showDisplayName: displayName && displayName.length > 0,
						displayName: displayName,
						siteCode: siteCode,
						availableHosts:SC.Tools.getHostList()
					};
					// @class Header.View
				}

				//@method destroy Override default destroy method to clean navigation event handlers
				//@return {Void}
				,
			destroy: function() {
				Backbone.View.prototype.destroy.apply(this, arguments);

				Backbone.history.off('all', this.verifyShowSiteSearch);
				$(document).off('mouseup');
			}
		});

	});