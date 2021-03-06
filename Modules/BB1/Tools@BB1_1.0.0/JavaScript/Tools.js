/* BB1 G Truslove - reusable functions */

define('Tools', [
		'jQuery', 'Utils', 'underscore', 'SC.Configuration'
	],
	function (
		jQuery, Utils, _, Configuration
	) {

		'use strict';

		function getHostList() { //Collate host data into usable list.

			var environment = SC.ENVIRONMENT;
			var hosts = [],
				host, h, protocol = "http";

			for (var i = 0; i < environment.availableHosts.length; i++) {
				h = environment.availableHosts[i];
				host = {
					title: h.title,
					domain: h.title
				};

				if (h.title && (h.title.indexOf(".co.uk") > -1 || h.title.indexOf(".ie") > -1)) {
					protocol = "https";
				} else {
					protocol = "http";
				}

				if (h.languages && h.languages.length > 0) {
					host.language = h.languages[0].title;
					host.locale = h.languages[0].locale;
					host.title = h.languages[0].title || host.title;
					host.url = protocol + "://" + h.currencies[0].host + "?lang=" + h.languages[0].locale;
				}
				if (h.currencies && h.currencies.length > 0) {
					host.currency = h.currencies[0].code;
					if (host.url) {
						host.url += "&cur=" + h.currencies[0].code;
					} else {
						host.url = protocol + "://" + h.currencies[0].host + "?cur=" + h.currencies[0].code;
					}
				}

				hosts.push(host);
			}

			return hosts;
		}

		function showItem(Country) { //Should this item be shown in the web store.
			if (Country) {
				var Countries = Country.split(',');
				var Site = SC.Tools.getSiteCountry();
				//console.log(Country + " = " + Site);
				for (var i = 0; i < Countries.length; i++) {
					Countries[i] = SC.Tools.trim(Countries[i]);
					if (Countries[i] == "Any" || Countries[i] == "&nbsp;") {
						return true;
					} else if (Site == Countries[i]) {
						return true;
					}
				}
			}
		}

		function parseSearchResponse(response) { //Remove items that are not to be shown in the web store.
			if (response.items && response.items.length == 0) {
				return response;
			}
			if (response.items) {
				//console.log("collection "+response.total);
				var removed = 0;
				for (var i = response.items.length - 1; i >= 0; i--) {
					//console.log("- " + response.items[i].custitem_cseg_bb1_website_se);
					//console.log("Show: " + Article.showItem(response.items[i].custitem_cseg_bb1_website_se));
					if (!showItem(response.items[i].custitem_cseg_bb1_website_se)) {
						response.items.splice(i, 1);
						//console.log("Removed item from collection.");
						removed++;
					}
				}
				if (response.total) {
					response.total -= removed;
				}
				if (response.total == 0) {

					response = {
						"errors": "Items not found",
						"code": 404
					};
				}
			} else {

				//console.log("single " + response.custitem_cseg_bb1_website_se);
				//console.log("Show: " + Article.showItem(response.custitem_cseg_bb1_website_se));
				if (!showItem(response.custitem_cseg_bb1_website_se)) {
					response = {
						"errors": "Item not found",
						"code": 404
					};
					//console.log("Removed item.");
				}
			}

			return response;
		}

		function showErrorInModal(application, title, message) {

			var view = new Backbone.View({
				application: application
			});

			view.title = title;
			view.render = function () {
				this.$el.append('<p class="error-message">' + message + '</p><br /><div class="text-center"><button class="button-primary button-large" data-dismiss="modal">' + _('OK').translate() + '</button></div>');
			};
			view.showInModal();
		}

		function showSuccessInModal(application, title, message) {

			var view = new Backbone.View({
				application: application
			});

			view.title = title;
			view.render = function () {
				this.$el.append('<p class="success-message">' + message + '</p><br /><div class="text-center"><button class="button-primary button-large" data-dismiss="modal">' + _('OK').translate() + '</button></div>');
			};
			view.showInModal();
		}

		function trim(text) { //trim leading and ending spaces
			return text.replace(/^\s+|\s+$/g, '')
		}

		function getInitials(text) { //Get the initials of this name for the header.
			if (!text) {
				return;
			}
			var names = text.split(" ");
			if (names.length == 1) {
				if (names[0].length == 1) {
					return names[0][0];
				} else {
					return names[0][0] + names[0][1];
				}
			} else {
				return names[0][0] + names[names.length - 1][0];
			}
		}

		function endsWith(text, value) { //does the text end with value?
			if (!text || !value) {
				return false;
			}
			if (text.length >= value.length) {
				return text.substring(text.length - value.length) == value;
			}
			return false;
		}

		function getName() {
			return "Stonetools Ltd | " + _("Everything You Need for Working Stone").translate();
		}

		function getTitle(title) {
			return _(title).translate() + " | " + this.getName();
		}

		function getSiteCode() {
			var host = SC.ENVIRONMENT.currentHostString;
			switch (host) {
				case "stonetools-fr.bluebridgeone.com":
				case "www.stonetools.fr":
				case "stonetools.fr":
					return "FR";
				case "stonetools-ie.bluebridgeone.com":
				case "www.stonetools.ie":
				case "stonetools.ie":
					return "IE";
				case "stonetools-global.bluebridgeone.com":
				case "www.stonetoolsglobal.com":
				case "stonetoolsglobal.com":
					return "";
			}
			return "UK";
		}

		function isLive() {
			var host = SC.ENVIRONMENT.currentHostString;
			if(!host||host.indexOf("bluebridgeone.com")>-1){
				return false;
			}
			return true;
		}

		function getSiteCountry() {
			var host = SC.ENVIRONMENT.currentHostString;
			switch (host) {
				case "stonetools-fr.bluebridgeone.com":
				case "www.stonetools.fr":
				case "stonetools.fr":
					return "France";
				case "stonetools-ie.bluebridgeone.com":
				case "www.stonetools.ie":
				case "stonetools.ie":
					return "Ireland";
				case "stonetools-global.bluebridgeone.com":
				case "www.stonetoolsglobal.com":
				case "stonetoolsglobal.com":
					return "Global";
			}
			return "UK";
		}

		function getNSCountryCode() {
			var host = SC.ENVIRONMENT.currentHostString;
			switch (host) {
				case "stonetools-fr.bluebridgeone.com":
				case "www.stonetools.fr":
				case "stonetools.fr":
					return "FR";
				case "stonetools-ie.bluebridgeone.com":
				case "www.stonetools.ie":
				case "stonetools.ie":
					return "IE";
				case "stonetools-global.bluebridgeone.com":
				case "www.stonetoolsglobal.com":
				case "stonetoolsglobal.com":
					return "";
			}
			return "GB";
		}

		function encodeDQString(value) {

			if (value) {
				return value.split("\"").join("\\\"");
			}
			return value;
		}

		function getSEO(details) { //Get SEO meta tags based on details object

			var meta = "";
			if (details.summary) {
				meta += "<meta name=\"twitter:card\" content=\"" + encodeDQString(_(details.title).translate()) + "\">\r\n";
			}
			if (details.twitter) {
				meta += "<meta name=\"twitter:site\" content=\"@" + details.twitter + "\">\r\n";
				meta += "<meta name=\"twitter:title\" content=\"" + encodeDQString(_(details.title).translate()) + "\">\r\n";
				if (details.summary) {
					meta += "<meta name=\"twitter:description\" content=\"" + encodeDQString(details.summary) + "\">\r\n";
				}
				//meta+="<meta name=\"twitter:creator\" content=\"@author_handle\">\r\n";
				if (details.image) {
					meta += "<meta name=\"twitter:image\" content=\"" + encodeDQString(details.image) + "\">\r\n";
				}
			}

			meta += "<meta property=\"og:title\" content=\"" + encodeDQString(_(details.title).translate()) + "\" />\r\n";
			meta += "<meta property=\"og:type\" content=\"" + encodeDQString(details.type || _("article").translate()) + "\" />\r\n";
			meta += "<meta property=\"og:url\" content=\"" + SC.ENVIRONMENT.currentHostString + "\" />\r\n";
			if (details.image) {
				meta += "<meta property=\"og:image\" content=\"" + encodeDQString(details.image) + "\" />\r\n";
			}
			if (details.summary) {
				meta += "<meta property=\"og:description\" content=\"" + encodeDQString(_(details.summary).translate()) + "\" />\r\n";
			}
			meta += "<meta property=\"og:site_name\" content=\"" + Tools.getName() + "\" />\r\n";
			//meta+="<meta property=\"fb:admins\" content=\"Facebook numeric ID\" />\r\n";
			return meta;

		}

		function validateTime(value, valName, form) {
			if (!value || value.length == 0) {
				return _('Please select a time when you are available').translate();
			}
		}

		function getValue(name) { //get a value from localstorage if available

			if (typeof (Storage) !== "undefined") {
				return localStorage.getItem(name);
			}
		}

		function setValue(name, value) { //set a value in localstorage if available

			if (typeof (Storage) !== "undefined") {
				return localStorage.setItem(name, value);
			}
		}


		function brightenColor(color, percent) { //brighten a colour, percent is actualy a value from -1 to +1
			if (!color) {
				return color;
			}
			var f = parseInt(color.slice(1), 16),
				t = percent < 0 ? 0 : 255,
				p = percent < 0 ? percent * -1 : percent,
				R = f >> 16,
				G = f >> 8 & 0x00FF,
				B = f & 0x0000FF;
			return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
		}

		function resizeResponsiveColumns($el) { //make columns in rows the same height. $el is optional.
			var $rows;
			if ($el) {
				$rows = $el.find(".row");
			} else {
				$rows = $(".row");
			}

			$rows.each(function () { // Make bootstrap columns the same height.
				var LastOffset = -1,
					NewOffset;
				var FixedHeight = $(this).find(".fixedheight");
				var Data = [],
					HeightData;
				FixedHeight.each(function () {
					var Height = 0;
					$(this).find(".fixedheightbody").each(function () {
						Height += $(this).outerHeight(true);
					});

					if (Height > 0) {
						NewOffset = $(this).offset().left;

						//console.log("fixedheight "+Height+" "+$(this).text()+" "+NewOffset+" "+(NewOffset <= LastOffset));
						if (LastOffset == -1 || NewOffset <= LastOffset + 1) {
							HeightData = {
								MaxHeight: 0,
								Heights: [],
								Objects: []
							};
							Data.push(HeightData);
						}

						LastOffset = NewOffset;

						if (HeightData.MaxHeight < Height) {
							HeightData.MaxHeight = Height;
						}
						HeightData.Heights.push(Height);
						HeightData.Objects.push($(this));
					}
				});
				var $Spacers;
				for (var i = 0; i < Data.length; i++) {
					for (var j = 0; j < Data[i].Heights.length; j++) {
						$Spacers = Data[i].Objects[j].find(".fixedheightspacer")
						if ($Spacers.length > 0) {
							$Spacers.height((Data[i].MaxHeight - Data[i].Heights[j]) / $Spacers.length);
						}
					}
				}

			});
		}

		function getPhoneNumber() { //Check in contact us config for the current sites phone number
			var companies = Configuration.get("contactUs.companies");
			var sitecode = getSiteCode();

			for (var i = 0; i < companies.length; i++) {
				if (companies[i].sitecode == sitecode) {
					return companies[i].phone;
				}
			}
			if (companies.length == 0) {
				return "";
			} else {
				return companies[0].phone;
			}
		}

		function findWeekDay(date) { //Find the next week day
			var day = date.getDay();
			if (day == 6) {
				date.setDate(date.getDate() + 2);
			} else if (day == 0) {
				date.setDate(date.getDate() + 1);
			}
			return date;
		}

		//get delivery messages depending on which site it is.
		
		function getDeliveryMessage(){
			var site=getSiteCode();
			switch(site){
				case "IE":
				return _("For same day dispatch").translate();
			}
			return _("Next day to UK").translate();
		}

		function getDeliveryMessageTime(){
			var site=getSiteCode();
			switch(site){
				case "IE":
				return _("Order before 3:30pm").translate();
			}
			return _("Order before 5:30pm").translate();
		}

		// Make Tools module available globally
		var Tools = SC.Tools = {
			showErrorInModal: showErrorInModal,
			endsWith: endsWith,
			getSEO: getSEO,
			getName: getName,
			getTitle: getTitle,
			getInitials: getInitials,
			trim: trim,
			getSiteCode: getSiteCode,
			getSiteCountry: getSiteCountry,
			parseSearchResponse: parseSearchResponse,
			getHostList: getHostList,
			showSuccessInModal: showSuccessInModal,
			validateTime: validateTime,
			getNSCountryCode: getNSCountryCode,
			getValue: getValue,
			setValue: setValue,
			brightenColor: brightenColor,
			resizeResponsiveColumns: resizeResponsiveColumns,
			getPhoneNumber: getPhoneNumber,
			showItem: showItem,
			findWeekDay: findWeekDay,
			getDeliveryMessage:getDeliveryMessage,
			getDeliveryMessageTime:getDeliveryMessageTime,
			isLive:isLive
		}
		return Tools;
	});