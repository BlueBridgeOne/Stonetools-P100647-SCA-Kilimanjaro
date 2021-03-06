//@module Article - BB1 GTruslove Nov 2017 - Connect to article records.
define('Article', [],
	function() {
		return {
			getLanguageCode: function() { //Get the current language as a 2 char code.
				var language = SC.SESSION&&SC.SESSION.language;
				language = language ? language.locale.toLowerCase() : "en";
				switch (language) {
					case "fr":
					case "fr_fr":
						return "fr";
				}
				return "en";
			},
			getLanguage: function() { //Get the current language as a NS list value.
				var language = SC.SESSION&&SC.SESSION.language;
				language = language ? language.locale.toLowerCase() : "en_GB";
				switch (language) {
					case "fr":
					case "fr_fr":
						return 2;
				}
				return 1;
			},
			showSidebar: function(type) { //Should the sidebar be shown for this type
				switch (parseInt(type)) {
					case 0:
						return true;
					case -2:
						return true;
					case 29:
						return true;
					case 30:
						return true;
					case 31:
						return true;
					case 42:
						return true;
					case 43:
						return true;
					case 44:
						return true;
					case 45:
						return true;
					case 46:
						return true;
					case 32:
						return true;
				}
				return false;
			},
			getMainText: function(type) { //Get the title of this article type
				switch (parseInt(type)) {
					case 0:
						return "Search";
					case -1:
						return "Support";
					case -2:
						return "Resources";
					case -3:
						return "Working Together";
					case -4:
						return "Explore";
					case -5:
						return "Careers";
					case 1:
						return "Support";
					case 2:
						return "Support";
					case 3:
						return "Support";
					case 4:
						return "Support";
					case 5:
						return "Support";
					case 6:
						return "Support";
					case 26:
						return "Support";
					case 27:
						return "Support";
					case 28:
						return "Support";
					case 29:
						return "Resources";
					case 30:
						return "Resources";
					case 31:
						return "Resources";
					case 42:
						return "Resources";
					case 43:
						return "Resources";
					case 44:
						return "Resources";
					case 45:
						return "Resources";
					case 46:
						return "Resources";
					case 32:
						return "Resources";
					case 33:
						return "Working Together";
					case 34:
						return "Working Together";
					case 35:
						return "Explore";
					case 36:
						return "Explore";
					case 37:
						return "Explore";
					case 38:
						return "Explore";
					case 40:
						return "Careers";
					case 41:
						return "Careers";
					default:
						return "Other"; //39
				}
			},
			getMainType: function(type) { //Get the main type of this article type
				switch (parseInt(type)) {
					case 0:
						return 0;
					case -1:
						return -2;
					case -2:
						return -2;
					case -3:
						return -3;
					case -4:
						return -4;
					case -5:
						return -5;
					case 1:
						return -1;
					case 2:
						return -1;
					case 3:
						return -1;
					case 4:
						return -1;
					case 5:
						return -1;
					case 6:
						return -1;
					case 26:
						return -1;
					case 27:
						return -1;
					case 28:
						return -1;
					case 29:
						return -2;
					case 30:
						return -2;
					case 31:
						return -2;
					case 42:
						return -2;
					case 43:
						return -2;
					case 44:
						return -2;
					case 45:
						return -2;
					case 46:
						return -2;
					case 32:
						return -2;
					case 33:
						return -3;
					case 34:
						return -3;
					case 35:
						return -4;
					case 36:
						return -4;
					case 37:
						return -4;
					case 38:
						return -4;
					case 40:
						return -5;
					case 41:
						return -5;
					default:
						return 39;
				}
			},
			getFullTypeText: function(type) { //Get the full title of this article type
				var main = this.getMainText(type);
				var sub = this.getTypeText(type);
				if (sub) {
					return main + " - " + sub;
				} else {
					return main;
				}

			},
			getBannerText: function(type) { //Get the banner of this article type
				var main = this.getMainText(type);
				var sub = this.getTypeText(type);
				if (sub) {
					return sub;
				} else {
					return main;
				}

			},
			getTypeText: function(type) { //Get the title of this article type
				switch (parseInt(type)) {

					case 0:
						return "Search";
					case -1:
						return "Support";
					case -2:
						return "Resources";
					case -3:
						return "Working Together";
					case -4:
						return "Explore";
					case -5:
						return "Careers";
					case 1:
						return "Contact Stonetools";
					case 2:
						return "Delivery and Fulfilment";
					case 3:
						return "My Account";
					case 4:
						return "Ordering";
					case 5:
						return "Managing My Stock";
					case 6:
						return "Site Security";
					case 26:
						return "Warranty";
					case 27:
						return "Returns";
					case 28:
						return "Legal";
					case 29:
						return "Product Highlights";
					case 30:
						return "Reference";
					case 31:
						return "Troubleshooting";
					case 42:
						return "Health and Safety";
					case 43:
						return "Tools for my Industry";
					case 44:
						return "Tools for Stone Working Jobs";
					case 45:
						return "Tools for Different Stones";
					case 46:
						return "Maintaining Stone at Home";
					case 32:
						return "How To Guides";
					case 33:
						return "Key Benefits";
					case 34:
						return "Your Job Role";
					case 35:
						return "Stonetools Policies";
					case 36:
						return "Stonetools Brand";
					case 37:
						return "About Stonetools";
					case 38:
						return "The World of Stonetools";
					case 40:
						return "Working at Stonetools";
					case 41:
						return "Job Vacancy";
					default:
						return; //39
				}
			},
			getMainTypeBanner: function(type) { //Get the main banner of this article type
				switch (parseInt(type)) {
					case -1:
						return "banner-support.jpg";
					case -2:
						return "banner-resources.jpg";
					case -3:
						return "banner-working-together.jpg";
					case -4:
						return "banner-explore.jpg";
					case -5:
						return "banner-careers.jpg";
					case 1:
						return "banner-support.jpg";
					case 2:
						return "banner-support.jpg";
					case 3:
						return "banner-support.jpg";
					case 4:
						return "banner-support.jpg";
					case 5:
						return "banner-support.jpg";
					case 6:
						return "banner-support.jpg";
					case 26:
						return "banner-support.jpg";
					case 27:
						return "banner-support.jpg";
					case 28:
						return "banner-support.jpg";
					case 29:
						return "banner-resources.jpg";
					case 30:
						return "banner-resources.jpg";
					case 31:
						return "banner-resources.jpg";
					case 42:
						return "banner-resources.jpg";
					case 43:
						return "banner-resources.jpg";
					case 44:
						return "banner-resources.jpg";
					case 45:
						return "banner-resources.jpg";
					case 46:
						return "banner-resources.jpg";
					case 32:
						return "banner-resources.jpg";
					case 33:
						return "banner-working-together.jpg";
					case 34:
						return "banner-working-together.jpg";
					case 35:
						return "banner-explore.jpg";
					case 36:
						return "banner-explore.jpg";
					case 37:
						return "banner-explore.jpg";
					case 38:
						return "banner-explore.jpg";
					case 40:
						return; // "careers";
					case 41:
						return; // "careers";
					case 0:
						return "banner-search.jpg";
					default:
						return; //39
				}
			},
			getMainTypeUrl: function(type) { //Get the main url fragment of this article type
				switch (parseInt(type)) {
					case -1:
						return "support";
					case -2:
						return "resources";
					case -3:
						return "working-together";
					case -4:
						return "explore";
					case -5:
						return "careers";
					case 1:
						return "support";
					case 2:
						return "support";
					case 3:
						return "support";
					case 4:
						return "support";
					case 5:
						return "support";
					case 6:
						return "support";
					case 26:
						return "support";
					case 27:
						return "support";
					case 28:
						return "support";
					case 29:
						return "resources";
					case 30:
						return "resources";
					case 31:
						return "resources";
					case 42:
						return "resources";
					case 43:
						return "resources";
					case 44:
						return "resources";
					case 45:
						return "resources";
					case 46:
						return "resources";
					case 32:
						return "resources";
					case 33:
						return "working-together";
					case 34:
						return "working-together";
					case 35:
						return "explore";
					case 36:
						return "explore";
					case 37:
						return "explore";
					case 38:
						return "explore";
					case 40:
						return "careers";
					case 41:
						return "careers";
					default:
						return "other"; //39
				}
			},
			getTypeUrl: function(type) { //Get the url fragment of this article type
				switch (parseInt(type)) {
					case 1:
						return "contact-stonetools";
					case 2:
						return "delivery-and-fulfilment";
					case 3:
						return "my-account";
					case 4:
						return "ordering";
					case 5:
						return "managing-my-stock";
					case 6:
						return "site-security";
					case 26:
						return "warranty";
					case 27:
						return "returns";
					case 28:
						return "legal";
					case 29:
						return "product-highlights";
					case 30:
						return "reference";
					case 31:
						return "troubleshooting";
					case 42:
						return "health-and-safety";
					case 43:
						return "tools-for-my-industry";
					case 44:
						return "tools-for-stone-working-jobs";
					case 45:
						return "tools-for-different-stones";
					case 46:
						return "maintaining-stone-at-home";
					case 32:
						return "how-to-guides";
					case 33:
						return "key-benefits";
					case 34:
						return "your-job-role";
					case 35:
						return "stonetools-policies";
					case 36:
						return "stonetools-brand";
					case 37:
						return "about-stonetools";
					case 38:
						return "the-world-of-stonetools";
					case 40:
						return "working-at-stonetools";
					case 41:
						return "job-vacancy";
					default:
						return; //39
				}
			},
			getSectionTypes: function(type) { //Get the types available in this section
				switch (parseInt(type)) {
					case -1:
						return [1, 2, 3, 4, 5, 6, 26, 27, 28];
					case -2:
						return [29, 30, 31, 32, 42, 43, 44, 45, 46];
					case -3:
						return [33, 34];
					case -4:
						return [35, 36, 37, 38];
					case -5:
						return [40, 41];
					case 0:
						return;
					default:
						return [type];
				}
			},
			getSidebarTypes: function(type) { //Get the types available in the sidebar
				switch (parseInt(type)) {
					case -1:
						return [1, 2, 3, 4, 5, 6, 26, 27, 28];
					case -2:
						return [29, 30, 31, 32, 42, 43, 44, 45, 46];
					case -3:
						return [33, 34];
					case -4:
						return [35, 36, 37, 38];
					case -5:
						return [40, 41];

					case 1:
						return [1, 2, 3, 4, 5, 6, 26, 27, 28];
					case 2:
						return [1, 2, 3, 4, 5, 6, 26, 27, 28];
					case 3:
						return [1, 2, 3, 4, 5, 6, 26, 27, 28];
					case 4:
						return [1, 2, 3, 4, 5, 6, 26, 27, 28];
					case 5:
						return [1, 2, 3, 4, 5, 6, 26, 27, 28];
					case 6:
						return [1, 2, 3, 4, 5, 6, 26, 27, 28];
					case 26:
						return [1, 2, 3, 4, 5, 6, 26, 27, 28];
					case 27:
						return [1, 2, 3, 4, 5, 6, 26, 27, 28];
					case 28:
						return [1, 2, 3, 4, 5, 6, 26, 27, 28];

					case 29:
						return [29, 30, 31, 32, 42, 43, 44, 45, 46];
					case 30:
						return [29, 30, 31, 32, 42, 43, 44, 45, 46];
					case 31:
						return [29, 30, 31, 32, 42, 43, 44, 45, 46];
					case 32:
						return [29, 30, 31, 32, 42, 43, 44, 45, 46];
					case 42:
						return [29, 30, 31, 32, 42, 43, 44, 45, 46];

					case 43:
						return [29, 30, 31, 32, 42, 43, 44, 45, 46];
					case 44:
						return [29, 30, 31, 32, 42, 43, 44, 45, 46];
					case 45:
						return [29, 30, 31, 32, 42, 43, 44, 45, 46];
					case 46:
						return [29, 30, 31, 32, 42, 43, 44, 45, 46];
					case 33:
						return [33, 34];
					case 34:
						return [33, 34];

					case 35:
						return [35, 36, 37, 38];
					case 36:
						return [35, 36, 37, 38];
					case 37:
						return [35, 36, 37, 38];
					case 38:
						return [35, 36, 37, 38];

					case 39:
						return [39];
					case 40:
						return [40, 41];
					case 41:
						return [40, 41];

					default:
						return;
				}
			},
			getHref: function(type, url) { //Get the relative url of this article
				if (type == 0) {
					return undefined;
				}
				if (url && url.charAt(0) == "/") {
					return url;
				}
				var main = this.getMainTypeUrl(type);
				var sub = this.getTypeUrl(type);
				if (url) {
					if (sub) {
						return "/" + main + "/" + sub + "/" + url;
					} else {
						return "/" + main + "/" + url;
					}
				} else {
					if (sub) {
						return "/" + main + "/" + sub;
					} else {
						return "/" + main;
					}
				}
			},
			combineKeywords: function(content, keywordModel) { //Replace keywords in article with link, use intelligent search to match whole phrases and avoid tags.
				var fragment = "/" + Backbone.history.fragment,
					newhref;

				if (content) {
					//Get all the keywords from the model.
					var data;
					var index = -1;
					var keywords = [];
					do {
						index++;
						data = keywordModel.get(index);
						if (data) {
							keywords.push({ name: data.name.toLowerCase(), type: data.type, url: data.url });
						}
					} while (data);

					var char, charCode, InTag, InSQuote, InDQuote, lcase = "",
						body = "",
						next, nextIsLetter, previousIsLetter, nextCharCode, previousCharCode, k, anchor;
					for (var i = 0; i < content.length; i++) { //Go through the content and look for keyword matches. Allow for upper case, ignore html and don't allow 1/2 a word.
						char = content.charAt(i);
						charCode = content.charCodeAt(i);
						if (i < content.length - 1) {
							next = content.charAt(i + 1);
							nextCharCode = content.charCodeAt(i + 1);
							nextIsLetter = (nextCharCode >= 65 && nextCharCode <= 90) || (nextCharCode >= 97 && nextCharCode <= 122) || (nextCharCode >= 48 && nextCharCode <= 57); //The next char is a letter or number.
						} else {
							next = "";
							nextIsLetter = false;
						}
						switch (char) {
							case "<": //Open tag
								if (!InTag) {
									InTag = true;
								}
								body += char;
								lcase = "";
								break;
							case ">": //Close tag
								if (InTag && !InSQuote && !InDQuote) {
									InTag = false;
								}
								body += char;
								break;
							case "\\": //Skip escaped characters
								if ((InSQuote || InDQuote) && (next == "\"" || next == "'")) {
									body += char;
									body += next;
									i++;
								} else {
									body += char;
									if (!InTag) {
										lcase += char.toLowerCase();
									}
								}
								break;
							case "\"":
								if (InTag) {
									if (InSQuote) {} else if (InDQuote) {
										InDQuote = false;
									} else {
										InDQuote = true;
									}
									body += char;
								} else {
									body += char;
									lcase += char.toLowerCase();
								}
								break;
							case "'":
								if (InTag) {
									if (InSQuote) { InSQuote = false; } else if (InDQuote) {} else {
										InSQuote = true;
									}
									body += char;
								} else {
									body += char;
									lcase += char.toLowerCase();
								}
								break;
							default:
								body += char;
								if (!InTag) {
									lcase += char.toLowerCase();
								}
								break;
						}
						if (!InTag && !nextIsLetter && lcase.length > 0) {
							//It's the end of a word, not in a tag so see if the last characters match any keywords or phrases

							for (var j = 0; j < keywords.length; j++) {
								//console.log(lcase+"=="+ keywords[j]);
								if (SC.Tools.endsWith(lcase, keywords[j].name)) {
									//A match! but first check for whole words.

									k = lcase.length - keywords[j].length - 1;
									if (k < 0) {
										previousCharCode = content.charCodeAt(k);
										previousIsLetter = (previousCharCode >= 65 && previousCharCode <= 90) || (previousCharCode >= 97 && previousCharCode <= 122) || (previousCharCode >= 48 && previousCharCode <= 57); //The previous char is a letter or number.
									} else {
										previousIsLetter = false;
									}
									if (!previousIsLetter) { //Must be a match!!!
										//console.log("Match Keyword: " + keywords[j].name);
										//Insert anchor into body.
										anchor = body.substring(body.length - keywords[j].name.length);
										body = body.substring(0, body.length - keywords[j].name.length);
										newhref = this.getHref(keywords[j].type, keywords[j].url);
										//console.log("match " + newhref);
										if (newhref == fragment) { //Already on that page.
											body += anchor;
										} else {
											body += "<a class=\"article-keyword\" href=\"" + this.getHref(keywords[j].type, keywords[j].url) + "\" title=\""+_('Learn More...').translate()+"\">" + anchor + "</a>";
										}
									}

								}
							}
						}
					}
					content = body;
				}
				//console.log("body:" + body);
				return content;
			}
		}
	}
);