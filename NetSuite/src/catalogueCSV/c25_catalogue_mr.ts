/**
 * Description : Generate a CSV file for a catalogue.
 * 
 * @Author : Gordon Truslove - code25.com
 * @Date   : 2/23/2022, 1:43:01 PM
 * 
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
/// <reference path="../suitescript.ts" />

define(['N/record', 'N/search', 'N/runtime', 'N/file'],

	function (record: iRecord, search: iSearch, runtime: iRuntime, file: iFile) {


		let facets: any[] = [
			{ id: "custitem_bb1_colour", label: "Colour" },
			{ id: "custitem_bb1_voltage", label: "Voltage" },
			{ id: "custitem_bb1_size", label: "Size" },
			{ id: "custitem_bb1_grit", label: "Grit" },
			{ id: "custitem_bb1_position", label: "Position" },
			{ id: "custitem_bb1_kind", label: "Kind" },
			{ id: "custitem_bb1_diameter", label: "Diameter" },
			{ id: "custitem_bb1_fitting", label: "Fitting" },
			{ id: "custitem_bb1_height", label: "Height" },
			{ id: "custitem_bb1_length", label: "Length" },
			{ id: "custitem_bb1_machine", label: "Machine" },
			{ id: "custitem_bb1_pack_size", label: "Pack Size" },
			{ id: "custitem_bb1_profile", label: "Profile" },
			{ id: "custitem_bb1_radius", label: "Radius" },
			{ id: "custitem_bb1_segments", label: "Segments" },
			{ id: "custitem_bb1_thickness", label: "Thickness" },
			{ id: "custitem_bb1_thread_direction", label: "Thread Direction" },
			{ id: "custitem_bb1_width", label: "Width" },
			{ id: "custitem_bb1_working_length", label: "Working Length" }

		];

		/**
		 * Marks the beginning of the Map/Reduce process and generates input data.
		 *
		 * @typedef {Object} ObjectRef
		 * @property {number} id - Internal ID of the record instance
		 * @property {string} type - Record type id
		 *
		 * @return {Array|Object|Search|RecordRef} inputSummary
		 * @since 2015.1
		 */
		function getInputData(): iRecordSearch {
			try {
				log.debug("Map Reduce", "Start");
				let custscript_c25_catalogue_catalogue: string = runtime.getCurrentScript().getParameter({
					name: 'custscript_c25_catalogue_catalogue'
				});

				let columns: iColumn[] = [
					search.createColumn({
						name: "itemid"
					}),
					search.createColumn({ name: "displayname" }),
					search.createColumn({ name: "type" }),
					search.createColumn({ name: "itemid" }),
					search.createColumn({ name: "baseprice" }),
					search.createColumn({ name: "onlineprice" }),
					search.createColumn({ name: "custitem_c25_cataloguelayout" }),
					search.createColumn({ name: "custitem_c25_cataloguedesc" }),
					search.createColumn({ name: "commercecategoryname", sort: "ASC" }),
					search.createColumn({ name: "commercecategoryisprimary" }),
					search.createColumn({ name: "storedetaileddescription" }),
					search.createColumn({ name: "commercecategoryid" }),
					search.createColumn({ name: "matrix" }),
					search.createColumn({ name: "custitem_bb1_sca_features_en" }),
					search.createColumn({ name: "custitem_bb1_sca_instructions_en" }),
					search.createColumn({ name: "custitem_bb1_sca_included_en" }),
					search.createColumn({ name: "custitem_bb1_sca_techspecs_en" }),
					search.createColumn({ name: "custitem_bb1_sca_safety_en" }),
					search.createColumn({ name: "custitem_bb1_sca_recommended_en" }),
					search.createColumn({ name: "urlcomponent" })


				];

				for (let i: number = 0; i < facets.length; i++) {

					columns.push(search.createColumn({ name: facets[i].id }));
				}
				var itemSearchObj = search.create({
					type: "item",
					filters:
						[
							["custitem_c25_cataloguedisplay", "anyof", custscript_c25_catalogue_catalogue],
							"AND",
							["parent", "anyof", "@NONE@"],
							"AND",
							["commercecategoryisprimary", "is", "T"],
							"AND",
							["isinactive", "is", "F"]
						],
					columns: columns
				});
				return itemSearchObj;

			} catch (err) {
				log.debug("getInputData Error", err);
				return;
			}
		}

		function getText(value: any): string {
			if (value && value.text) {
				return value.text;
			}
			return value;
		}
		function getSku(value: any): string {
			if (value) {
				let parts: string[] = value.split(" : ");
				return parts[parts.length - 1];
			}
			return value;
		}
		function getPrice(value: any): string {
			if (value) {

				return "£" + value;
			}
			return value;
		}
		function cleanHTML(html: string): string {
			if (html) {
				html = html.split("<p>").join("");
				html = html.split("</p>").join("");
				html = html.split("&nbsp;").join(" ");
				html = html.split("&amp;").join("&");
				html = html.split("&quot;").join("\"");
				html = html.split("&lt;").join("<");
				html = html.split("&gt;").join(">");
				html = html.split("<li>").join("• ");
				html = html.split("</li>").join("\r\n");
				html = html.split("<ul>").join("");
				html = html.split("</ul>").join("\r\n");
				html = html.split("<h3>").join("");
				html = html.split("</h3>").join("\r\n");
				html = html.split("<h4>").join("");
				html = html.split("</h4>").join("\r\n");
				html = html.split("<h5>").join("");
				html = html.split("</h5>").join("\r\n");
				html = html.split("<br>").join("\r\n");
				html = html.split("<br/>").join("\r\n");
				html = html.split("<BR>").join("\r\n");
				html = html.split("\r\n\r\n• ").join("\r\n• ");
				html = html.split("\r\n\r\n\r\n").join("\r\n\r\n");
			}
			return html;
		}
		function CSVString(text: string): string {
			text = (text || "").toString().trim();
			text = text.split("\n").join(" ");
			text = text.split("\r").join(" ");
			text = text.split("  ").join(" ");
			if (text.indexOf("\"") > -1) {
				text = text.split("\"").join("\"\"");
				text = "\"" + text + "\"";
			} else if (text.indexOf(",") > -1) {
				text = "\"" + text + "\"";
			}
			return text;
		}
		function XMLString(text: string): string {
			text = (text || "").toString().trim();
			text = text.split("&").join("&amp;");
			text = text.split("<").join("&lt;");
			text = text.split(">").join("&gt;");
			text = text.split("\"").join("&quot;");
			text = text.split("'").join("&apos;");

			return text;
		}
		function addCommas(length: number): string {
			let body: string = "";
			for (let i: number = 0; i < length; i++) {
				body += ",";
			}
			return body;
		}
		function getImageUrl(id: string): string {
			let imageObj: iFileObject = file.load({ id: id });
			return "./images/" + imageObj.name;
		}
		function getImages(type: string, id: string): any[] {
			let images: any[] = [];
			let imageR: iDataRecord = record.load({ type: type, id: id });


			var numImages = imageR.getLineCount({
				sublistId: 'itemimages'
			});

			if (numImages > 0) {


				let nkey: string, fileObject: iFileObject;
				for (var i = 0; i < numImages; i++) {
					nkey = imageR.getSublistValue({ sublistId: "itemimages", fieldId: "nkey", line: i });
					if (nkey) {
						fileObject = file.load({ id: nkey });
						images.push({ url: "./images/" + fileObject.name, name: fileObject.name });
					}
				}

			}


			return images;
		}
		function filterImages(images: any[], line: any, result: iSearchResult): any[] {

			if (images.length == 0) {
				return images;
			}
			let newImages: any[] = [], urlL: string, newScores: number[] = [];
			for (let i: number = 0; i < images.length; i++) {
				urlL = images[i].name.toLowerCase();
				newImages.push(images[i]);
				newScores.push(0);
				if (line.optionid1 && urlL.indexOf(result.getText(line.optionid1).toLowerCase()) > -1) {

					newScores[i]++;
				}
				if (line.optionid2 && urlL.indexOf(result.getText(line.optionid2).toLowerCase()) > -1) {
					newScores[i]++;
				}
				if (line.optionid3 && urlL.indexOf(result.getText(line.optionid3).toLowerCase()) > -1) {
					newScores[i]++;
				}
			}
			//log.debug("scores",JSON.stringify(newScores));
			let change: boolean = false, swap: any;
			do {
				for (let i = 0; i < newScores.length - 1; i++) {
					if (newScores[i] < newScores[i + 1]) {
						swap = newScores[i];
						newScores[i] = newScores[i + 1];
						newScores[i + 1] = swap;

						swap = newImages[i];
						newImages[i] = newImages[i + 1];
						newImages[i + 1] = swap;

					}
				}
			} while (change);

			while (newScores[0] == 0) {
				newImages.pop();
				newScores.pop();
			}
			while (newImages.length > 3) {
				newImages.pop();
				newScores.pop();
			}
			if (newScores[2] < newScores[1]) {
				newImages.pop();
				newScores.pop();
			}
			if (newScores[1] < newScores[0]) {
				newImages.pop();
				newScores.pop();
			}
			if (newImages.length >= 1 && newImages[0].url == images[0].url) {
				newImages.shift();
				newScores.shift();
			}

			//log.debug("newImages",JSON.stringify(newImages));
			return newImages;
		}
		/**
		 * Executes when the map entry point is triggered and applies to each key/value pair.
		 *
		 * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
		 * @since 2015.1
		 */
		function map(context: iMapContext) {
			if (!abort()) {
				log.debug("Process MAP", "context=" + context.key);
				let searchResult: any = JSON.parse(context.value);
				//log.debug("Process MAP", "searchResult=" + JSON.stringify(searchResult));

				let commercecategoryid: string = searchResult.values.commercecategoryid;


				let category: iDataRecord = record.load({ type: "commercecategory", id: commercecategoryid });
				let categoryname: iDataRecord = category.getValue("name");
				let primaryparent: string = category.getValue("primaryparent");
				let parentcategory: iDataRecord = record.load({ type: "commercecategory", id: primaryparent });
				let parentcategoryname: string = parentcategory.getValue("name");
				let parentcategorythumbnail: string = parentcategory.getValue("thumbnail");
				let parentcategorythumbnail_url: string;
				if (parentcategorythumbnail) {
					parentcategorythumbnail_url = getImageUrl(parentcategorythumbnail);
				}

				let value: any = {
					id: searchResult.id,
					type: searchResult.recordType,
					parentcategoryname: parentcategoryname,
					categoryname: categoryname,
					parentcategorythumbnail: parentcategorythumbnail,
					parentcategorythumbnail_url: parentcategorythumbnail_url,
					displayname: searchResult.values.displayname,
					matrix: searchResult.values.matrix == "T",
					itemid: searchResult.values.itemid,
					baseprice: searchResult.values.baseprice,
					onlineprice: searchResult.values.onlineprice || searchResult.values.baseprice,
					layout: (searchResult.values.custitem_c25_cataloguelayout && searchResult.values.custitem_c25_cataloguelayout.text) || "Small",
					description: cleanHTML(searchResult.values.custitem_c25_cataloguedesc || searchResult.values.storedetaileddescription),
					features: cleanHTML(searchResult.values.custitem_bb1_sca_features_en),
					instructions: cleanHTML(searchResult.values.custitem_bb1_sca_instructions_en),
					included: cleanHTML(searchResult.values.custitem_bb1_sca_included_en),
					techspecs: cleanHTML(searchResult.values.custitem_bb1_sca_techspecs_en),
					safety: cleanHTML(searchResult.values.custitem_bb1_sca_safety_en),
					recommended: cleanHTML(searchResult.values.custitem_bb1_sca_recommended_en),
					urlcomponent: searchResult.values.urlcomponent
				};



				let facetNumber: number = 0;
				for (let i: number = 0; i < facets.length; i++) {
					if (searchResult.values[facets[i].id]) {
						facetNumber++;
						value["optionid" + facetNumber] = facets[i].id;
						value["optionname" + facetNumber] = facets[i].label;

						value["optionvalue" + facetNumber] = getText(searchResult.values[facets[i].id]);

					}

				}


				//log.debug("Process MAP", "commercecategoryid=" + commercecategoryid + " " + parentcategoryname + " > " + categoryname);
				context.write({
					"key": "save", value: value
				});

			}

		}

		/**
		 * Executes when the reduce entry point is triggered and applies to each group.
		 *
		 * @param {ReduceSummary} context - Data collection containing the groups to process through the reduce stage
		 * @since 2015.1
		 */
		function reduce(context: iReduceContext) {
			if (!abort()) {
				log.debug("Process Reduce", "context=" + context.key + " " + JSON.stringify(context.values));

				let custscript_c25_catalogue_catalogue: string = runtime.getCurrentScript().getParameter({
					name: 'custscript_c25_catalogue_catalogue'
				});

				let categories: string[] = runtime.getCurrentScript().getParameter({
					name: 'custscript_c25_catalogue_categories'
				}).split(",");

				let line: any, lastCategory: string, lastSubCategory: string, body: string = "", xml: string = "<Root>\r\n";
				let catColumns: string[] = ["categoryname", "parentcategoryname", "breadcrumbs", "@parentcategorythumbnail"];
				let itemColumns: string[] = ["displayname", "sku", "baseprice", "onlineprice", "description", "optionname1", "optionvalue1", "optionname2", "optionvalue2", "optionname3", "optionvalue3", "features", "instructions", "included", "techspecs", "safety", "recommended", "urlcomponent", "@image1", "@image2", "@image3"];
				let childSearchObj: iRecordSearch;
				let catFolder: number = 646164;
				let columns: iColumn[], images: any[], filteredImages: any[], childIndex: number;

				body += "layout";
				for (let i: number = 0; i < catColumns.length; i++) {
					body += "," + catColumns[i];
				}
				for (let i: number = 0; i < itemColumns.length; i++) {
					body += "," + itemColumns[i];
				}
				body += "\r\n";

				for (let j: number = 0; j < categories.length; j++) {

					for (let i: number = 0; i < context.values.length; i++) {
						line = JSON.parse(context.values[i]);
						if (line.parentcategoryname == categories[j]) {

							//main category line
							if (categories[j] != lastCategory) {
								//log.debug("Process Reduce", "cat " + categories[j]);
								lastCategory = categories[j];
								body += CSVString("Category") + "," + CSVString(categories[j]) + ",," + CSVString(categories[j]) + "," + CSVString(line.parentcategorythumbnail_url);
								body += addCommas(itemColumns.length);
								body += "\r\n";
								xml += "\t<Category><Name>" + XMLString(categories[j]) + "</Name><Image href=\"" + XMLString(line.parentcategorythumbnail_url) + "\"></Image></Category>\r\n";
							}

							//sub category line
							if (line.categoryname != lastSubCategory) {
								//log.debug("Process Reduce", "sub cat " +line.parentcategoryname +" > "+line.categoryname);
								lastCategory = categories[j];
								body += CSVString("Subcategory") + "," + CSVString(categories[j]) + "," + CSVString(line.parentcategoryname) + "," + CSVString(line.parentcategoryname + " > " + line.categoryname) + ",";
								body += addCommas(itemColumns.length);
								body += "\r\n";
								xml += "\t<SubCategory><Name>" + XMLString(line.categoryname) + "</Name><ParentName>" + XMLString(line.parentcategoryname) + "</ParentName><Breadcrumbs>" + XMLString(line.parentcategoryname + " > " + line.categoryname) + "</Breadcrumbs></SubCategory>\r\n";
							}

							//item
							log.debug("Process Reduce", i + "=" + JSON.stringify(line));


							images = getImages(line.type, line.id);
							//log.debug("images", JSON.stringify(images));
							xml += "\t<" + line.layout + "Item>\r\n";
							body += CSVString(line.layout) + "," + CSVString(categories[j]) + "," + CSVString(line.parentcategoryname) + "," + CSVString(line.parentcategoryname + " > " + line.categoryname) + ",," + CSVString(line.displayname) + "," + CSVString(getSku(line.itemid)) + "," + CSVString(!line.matrix && getPrice(line.baseprice)) + "," + CSVString(!line.matrix && getPrice(line.onlineprice || line.baseprice)) + "," + CSVString(line.description) + "," + CSVString(line.optionname1) + "," + CSVString(!line.matrix && line.optionvalue1) + "," + CSVString(line.optionname2) + "," + CSVString(!line.matrix && line.optionvalue2) + "," + CSVString(line.optionname3) + "," + CSVString(!line.matrix && line.optionvalue3) + "," + CSVString(line.features) + "," + CSVString(line.instructions) + "," + CSVString(line.included) + "," + CSVString(line.techspecs) + "," + CSVString(line.safety) + "," + CSVString(line.recommended) + "," + CSVString("https://www.stonetools.co.uk/" + line.urlcomponent) + "," + CSVString(images[0] && images[0].url) + "," + CSVString(images[1] && images[1].url) + "," + CSVString(images[2] && images[2].url);

							body += "\r\n";

							xml += "\t\t<Name>" + XMLString(line.displayname) + "</Name>\r\n";
							xml += "\t\t<Sku>" + XMLString(getSku(line.itemid)) + "</Sku>\r\n";
							if (!line.matrix) {
								xml += "\t\t<BasePrice>" + XMLString(getPrice(line.baseprice)) + "</BasePrice>\r\n";
								xml += "\t\t<OnlinePrice>" + XMLString(getPrice(line.onlineprice || line.baseprice)) + "</OnlinePrice>\r\n";
							}
							xml += "\t\t<Description>" + XMLString(line.description) + "</Description>\r\n";
							if (line.features) {
								xml += "\t\t<Features>" + XMLString(line.features) + "</Features>\r\n";
							}
							if (line.instructions) {
								xml += "\t\t<Instructions>" + XMLString(line.instructions) + "</Instructions>\r\n";
							}
							if (line.included) {
								xml += "\t\t<Included>" + XMLString(line.included) + "</Included>\r\n";
							}
							if (line.techspecs) {
								xml += "\t\t<TechSpecs>" + XMLString(line.techspecs) + "</TechSpecs>\r\n";
							}
							if (line.safety) {
								xml += "\t\t<Safety>" + XMLString(line.safety) + "</Safety>\r\n";
							}
							if (line.recommended) {
								xml += "\t\t<Recommended>" + XMLString(line.recommended) + "</Recommended>\r\n";
							}
							xml += "\t\t<Link>https://www.stonetools.co.uk/" + XMLString(line.urlcomponent) + "</Link>\r\n";

							if (images[0]) {
								xml += "\t\t<Image1 href=\"" + XMLString(images[0].url) + "\"></Image1>\r\n";
							}
							if (images[1]) {
								xml += "\t\t<Image2 href=\"" + XMLString(images[1].url) + "\"></Image2>\r\n";
							}
							if (images[2]) {
								xml += "\t\t<Image3 href=\"" + XMLString(images[2].url) + "\"></Image3>\r\n";
							}

							if (line.optionname1) {
								xml += "\t\t<Option1><Label>" + XMLString(line.optionname1) + "</Label></Option1>\r\n";
							}
							if (line.optionname2) {
								xml += "\t\t<Option2><Label>" + XMLString(line.optionname2) + "</Label></Option2>\r\n";
							}
							if (line.optionname3) {
								xml += "\t\t<Option3><Label>" + XMLString(line.optionname3) + "</Label></Option3>\r\n";
							}
							if (line.matrix) {
								//log.debug("Find Children For", line.id);
								//children

								columns = [
									search.createColumn({
										name: "itemid",
										sort: "ASC"
									}),
									search.createColumn({ name: "displayname" }),
									search.createColumn({ name: "itemid" }),
									search.createColumn({ name: "type" }),
									search.createColumn({ name: "baseprice" })
								];
								if (line.optionid1) {
									columns.push(search.createColumn({ name: line.optionid1 }));
								}
								if (line.optionid2) {
									columns.push(search.createColumn({ name: line.optionid2 }));
								}
								if (line.optionid3) {
									columns.push(search.createColumn({ name: line.optionid3 }));
								}

								childSearchObj = search.create({
									type: "item",
									filters:
										[
											["parent", "anyof", line.id],
											"AND",
											["custitem_c25_cataloguedisplay", "anyof", custscript_c25_catalogue_catalogue],
											"AND",
											["isinactive", "is", "F"]
										],
									columns: columns
								});
								childIndex = 0;
								childSearchObj.run().each(function (result: iSearchResult) {
									//log.debug("Child", result.id);
									childIndex++;
									filteredImages = filterImages(images, line, result);
									body += CSVString(line.layout) + "Child" + (childIndex % 2 == 0 ? "Even" : "Odd") + ",,,,," + CSVString(result.getValue("displayname")) + "," + CSVString(getSku(result.getValue("itemid"))) + "," + CSVString(getPrice(result.getValue("baseprice"))) + "," + CSVString(getPrice(result.getValue("onlineprice") || result.getValue("baseprice"))) + ",," + CSVString(line.optionname1) + "," + CSVString(line.optionid1 && result.getText(line.optionid1)) + "," + CSVString(line.optionname2) + "," + CSVString(line.optionid2 && result.getText(line.optionid2)) + "," + CSVString(line.optionname3) + "," + CSVString(line.optionid3 && result.getText(line.optionid3)) + ",,,,,,,,," + CSVString(filteredImages[0] && filteredImages[0].url) + "," + CSVString(filteredImages[1] && filteredImages[1].url) + "," + CSVString(filteredImages[2] && filteredImages[2].url);

									body += "\r\n";
									xml += "\t\t<" + line.layout + "Child" + (childIndex % 2 == 0 ? "Even" : "Odd") + ">\r\n";

									xml += "\t\t\t<Name>" + XMLString(line.displayname) + "</Name>\r\n";
									xml += "\t\t\t<Sku>" + XMLString(getSku(result.getValue("itemid"))) + "</Sku>\r\n";
									xml += "\t\t\t<BasePrice>" + XMLString(getPrice(result.getValue("baseprice"))) + "</BasePrice>\r\n";
									xml += "\t\t\t<OnlinePrice>" + XMLString(getPrice(result.getValue("onlineprice") || result.getValue("baseprice"))) + "</OnlinePrice>\r\n";

									if (line.optionname1) {
										xml += "\t\t\t<Option1><Label>" + XMLString(line.optionname1) + "</Label><Value>" + XMLString(result.getText(line.optionid1)) + "</Value></Option1>\r\n";
									}
									if (line.optionname2) {
										xml += "\t\t\t<Option2><Label>" + XMLString(line.optionname2) + "</Label>><Value>" + XMLString(result.getText(line.optionid2)) + "</Value></Option2>\r\n";
									}
									if (line.optionname3) {
										xml += "\t\t\t<Option3><Label>" + XMLString(line.optionname3) + "</Label>><Value>" + XMLString(result.getText(line.optionid3)) + "</Value></Option3>\r\n";
									}

									if (filteredImages[0]) {
										xml += "\t\t\t<Image1 href=\"" + XMLString(filteredImages[0].url) + "\"></Image1>\r\n";
									}
									if (filteredImages[1]) {
										xml += "\t\t\t<Image2 href=\"" + XMLString(filteredImages[1].url) + "\"></Image2>\r\n";
									}
									if (filteredImages[2]) {
										xml += "\t\t\t<Image3 href=\"" + XMLString(filteredImages[2].url) + "\"></Image3>\r\n";
									}

									xml += "\t\t</" + line.layout + "Child" + (childIndex % 2 == 0 ? "Even" : "Odd") + ">\r\n";
									return true;
								});

							}
							//end of children

							xml += "\t</" + line.layout + "Item>\r\n";
						}

					}
				}
				xml += "</Root>";
				//log.debug("CSV", body);
				let date: Date = new Date();

				let filename = "";
				switch (custscript_c25_catalogue_catalogue) {
					case "1":
						filename += "UK-";
						break;
				}

				filename += date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-Catalogue";


				let newFile: iFileObject = file.create({ folder: catFolder, contents: body, name: filename + ".csv", encoding: "UTF-8", fileType: "CSV" });
				newFile.save();


				newFile = file.create({ folder: catFolder, contents: xml, name: filename + ".xml", encoding: "UTF-8", fileType: "XMLDOC" });
				newFile.save();


			}
		}

		/**
		 * Executes when the summarize entry point is triggered and applies to the result set.
		 *
		 * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
		 * @since 2015.1
		 */
		function summarize(summary: iSummary) {

			var seconds = summary.seconds;
			var usage = summary.usage;
			var yields = summary.yields;

			log.debug("Summary", "Complete seconds=" + seconds + " usage=" + usage + " yields=" + yields);

			if (summary.inputSummary.error) {
				log.error('Input Error:', summary.inputSummary.error);
			}

			summary.mapSummary.errors.iterator().each(function (key, error) {
				log.error('Map Error for key: ' + key, error);
				return true;
			});

			summary.reduceSummary.errors.iterator().each(function (key, error) {
				log.error('Reduce Error for key: ' + key, error);
				return true;
			});

		}

		let isAbort: boolean = false;
		function abort(): boolean { //Abort the script if this parameter is checked.
			if (isAbort) {
				return isAbort;
			}
			let abort: any = runtime.getCurrentScript().getParameter({
				name: 'custscript_c25_catalogue_abort'
			});
			let newAbort: boolean = (abort == "T" || abort == true);
			if (!isAbort && newAbort) {
				log.error("Map/Reduce", "**** ABORT!! - Note: Script will continue, but map/reduce will be skipped. ****");
				isAbort = newAbort;
			}
			return newAbort;
		}

		return {
			getInputData: getInputData,
			map: map,
			reduce: reduce,
			summarize: summarize
		};

	});
