/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Header
define(
	'Header.Menu.View', [
		'Profile.Model', 'SC.Configuration', 'Header.Profile.View', 'Header.Menu.MyAccount.View'

		, 'header_menu.tpl'

		, 'Backbone', 'Backbone.CompositeView', 'underscore', 'jQuery', 'jQuery.sidebarMenu'
	],
	function (
		ProfileModel, Configuration, HeaderProfileView, HeaderMenuMyAccountView

		, header_menu

		, Backbone, BackboneCompositeView, _, jQuery
	) {
		'use strict';

		//@class Header.Menu.View @extends Backbone.View
		return Backbone.View.extend({

			template: header_menu

				,
			events: {
				'mouseenter [data-toggle="categories-menu"]': 'menuOpen',
				'mouseleave #myaccount-container': 'menuClose',
				'mouseleave [data-toggle="categories-menu"]': 'menuClose',
				'mouseenter .header-menu-level-container': 'protectionFinished',

				'click [data-toggle="categories-menu"]': 'menuClose',
				'click [data-action="show-subcat"]': 'showSubcat',
				'click img': 'showSubcat',
				'click td': 'showSubcat',
				'click .header-menu-level3-anchor': 'menuClick',
				'click .header-menu-level2-anchor': 'mainClick',
				'click .header-menu-level1-anchor': 'menuClick'

			},
			showSubcat: function (e) {

				var $this = $(e.target);
				if (!$this.hasClass("header-menu-level2-anchor")) {
					$this = $this.closest("a");
				}
				if ($this.attr("data-subcat")) {
					e.preventDefault();
					e.stopPropagation();
					if (!$this.hasClass("open")) {
						$(".header-menu-level2-anchor").removeClass("open");
						$this.addClass("open");
						$(".header-menu-level3").stop();
						$("#" + $this.attr("data-subcat")).stop();
						$(".header-menu-level3").slideUp();
						$("#" + $this.attr("data-subcat")).slideDown();

						//start a close menu protection timeout. Allow a 1/2 seconds if resizing the menu makes the mouse leave the menu.
						this.protectionFinished();
						this._protectTimeout = window.setTimeout(this.protectionFinished(), 500);

					}
				}
			},
			protectionFinished: function () { //clear all timers.

					if (this._closeTimeout) {
						window.clearTimeout(this._closeTimeout);
						this._closeTimeout = undefined;
					}
					if (this._protectTimeout) {
						window.clearTimeout(this._protectTimeout);
						this._protectTimeout = undefined;
					}
				}

				,
			menuOpen: function (e) {
				if ($(".header-site-search").css("display") != "block") {
					$(".header-site-search").hide();
					jQuery(e.currentTarget).addClass('open');
					$("#myaccount-container").hide();
				}
			},
			mainClick: function (e) {
				var $this = $(e.target);
				if (!$this.hasClass("header-menu-level2-anchor")) {
					$this = $this.closest("a");
				}
				if (!$this.attr("data-subcat")) {
					this.protectionFinished();
					$(".header-menu-level3").css("display", "none");
					$(".header-menu-level2-anchor").removeClass("open");
					jQuery(e.currentTarget).closest("[data-toggle='categories-menu']").removeClass('open');
				}
			},
			menuClick: function (e) {
				if (e.currentTarget.className!="header-menu-level3-anchor"&&this.is_touch_device()) { //on touch device, show menu
					e.preventDefault();
					e.stopPropagation();
					if ($(".header-site-search").css("display") != "block") {
						$(".header-site-search").hide();
						$(".header-menu-level3").css("display", "none");
						$(".header-menu-level2-anchor").removeClass("open");
						jQuery(e.currentTarget).closest("li").toggleClass('open');
						$("#myaccount-container").hide();
					}

				} else {
					this.protectionFinished();
					$(".header-site-search").hide();
					$(".header-menu-level3").css("display", "none");
					$(".header-menu-level2-anchor").removeClass("open");
					jQuery(e.currentTarget).closest("[data-toggle='categories-menu']").removeClass('open');
				}
			},
			is_touch_device: function () {
				var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
				var mq = function (query) {
					return window.matchMedia(query).matches;
				}

				if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
					return true;
				}

				// include the 'heartz' as a way to have a non matching MQ to help terminate the join
				// https://git.io/vznFH
				var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
				return mq(query);
			},
			menuClose: function (e) {

				if ($(".header-site-search").css("display") != "block") {
					$(".header-site-search").hide();
					$("#myaccount-container").hide();
					if (this._protectTimeout || this._closeTimeout) { //The menu is protected, wait for 1/2 second before closing.
						if (this._protectTimeout) {
							window.clearTimeout(this._protectTimeout);
							this._protectTimeout = undefined;
						}
						if (!this._closeTimeout) {
							this._closeTimeout = window.setTimeout(this.menuCloseNow, 500);
							return;
						}
					}
					this.protectionFinished();
					$(".header-menu-level3").css("display", "none");
					$(".header-menu-level2-anchor").removeClass("open");
					jQuery(e.currentTarget).removeClass('open');
				}

			},
			menuCloseNow: function () { //Just close the menu, no protection checks.
				$(".header-menu-level3").css("display", "none");
				$(".header-menu-level2-anchor").removeClass("open");
				$("[data-toggle='categories-menu']").removeClass('open');

			},
			initialize: function () {
				var self = this;
				BackboneCompositeView.add(this);

				this.options.application.on('Configuration.navigationData', this.render, this);

				ProfileModel.getPromise().done(function () {
					self.render();
				});
				$(window).on('scroll', function (e) { //hide when scroll down, show when scroll up, also shrink on scroll.
					var top = $(document).scrollTop();
					if (self.lastTop == top) {
						return;
					}
					self.lastTop = top;
					//Parallax
					var vph = $(window).height();
					//console.log("top " + top + " h=" + vph+" "+$(".article-parallax").length);
					var $self, entry, exit, etop, eheight, pos;
					$(".article-parallax").each(function () {
						$self = $(this);
						etop = $self.offset().top;
						eheight = $self.height();
						//console.log(etop + " " + eheight);
						var entry = top - eheight;
						var exit = top + vph;
						if (etop >= entry && etop <= exit) { //element is in viewport
							pos = ((etop - entry) / (exit - entry)) - .5;

							//console.log(pos+" "+$self.css("background-position"));
							$self.css("backgroundPosition", "50% " + (50 + (pos * 80)) + "%")
						}
					});

					//if(top>0){
					//$(".header-main-wrapper").addClass("header-shadow");
					//}else{
					//$(".header-main-wrapper").removeClass("header-shadow");
					//}

					//header
					var siteSearch = $(".header-site-search").css("display");
					if (siteSearch == "block") {
						return;
					}

					var lastShowHide = self.lastShowHide || 0;
					var headerHeight = self.headerHeight;
					var maxHeaderHeight = 168,
						minHeaderHeight = 72,
						controlsHeight = 50;
					var newHeaderHeight = minHeaderHeight + Math.max(0, ((maxHeaderHeight - minHeaderHeight) * ((200 - top) / 200)));


					var headerOpacity = self.headerOpacity;
					var maxHeaderOpacity = 1,
						minHeaderOpacity = .7;
					var newHeaderOpacity = minHeaderOpacity + Math.max(0, ((maxHeaderOpacity - minHeaderOpacity) * ((200 - top) / 200)));
					var menuHeight = 0;
					if ($(document).width() >= 992) {
						menuHeight = 55;
					}
					var diff = 30;

					if (top > lastShowHide + diff || top < lastShowHide - diff) {
						if (top > lastShowHide + diff) {
							if (!self.menuHidden && top > 100) {
								$(".header-secondary-wrapper").stop();
								$(".header-secondary-wrapper").slideUp();
								self.menuHidden = true;
							}
							self.lastShowHide = top;
						} else if (top < lastShowHide - diff) {
							if (self.menuHidden) {
								$(".header-secondary-wrapper").stop();
								$(".header-secondary-wrapper").slideDown();
								self.menuHidden = false;
							}
							self.lastShowHide = top;
						}
					}

					if (headerHeight != newHeaderHeight) {
						self.headerHeight = newHeaderHeight;
						$(".header-main-wrapper").css("min-height", newHeaderHeight + "px");
						$(".header-controls").css("margin-top", ((newHeaderHeight - controlsHeight) / 2) + "px");

						$(".header-secondary-wrapper").css("top", newHeaderHeight + "px");

						$(".header-site-search").css("top", (newHeaderHeight + menuHeight) + "px")
					}


				});
				$(window).on('resize', function (e) {

					self.lastTop = undefined;
					self.lastShowHide = undefined;
					self.headerHeight = undefined;
					self.headerOpacity = undefined;
					$(window).trigger("scroll");

				});
			},

			menuHidden: false,

			childViews: {
				'Header.Profile': function () {
					return new HeaderProfileView({
						showMyAccountMenu: true,
						application: this.options.application
					});
				},
				'Header.Menu.MyAccount': function () {
					return new HeaderMenuMyAccountView(this.options);
				}
			}

			,
			render: function () {
					//console.log("render header ");

					Backbone.View.prototype.render.apply(this, arguments);
					this.$('[data-type="header-sidebar-menu"]').sidebarMenu();
				}

				// @method getContext
				// @return {Header.Sidebar.View.Context}
				,
			getContext: function () {
				var profile = ProfileModel.getInstance(),
					is_loading = !Configuration.get('performance.waitForUserProfile', true) && ProfileModel.getPromise().state() !== 'resolved',
					is_loged_in = profile.get('isLoggedIn') === 'T' && profile.get('isGuest') === 'F',
					environment = SC.ENVIRONMENT,
					show_languages = environment.availableHosts && environment.availableHosts.length > 1,
					show_currencies = environment.availableCurrencies && environment.availableCurrencies.length > 1 && !Configuration.get('header.notShowCurrencySelector');
				var currentTouchpoint = SC.ENVIRONMENT.SCTouchpoint;
				_.each(Configuration.navigationData, function (entry) {
					if (entry.dataTouchpoint !== undefined) {
						entry.data = entry.data || {};
						entry.data.touchpoint = entry.dataTouchpoint;
					}
					if (entry.dataHashtag !== undefined) {
						entry.data = entry.data || {};
						entry.data.hashtag = entry.dataHashtag;
					}
					if ((entry.dataTouchpoint == "viewcart" || entry.dataTouchpoint == "cart") && (currentTouchpoint == "shopping" || currentTouchpoint == "home")) { //Quick order fix
						entry.dataTouchpoint = currentTouchpoint;
					}

				});
				//Rearrange the categories so sub cats are after every 4 main cats so they can be rendered with handlebars as a drop down.
				var copyData = JSON.stringify(Configuration.navigationData || []);
				var navData = JSON.parse(copyData);
				var mobileData = JSON.parse(copyData);
				for (var index = 0; index < navData.length; index++) {

					if (index > -1 && navData[index].categories) {
						var cats = navData[index].categories;
						if (navData[index].categories) {
							var newCats = [];

							for (var i = 0; i < cats.length; i++) { //Remove brands

								if (cats[i].href != "/brands" && cats[i].href != "/more") {
									newCats.push(cats[i]);
								}
							}


							mobileData[index].categories = JSON.parse(JSON.stringify(newCats));

							cats = newCats;
							newCats = [];


							for (var i = 0; i < cats.length; i += 4) { //Sort into rows of 4
								for (var j = i; j < i + 4 && j < cats.length; j++) {
									if (cats[j].categories) {
										cats[j].subcatid = "subcat_" + index + "_" + j;
									}
									if (j == i + 3) {
										cats[j].clearfix = true;
									}
									newCats.push(cats[j]);
								}

								for (var j = i; j < i + 4 && j < cats.length; j++) {

									if (cats[j].categories) {
										if (cats[j]["data-type"] == "commercecategory") {
											cats[j].categories.push({
												class: "header-menu-level3-anchor",
												"data-type": "commercecategory",
												text: "View All " + cats[j].text,
												href: cats[j].href,
												data: cats[j].data
											});
										}
										for (var k = 3; k < cats[j].categories.length; k += 4) { //add clearfix to every 4th cat.
											cats[j].categories[k].clearfix = true;

										}

										newCats.push({
											subcat: true,
											id: "subcat_" + index + "_" + j,
											categories: cats[j].categories
										});
										cats[j].categories = [];


									}
								}
							}
							navData[index].categories = newCats;
						}
					}
				}


				// @class Header.Sidebar.View.Context
				return {

					categories: mobileData,
					maincategories: navData
						// @property {Boolean} showExtendedMenu
						,
					showExtendedMenu: !is_loading && is_loged_in,
					availableHosts: SC.Tools.getHostList()

				};
			}
		});

	});