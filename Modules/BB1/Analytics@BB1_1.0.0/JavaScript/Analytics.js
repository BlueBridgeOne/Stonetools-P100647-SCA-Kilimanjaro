//@module Analytics - BB1 GTruslove Aug 2018 - Tracker for NS.
define('Analytics', ['Tracker','Utils'],
	function (Tracker,Utils) {


		var Analytics = {

			_t: []

				,
			add: function (data) {
				//console.log("add " + JSON.stringify(data));
				var self = this;
				this._t.push(data);
				if (!this._timeout) {
					this._timeout = window.setTimeout(function () {
						window.clearTimeout(self._timeout);
						self._timeout = undefined;
						self.send();
					}, 10000);
				}
			},
			send: function (unload) {
					if (this._t.length > 0) {
						if(!SC.Tools.isLive()){
						console.log("Send Analytics " + this._t.length);
						}


						var data = {
							site: SC.Tools.getSiteCode(),
							tracking: this._t,
						};
						this._t = [];

						//browse detection:

						var nVer = navigator.appVersion;
						var nAgt = navigator.userAgent;
						var browserName = navigator.appName;
						var fullVersion = '' + parseFloat(navigator.appVersion);
						var majorVersion = parseInt(navigator.appVersion, 10);
						var nameOffset, verOffset, ix;

						// In Opera, the true version is after "Opera" or after "Version"
						if ((verOffset = nAgt.indexOf("Opera")) != -1) {
							browserName = "Opera";
							fullVersion = nAgt.substring(verOffset + 6);
							if ((verOffset = nAgt.indexOf("Version")) != -1)
								fullVersion = nAgt.substring(verOffset + 8);
						}
						// In MSIE, the true version is after "MSIE" in userAgent
						else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
							browserName = "Microsoft Internet Explorer";
							fullVersion = nAgt.substring(verOffset + 5);
						}
						// In Chrome, the true version is after "Chrome" 
						else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
							browserName = "Chrome";
							fullVersion = nAgt.substring(verOffset + 7);
						}
						// In Safari, the true version is after "Safari" or after "Version" 
						else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
							browserName = "Safari";
							fullVersion = nAgt.substring(verOffset + 7);
							if ((verOffset = nAgt.indexOf("Version")) != -1)
								fullVersion = nAgt.substring(verOffset + 8);
						}
						// In Firefox, the true version is after "Firefox" 
						else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
							browserName = "Firefox";
							fullVersion = nAgt.substring(verOffset + 8);
						}
						// In most other browsers, "name/version" is at the end of userAgent 
						else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
							(verOffset = nAgt.lastIndexOf('/'))) {
							browserName = nAgt.substring(nameOffset, verOffset);
							fullVersion = nAgt.substring(verOffset + 1);
							if (browserName.toLowerCase() == browserName.toUpperCase()) {
								browserName = navigator.appName;
							}
						}
						// trim the fullVersion string at semicolon/space if present
						if ((ix = fullVersion.indexOf(";")) != -1)
							fullVersion = fullVersion.substring(0, ix);
						if ((ix = fullVersion.indexOf(" ")) != -1)
							fullVersion = fullVersion.substring(0, ix);

						majorVersion = parseInt('' + fullVersion, 10);
						if (isNaN(majorVersion)) {
							fullVersion = '' + parseFloat(navigator.appVersion);
							majorVersion = parseInt(navigator.appVersion, 10);
						}

						var OSName = "Unknown OS";
						if (navigator.appVersion.indexOf("Win") != -1) OSName = "Windows";
						if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS";
						if (navigator.appVersion.indexOf("X11") != -1) OSName = "UNIX";
						if (navigator.appVersion.indexOf("Linux") != -1) OSName = "Linux";

						data.OS = OSName;
						data.userAgent = nAgt;
						data.browser = browserName+" "+fullVersion;
						data.screenSize = screen.width + "x" + screen.height;
						data.language = window.navigator.userLanguage || window.navigator.language;
						$.ajax({
							type: 'POST',
							url: Utils.getAbsoluteUrl('services/Analytics.Service.ss'),
							async: !!!unload, //IMPORTANT, the ajax call must be synchronous when unloading
							data: "data=" + encodeURIComponent(JSON.stringify(data))
						}).done(function (data) {
							if(!SC.Tools.isLive()){
							console.log('Analytics complete');
							}
						});

					}
				}

				,
			trackPageview: function (url) {
				if (_.isString(url)) {
					this.add({
						name: 'page',
						value: this.cleanUrl(url)
					});
				}

				return this;
			},
			trackProductList: function (items, listName) {
					if (listName == "Category") {

						this.add({
							name: 'category',
							value: this.getCategory()
						});
					} else if (listName == "Search Results") {
						var options = _.parseUrlOptions(Backbone.history.fragment),
							key = options.keywords;
						if (key) {
							this.add({
								name: 'search',
								value: key.toLowerCase()
							});
						}
					}


					return this;
				}

				,
			getCategory: function () {
				var options = _.parseUrlOptions(Backbone.history.fragment);

				return '/' + Backbone.history.fragment.split('?')[0];
			},
			trackEvent: function (event) {
				if (event && event.category && event.action) {
					switch (event.category) {
						case "SearchItem-end":
							break;
						case "viewArticle":
							this.add({
								name: "article",
								value: event.label
							});
							break;
						case "add-to-cart":
							console.log(event);
							this.add({
								name: event.category,
								value: this.cleanUrl(event.label)
							});
							break;
						default:
							this.add({
								name: event.category,
								value: event.action + "|" + (event.label || "") + '|' + parseFloat(event.value) || 0
							});
							break;

					}
				}

				return this;
			},
			trackProductView: function (product) {
				var item = product.get("item");
				var displayname = item.get("displayname");
				
				console.log("trackProductView "+item.id + "|" + displayname);
				this.add({
					name: 'item',
					value: item.id+ "|" + displayname
				});

				return this;
			},
			cleanUrl: function (url) {
				var q = url.indexOf("?");
				if (q > -1) {
					url = url.substring(0, q);
				}
				return url;
			},
			addItem: function (item) {
					if (item && item.id && item.name) {
						this.add({
							name: 'addItem',
							value: item
						});
					}

					return this;
				}

				,
			addTrans: function (transaction) {
					if (transaction && transaction.id) {
						this.add({
							name: 'addTransaction',
							value: JSON.stringify(transaction)
						});
					}

					return this;
				}

				,
			trackTransaction: function (transaction) {
				var transaction_id = transaction.get('confirmationNumber');
				this.add({
					name: 'transaction',
					value: transaction_id
				});
				// GoogleUniversalAnalytics.addTrans({
				// 	id: transaction_id
				// ,	revenue: transaction.get('subTotal')
				// ,	shipping: transaction.get('shippingCost') + transaction.get('handlingCost')
				// ,	tax: transaction.get('taxTotal')
				// ,	currency: SC.ENVIRONMENT.currentCurrency && SC.ENVIRONMENT.currentCurrency.code || ''

				// ,	page: '/' + Backbone.history.fragment
				// });

				// transaction.get('products').each(function (product)
				// {
				// 	GoogleUniversalAnalytics.addItem({
				// 		id: transaction_id
				// 	,	affiliation: Configuration.get('siteSettings.displayname')
				// 	,	sku: product.get('sku')
				// 	,	name: product.get('name')
				// 	,	category: product.get('category') || ''
				// 	,	price: product.get('rate')
				// 	,	quantity: product.get('quantity')
				// 	});
				// });

				return this;
			},
			mountToApp: function (application) {

				Tracker.getInstance().trackers.push(Analytics);
				if (window && window.addEventListener) {
					window.addEventListener('beforeunload', function () {
						Analytics.send(true);
					});
				}

			}
		};

		return Analytics;

	}
);