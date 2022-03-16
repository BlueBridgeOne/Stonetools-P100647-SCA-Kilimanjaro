/**
 * Project: P100647
 *
 * Update blanks fields on an item, that are needed for the web. e.g. store display name, search text, meta tags,title etc.
 * 
 * Find all relevant download files in the web site downloads folder. Files must start with the item id. 
 *
 * Date			Author			Purpose		
 * 23 Nov 2017	Gordon Truslove	Initial release
 *
 * Copyright (c) 2017 BlueBridge One Business Solutions, All Rights Reserved
 * support@bluebridgeone.com, +44 (0)1932 300007
 *
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/runtime', 'N/file'],

	function (record, search, runtime, file) {


		/**
		 * Function definition to be triggered before record is loaded.
		 *
		 * @param {Object} scriptContext
		 * @param {Record} scriptContext.newRecord - New record
		 * @param {Record} scriptContext.oldRecord - Old record
		 * @param {string} scriptContext.type - Trigger type
		 * @Since 2015.2
		 */
		function beforeSubmit(scriptContext) {

			if (scriptContext.type == scriptContext.UserEventType.DELETE) {

				return;
			}
			try {

				var R = scriptContext.newRecord;
				log.debug("Update Item Fields", "ID=" + R.id + ".");

				var parent = R.getValue({
					fieldId: 'parent'
				});

				//check for images

				var custitem_bb1_gpfu_scaimageurl = R.getValue({
					fieldId: 'custitem_bb1_gpfu_scaimageurl'
				});
				if (!custitem_bb1_gpfu_scaimageurl) {
					var imageR = R;
					if(parent){
						imageR=record.load({type:R.type,id:parent});
					}

					var numImages = imageR.getLineCount({
						sublistId: 'itemimages'
					});
					R.setValue({
						fieldId: 'custitem_bb1_has_sca_image',
						value: numImages > 0,
						ignoreFieldChange: true
					});
					if (numImages) {


						var nkey, fileObject;
						for (var i = 0; i < numImages; i++) {
							nkey = imageR.getSublistValue({ sublistId: "itemimages", fieldId: "nkey", line: i });
							if (nkey) {
								fileObject = file.load({ id: nkey });
								R.setValue({ fieldId: "custitem_bb1_gpfu_scaimageurl", value: "https://www.stonetools.co.uk" + fileObject.url });
								break;
							}
						}
					}
				}
				//check next delivery time:

				var leadtime = R.getValue({
					fieldId: 'leadtime'
				});

				var haschildren = R.getValue({
					fieldId: 'haschildren'
				}) == "T";

				if (haschildren) { //Set the lead times in a JSON object.
					//log.debug("Get Lead Times", R.type + " " + R.id);
					var changeddates = false;


					var custitem_bb1_sca_childrennextdelivery = R.getValue({
						fieldId: 'custitem_bb1_sca_childrennextdelivery'
					}) || "{}";
					var datelist = JSON.parse(custitem_bb1_sca_childrennextdelivery);

					//log.debug("custitem_bb1_sca_childrennextdelivery", custitem_bb1_sca_childrennextdelivery);


					var itemSearchObj = search.create({
						type: "item",
						filters: [
							["parent", "anyof", R.id]
						],
						columns: [
							search.createColumn({
								name: "leadtime"
							})
						]
					});
					var newLeadTime;
					itemSearchObj.run().each(function (result) {
						// .run().each has a limit of 4,000 results
						//log.debug("child", result.id + " " + result.getValue("leadtime"));
						newLeadTime = result.getValue("leadtime") || leadtime;
						if (newLeadTime > 0) {
							if (datelist[result.id]) {
								if (datelist[result.id].leadtime != newLeadTime) {
									datelist[result.id].leadtime = newLeadTime;
									changeddates = true;
								}
							} else {
								changeddates = true;
								datelist[result.id] = {
									leadtime: newLeadTime
								};
							}
						}
						return true;
					});


					if (changeddates) {
						log.debug("children next delivery", datelist);

						R.setValue({
							fieldId: 'custitem_bb1_sca_childrennextdelivery',
							value: JSON.stringify(datelist)
						});

					}
				}


				//			var custitem_cseg_bb1_website_se = R.getText({
				//				fieldId : 'custitem_cseg_bb1_website_se'
				//			});
				//log.debug("custitem_cseg_bb1_website_se", "Test '"+JSON.stringify(custitem_cseg_bb1_website_se)+" "+custitem_cseg_bb1_website_se.length+"'.");
				//			if(!custitem_cseg_bb1_website_se||custitem_cseg_bb1_website_se.length<1||custitem_cseg_bb1_website_se[0].length<=1){
				//				//log.debug("custitem_cseg_bb1_website_se", "Set to Any "+custitem_cseg_bb1_website_se+".");
				//				R.setText({
				//					fieldId : 'custitem_cseg_bb1_website_se',
				//					text:["Any"]
				//				});	
				//			}else if(custitem_cseg_bb1_website_se.length==1&&custitem_cseg_bb1_website_se[0]=="Any"){
				//				//log.debug("custitem_cseg_bb1_website_se", "Force to Any "+custitem_cseg_bb1_website_se+".");
				//				R.setText({
				//					fieldId : 'custitem_cseg_bb1_website_se',
				//					text:JSON.parse(JSON.stringify(custitem_cseg_bb1_website_se))
				//				});	
				//			}

				var user = runtime.getCurrentUser();

				var CorrectLang = user.getPreference("LANGUAGE") == "en_GB";
				if (!CorrectLang) { //Some basic checks.

					log.debug("Update Item Fields", "Failed, wrong language '" + user.getPreference("LANGUAGE") + "'.");
					return;
				}




				var isonline = R.getValue({
					fieldId: 'isonline'
				});
				var chapter = R.getText({
					fieldId: 'class'
				});
				var category = R.getText({
					fieldId: 'custitem_cseg1'
				});
				var matrix = R.getValue({
					fieldId: 'matrixitemnametemplate'
				});
				matrix = matrix && matrix.length > 0;

				var matrixchild = false;

				var parent = R.getValue({
					fieldId: 'parent'
				});
				if (parent) {
					var fieldLookUp = search.lookupFields({
						type: R.type,
						id: parent,
						columns: ['matrix']
					});
					//log.debug("Testing", "Is Parent Matrix? " + fieldLookUp.matrix);
					if (fieldLookUp.matrix) {
						matrixchild = true;
					}
				}
				if (!isonline) {

					//				if ((haschildren && matrix) || matrixchild || (!haschildren && !matrix)) { //TEMP
					//					R.setValue({
					//						fieldId : 'isonline',
					//						value : true
					//					});
					//					return;
					//				}
					if (chapter && category) {

						var catRecord = getCategoryRecord(chapter, category);
						var itemLine = findItemInCat(catRecord, R.id);
						if (itemLine > -1) {
							removeItemFromCat(catRecord, itemLine);
							try {
								catRecord.save();
							} catch (err) {
								log.debug("Save Cat", "ERROR! Unable to save category. " + category);
								retrySave(catRecord);
								//catRecord.save();

							}
						}
					}
					R.setValue({
						fieldId: 'urlcomponent',
						value: ""
					});


				} else {

					if (matrixchild) {
						return;
					}
					var user = runtime.getCurrentUser();

					//log.debug("Testing", "Update Item " + R.id + " user=" + user.name + " " + user.id + " matrix=" + matrix + " child=" + matrixchild);

					var brand = R.getText({
						fieldId: 'custitem15'
					});

					//check for category item?? Weird thing that Allan did, some items have normal children.
					if (haschildren && !matrix) {
						log.debug("Testing", "Should not be on the web store. " + R.id + " haschildren=" + haschildren + " matrix=" + matrix);
						if (brand) {
							var catRecord = getCategoryRecord("Brands", brand);
							var itemLine = findItemInCat(catRecord, R.id);
							if (itemLine > -1) {
								removeItemFromCat(catRecord, itemLine);
								catRecord.save();
							}
						}
						if (chapter && category) {

							var catRecord = getCategoryRecord(chapter, category);
							var itemLine = findItemInCat(catRecord, R.id);
							if (itemLine > -1) {
								removeItemFromCat(catRecord, itemLine);
								try {
									catRecord.save();
								} catch (err) {
									log.debug("Save Cat", "ERROR! Unable to save category. " + category);
									retrySave(catRecord);
									//catRecord.save();
								}
							}
						}
						R.setValue({
							fieldId: 'isonline',
							value: false
						});
						R.setValue({
							fieldId: 'urlcomponent',
							value: ""
						});


						return;
					}


					if (matrix) {
						//Keep this handy bit of code.
						var itemoptions = R.getValue({
							fieldId: 'itemoptions'
						});
						if (!itemoptions || itemoptions.length == 0) {
							itemoptions = [];
							log.debug("itemoptions", "Calculate item options");
							var value;
							var facets = ["custitem_bb1_voltage", "custitem_bb1_size", "custitem_bb1_colour", "custitem_bb1_grit", "custitem_bb1_position", "custitem_bb1_kind", "custitem_bb1_diameter", "custitem_bb1_fitting", "custitem_bb1_height", "custitem_bb1_length", "custitem_bb1_machine", "custitem_bb1_pack_size", "custitem_bb1_profile", "custitem_bb1_radius", "custitem_bb1_segments", "custitem_bb1_thickness", "custitem_bb1_thread_direction", "custitem_bb1_width", "custitem_bb1_working_length"];
							for (var i = 0; i < facets.length; i++) {
								value = R.getValue({
									fieldId: facets[i]
								});
								if (value && value.length > 0) {
									log.debug(facets[i], value);
									itemoptions.push(facets[i].replace("custitem", "custcol").toUpperCase());
								}
							}
							if (itemoptions.length > 0) {
								log.debug("itemoptions", JSON.stringify(itemoptions));
								R.setValue({
									fieldId: 'itemoptions',
									value: itemoptions,
									ignoreFieldChange: true
								});
							}
						}
					}
					var storedisplayname = R.getValue({
						fieldId: 'storedisplayname'
					});
					var displayname = R.getValue({
						fieldId: 'displayname'
					});
					var pagetitle = R.getValue({
						fieldId: 'pagetitle'
					});
					var itemid = R.getValue({
						fieldId: 'itemid'
					});
					var storedescription = R.getValue({
						fieldId: 'storedescription'
					});
					var urlcomponent = R.getValue({
						fieldId: 'urlcomponent'
					});
					var searchkeywords = R.getValue({
						fieldId: 'searchkeywords'
					});

					var extrasearchkeywords = R.getValue({
						fieldId: 'custitem_bb1_sca_extra_search_kw'
					});

					if (!storedisplayname && displayname) {
						R.setValue({
							fieldId: 'storedisplayname',
							value: displayname
						});
					}

					if (!pagetitle && displayname) {
						R.setValue({
							fieldId: 'pagetitle',
							value: displayname + " | Stonetools Ltd"
						});
					}
					if (!storedescription && displayname) {
						R.setValue({
							fieldId: 'storedescription',
							value: itemid + ", " + displayname
						});

					}
					if (!urlcomponent || urlcomponent.length == 0) {
						var newurlcomponent = getUrlFragment(displayname);
						R.setValue({
							fieldId: 'urlcomponent',
							value: newurlcomponent
						});
					}
					if (brand) { //create brand categories
						//Create categories (Chapter > Category > Item)
						var catRecord = getCategoryRecord("Brands", brand);
						var itemLine = findItemInCat(catRecord, R.id);
						if (itemLine == -1) {
							addItemToCat(catRecord, R.id, false);
							try {
								catRecord.save();
							} catch (err) {
								log.debug("Save Cat", "ERROR! Unable to save category. " + brand);
								retrySave(catRecord);
								//catRecord.save();
							}
						}
					}

					if (chapter && category) {

						var keywords = chapter + "," + category + "," + itemid + "," + displayname;
						if (extrasearchkeywords && extrasearchkeywords.length > 0) {
							keywords += "," + extrasearchkeywords;
						}
						if (searchkeywords != keywords) {
							R.setValue({
								fieldId: 'searchkeywords',
								value: keywords
							});
							//log.debug("keywords", "keywords=" + keywords + " = " + searchkeywords);
						}

						//Create categories (Chapter > Category > Item)
						var catRecord = getCategoryRecord(chapter, category);
						var itemLine = findItemInCat(catRecord, R.id);
						if (itemLine == -1) {
							addItemToCat(catRecord, R.id, true);
							try {
								catRecord.save();
							} catch (err) {
								log.debug("Save Cat", "ERROR! Unable to save category. " + category);
								retrySave(catRecord);
								//catRecord.save();
							}
						}
					}
					//Additional Category fields.



					var OldCats = [],
						NewCats = R.getValue({
							fieldId: 'custitem_bb1_sca_addcommcat'
						});

					var OldR = scriptContext.oldRecord;

					if (OldR) {
						OldCats = OldR.getValue({
							fieldId: 'custitem_bb1_sca_addcommcat'
						});
					} else {
						OldCats = [];
					}

					//log.debug("Update Cats 1", JSON.stringify(OldCats)+" "+JSON.stringify(NewCats));

					NewCats = NewCats.join(",").split(",");
					if (OldCats) {
						OldCats = OldCats.join(",").split(",");
					} else {
						OldCats = [];
					}

					for (var i = OldCats.length - 1; i >= 0; i--) {
						for (var j = NewCats.length - 1; j >= 0; j--) {
							if (NewCats[j] == OldCats[i]) {
								NewCats.splice(j, 1);
								OldCats.splice(i, 1);
							}
						}
					}


					//log.debug("Add Cats",OldCats.join(',')+" "+NewCats.join(','));

					//Add additional cats

					for (var k = 0; k < NewCats.length; k++) {
						if (NewCats[k].length > 0) {
							var catRecord = record.load({
								type: "commercecategory",
								id: NewCats[k],
								isDynamic: true
							});
							var itemLine = findItemInCat(catRecord, R.id);
							if (itemLine == -1) {
								log.debug("Add Cat", NewCats[k]);
								addItemToCat(catRecord, R.id, false);
								try {
									catRecord.save();
								} catch (err) {
									log.debug("Save Cat", "ERROR! Unable to save category. " + NewCats[k] + " " + err);
									retrySave(catRecord);
									//catRecord.save();
								}
							}
						}
					}
					//Remove old additional cats
					for (var k = 0; k < OldCats.length; k++) {
						if (OldCats[k].length > 0) {
							var catRecord = record.load({
								type: "commercecategory",
								id: OldCats[k],
								isDynamic: true
							});
							var itemLine = findItemInCat(catRecord, R.id);
							if (itemLine != -1) {
								log.debug("Remove Cat", OldCats[k]);
								removeItemFromCat(catRecord, itemLine);
								try {
									catRecord.save();
								} catch (err) {
									log.debug("Save Cat", "ERROR! Unable to save category. " + OldCats[k] + " " + err);
									retrySave(catRecord);
									//catRecord.save();
								}
							}
						}
					}
					//Update downloads
					updateDownloads(scriptContext);
				}
			} catch (err) {
				log.error("Unable to update items", err);
			}
			//Find all relevant download files in the web site downloads folder. Files must start with the item id.
			//custscript_bb1_sca_downloadsfolder

		}

		function getFiles(parent) {
			var files = [];
			var filters = [];
			var cols = [];

			filters.push(['folder', 'is', parent]);
			cols.push(search.createColumn({
				name: 'name'
			}));

			var searchResults = search.create({
				type: 'file',
				columns: cols,
				filters: filters
			});
			searchResults.run().each(function (result) {
				//log.debug("Search", "Result: " + result.id + " " + result.getValue("name"));
				files.push({
					id: result.id,
					name: result.getValue("name")
				})
				return true;
			});
			return files;
		}

		function getUrlFragment(name) {

			var body = "",
				charCode, char, lastDash;
			name = name.toLowerCase();
			for (var i = 0; i < name.length; i++) {
				charCode = name.charCodeAt(i);
				char = name.charAt(i);
				if (char == "-" || char == " ") {
					if (!lastDash) {
						body += "-";
					}
					lastDash = true;
				} else if ((charCode >= 97 && charCode <= 122) || char == "_" || (charCode >= 48 && charCode <= 57)) {
					body += char;
					lastDash = false;
				}
			}
			return body;

		}

		function removeItemFromCat(catRecord, line) { //Remove an item from a category
			log.debug("Item", "Remove Line " + line);

			catRecord.removeLine({
				sublistId: 'items',
				line: line,
				ignoreRecalc: true
			});
		}

		function retrySave(rec) { //Try saving again, could be a conflict

			var a = 0;
			for (var i = 0; i < 100000; i++) {
				a += 1;
			}
			try {
				rec.save();
				log.debug("Save Cat", "Worked second time.... for some reason.");
			} catch (err) {
				log.debug("Save Cat", "ERROR! Failed to save for second time.");
			}
		}

		function addItemToCat(catRecord, id, primary) { //Add an item to a category
			log.debug("Item", "Add Item " + id);
			var lineNum = catRecord.selectNewLine({
				sublistId: 'items'
			});
			catRecord.setCurrentSublistValue({
				sublistId: 'items',
				fieldId: 'item',
				value: id,
				ignoreFieldChange: true
			});
			if (primary) {
				catRecord.setCurrentSublistValue({
					sublistId: 'items',
					fieldId: 'primarycategory',
					value: true,
					ignoreFieldChange: true
				});
			}
			catRecord.commitLine({
				sublistId: 'items'
			});
		}

		function findItemInCat(catRecord, id) { //Find the line number of an item in a category.
			var numLines = catRecord.getLineCount({
				sublistId: 'items'
			});

			var lineItem;
			for (var i = 0; i < numLines; i++) {
				lineItem = catRecord.getSublistValue({
					sublistId: 'items',
					fieldId: 'item',
					line: i
				});
				if (lineItem == id) {
					return i;
				}
			}
			return -1;
		}

		function getCategoryRecord(ParentCat, ChildCat) { //Create a parent and child category.
			//Create categories (Chapter > Category > Item)
			var filters = [];
			var cols = [];
			//Look for chapter
			filters.push(['isinactive', 'is', 'F']);
			filters.push('AND');
			filters.push(['name', 'is', ParentCat]);
			filters.push('AND');
			filters.push(['primaryparent', 'is', '@NONE@']);

			cols.push(search.createColumn({
				name: 'name'
			}));
			var searchResults = search.create({
				type: "commercecategory",
				columns: cols,
				filters: filters
			});
			var chapterid;

			searchResults.run().each(function (result) {
				chapterid = result.id;
				return false;
			});

			if (!chapterid) { //Create chapter cat
				log.debug("Chapter", "Create Category " + ParentCat);
				var chapterRec = record.create({
					type: "commercecategory",
					isDynamic: true
				});
				chapterRec.setValue({
					fieldId: 'name',
					value: ParentCat,
					ignoreFieldChange: true
				});
				chapterRec.setValue({
					fieldId: 'pagetitle',
					value: ParentCat,
					ignoreFieldChange: true
				});
				chapterRec.setValue({
					fieldId: 'catalog',
					value: 1,
					ignoreFieldChange: true
				});
				chapterRec.setValue({
					fieldId: 'urlfragment',
					value: getUrlFragment(ParentCat),
					ignoreFieldChange: true
				});
				chapterid = chapterRec.save();

			}

			//Look for category in chapter

			filters = [];
			cols = [];
			//Look for chapter
			filters.push(['isinactive', 'is', 'F']);
			filters.push('AND');
			filters.push(['name', 'is', ChildCat]);
			filters.push('AND');
			filters.push(['primaryparent', 'is', chapterid]);

			cols.push(search.createColumn({
				name: 'name'
			}));
			searchResults = search.create({
				type: "commercecategory",
				columns: cols,
				filters: filters
			});
			var categoryid;

			searchResults.run().each(function (result) {
				categoryid = result.id;
				return false;
			});

			if (!categoryid) { //Create category cat
				log.debug("Category", "Create Category " + ChildCat);
				var categoryRec = record.create({
					type: "commercecategory",
					isDynamic: true
				});
				categoryRec.setValue({
					fieldId: 'name',
					value: ChildCat,
					ignoreFieldChange: true
				});
				categoryRec.setValue({
					fieldId: 'pagetitle',
					value: ParentCat + " | " + ChildCat,
					ignoreFieldChange: true
				});
				categoryRec.setValue({
					fieldId: 'catalog',
					value: 1,
					ignoreFieldChange: true
				});
				categoryRec.setValue({
					fieldId: 'primaryparent',
					value: chapterid,
					ignoreFieldChange: true
				});
				categoryRec.setValue({
					fieldId: 'urlfragment',
					value: getUrlFragment(ChildCat),
					ignoreFieldChange: true
				});

				categoryid = categoryRec.save();
			}
			//Check for item
			//
			var catRecord = record.load({
				type: "commercecategory",
				id: categoryid,
				isDynamic: true
			});
			//log.debug("Found Category", ParentCat + " | " + ChildCat);
			return catRecord;
		}

		function updateDownloads(scriptContext) {

			var currentRecord = scriptContext.newRecord;
			var isonline = currentRecord.getValue({
				fieldId: 'isonline'
			});

			if (isonline) { // &&!parent TEMP, move into if
				var itemid = currentRecord.getValue({
					fieldId: 'itemid'
				});
				if (itemid && itemid.length > 0) {
					//search for downloadable files.
					var folderSearchObj = search.create({
						type: "file",
						filters: [
							['folder', 'is', 20742], 'AND', ["name", "contains", "_" + itemid + "_"]
						],
						columns: [search.createColumn({
							name: "name"
						}), search.createColumn({
							name: "url"
						}), search.createColumn({
							name: "folder"
						})]
					});
					//log.debug("Search for Downloads", "_" + itemid + "_");
					var downloads = "",
						count = 0;
					folderSearchObj.run().each(function (result) {
						// .run().each has a limit of 4,000 results
						if (result.getValue("name").indexOf("_" + itemid + "_") > -1) {
							if (downloads.length > 0) {
								downloads += ",";
							}
							//log.debug("Found Download", result.getText("folder") + " ? " + result.getValue("name"));
							//downloads += result.getValue("name") + "," + result.getValue("url");
							downloads += "/documents/" + result.getText("folder") + "/" + result.getValue("name");
							count++;
						}
						return true;
					});

					var currentdownloads = currentRecord.getValue({
						fieldId: 'custitem_bb1_sca_downloads'
					});
					var currentdownloaddata = currentRecord.getValue({
						fieldId: 'custitem_bb1_sca_downloaddata'
					});
					var downloadText = "";
					if (count > 0) {
						downloadText = count + " documents found.";
					}
					if (downloads) {
						downloads = downloads.split("/documents/products").join("{f}");
						while (downloads.length > 3999) {
							var Q = downloads.lastIndexOf(',');
							downloads = downloads.substring(0, Q);
						}
					}
					if (currentdownloaddata != downloads || currentdownloads != downloadText) {
						//log.debug("Begin Update Downloads", downloads.length + " " + downloadText + " " + downloads + " " + currentRecord.type);
						try {
							currentRecord.setValue({
								fieldId: 'custitem_bb1_sca_downloaddata',
								value: downloads,
								ignoreFieldChange: true
							});
							currentRecord.setValue({
								fieldId: 'custitem_bb1_sca_downloads',
								value: downloadText,
								ignoreFieldChange: true
							});
							log.debug("Downloads Updated", downloads.length + " " + downloadText);
						} catch (err) {
							log.error("Unable to update item", "Error: " + err);
						}
					} else {
						//log.debug("Downloads", "Downloads are already up to date.");
					}
				}
			}

		}

		return {
			beforeSubmit: beforeSubmit
		};

	});