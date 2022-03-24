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

interface iSize {
	width: number;
	height: number;
}

interface iPoint {
	x: number;
	y: number;
}

define(['N/record', 'N/search', 'N/runtime', 'N/file', 'N/render'],

	function (record: iRecord, search: iSearch, runtime: iRuntime, file: iFile, render: iRender) {

		let br: string = "\r\n";
		let margin: number = 36;
		let innerSize: iSize = { width: 540, height: 720 };
		let outerSize: iSize = { width: innerSize.width + margin + margin, height: innerSize.height + margin + margin };
		let pos: iPoint = { x: 0, y: 0 };
		let lineHeight = 0;

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
		function XString(text: string): string {
			if (text) {
				let body: string = "", char: string;
				for (let i: number = 0; i < text.length; i++) {
					char = text.charAt(i);
					switch (char) {
						case "-":
							body += "<\\->";
							break;
						case "@":
							body += "<\\@>";
							break;
						case "<":
							body += "<\\<>";
							break;
						case ">":
							body += "<\\>>";
							break;
						case "\\":
							body += "<\\\\>";
							break;
						default:
							body += char;
							break;
					}
				}
				return body;
			}


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
		function getPDFUrl(id: string): string {
			let imageObj: iFileObject = file.load({ id: id });
			return imageObj.url;
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
						images.push({ url: "./images/" + fileObject.name, name: fileObject.name, pdf: fileObject.url });
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
				let parentcategorythumbnail_url: string, parentcategorythumbnail_pdf: string;
				if (parentcategorythumbnail) {
					parentcategorythumbnail_url = getImageUrl(parentcategorythumbnail);
					parentcategorythumbnail_pdf = getPDFUrl(parentcategorythumbnail);
				}

				let value: any = {
					id: searchResult.id,
					type: searchResult.recordType,
					parentcategoryname: parentcategoryname,
					categoryname: categoryname,
					parentcategorythumbnail: parentcategorythumbnail,
					parentcategorythumbnail_url: parentcategorythumbnail_url,
					parentcategorythumbnail_pdf: parentcategorythumbnail_pdf,
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

				let line: any, lastCategory: string, lastSubCategory: string;//, body: string = "", xml: string = "<Root>\r\n";
				// let catColumns: string[] = ["categoryname", "parentcategoryname", "breadcrumbs", "@parentcategorythumbnail"];
				// let itemColumns: string[] = ["displayname", "sku", "baseprice", "onlineprice", "description", "optionname1", "optionvalue1", "optionname2", "optionvalue2", "optionname3", "optionvalue3", "features", "instructions", "included", "techspecs", "safety", "recommended", "urlcomponent", "@image1", "@image2", "@image3"];
				let childSearchObj: iRecordSearch;
				let catFolder: number = 646164;
				let columns: iColumn[], images: any[], filteredImages: any[], childIndex: number;

				log.debug("Generate", "XTG");
				let xtg: string = ""; //html: string = "",
				// html = "<head>";
				// html += getStyles();

				// html += "</head>\n<body width=\"" + getPDFSize().width + "\" height=\"" + getPDFSize().height + "\" >";
				// html += getFrontPage();

				// body += "layout";
				// for (let i: number = 0; i < catColumns.length; i++) {
				// 	body += "," + catColumns[i];
				// }
				// for (let i: number = 0; i < itemColumns.length; i++) {
				// 	body += "," + itemColumns[i];
				// }
				// body += "\r\n";

				xtg = "<v7.00><e9>\r\n";

				xtg += getXTGStyles();
				xtg += setOrigin(margin, margin);

				for (let j: number = 0; j < categories.length; j++) {

					for (let i: number = 0; i < context.values.length; i++) {
						line = JSON.parse(context.values[i]);
						if (line.parentcategoryname == categories[j]) {

							//main category line
							if (categories[j] != lastCategory) {
								//log.debug("Process Reduce", "cat " + categories[j]);
								if (lastCategory) {
									xtg += getXTGNextPage();
								}
								lastCategory = categories[j];
								// body += CSVString("Category") + "," + CSVString(categories[j]) + ",," + CSVString(categories[j]) + "," + CSVString(line.parentcategorythumbnail_url);
								// body += addCommas(itemColumns.length);
								// body += "\r\n";
								// xml += "\t<Category><Name>" + XMLString(categories[j]) + "</Name><Image href=\"" + XMLString(line.parentcategorythumbnail_url) + "\"></Image></Category>\r\n";
								//html += getPDFCategory(categories[j], line.parentcategorythumbnail_pdf);
								xtg += getXTGCategory(categories[j], line.parentcategorythumbnail_url);

							}

							//sub category line
							if (line.categoryname != lastSubCategory) {
								//log.debug("Process Reduce", "sub cat " +line.parentcategoryname +" > "+line.categoryname);
								lastCategory = categories[j];
								// body += CSVString("Subcategory") + "," + CSVString(categories[j]) + "," + CSVString(line.parentcategoryname) + "," + CSVString(line.parentcategoryname + " > " + line.categoryname) + ",";
								// body += addCommas(itemColumns.length);
								// body += "\r\n";
								// xml += "\t<SubCategory><Name>" + XMLString(line.categoryname) + "</Name><ParentName>" + XMLString(line.parentcategoryname) + "</ParentName><Breadcrumbs>" + XMLString(line.parentcategoryname + " > " + line.categoryname) + "</Breadcrumbs></SubCategory>\r\n";
								//html += getPDFSubCategory(line.categoryname, line.parentcategoryname);
								xtg += getXTGSubCategory(line.categoryname, line.parentcategoryname);
							}

							//item
							log.debug("Process Reduce", i + "=" + JSON.stringify(line));

							let item: any = {
								layout: line.layout,
								name: line.displayname,
								sku: getSku(line.itemid),
								description: line.description,
								link:line.urlcomponent
							},child:any;
							images = getImages(line.type, line.id);
							//log.debug("images", JSON.stringify(images));
							// xml += "\t<" + line.layout + "Item>\r\n";
							// body += CSVString(line.layout) + "," + CSVString(categories[j]) + "," + CSVString(line.parentcategoryname) + "," + CSVString(line.parentcategoryname + " > " + line.categoryname) + ",," + CSVString(line.displayname) + "," + CSVString(getSku(line.itemid)) + "," + CSVString(!line.matrix && getPrice(line.baseprice)) + "," + CSVString(!line.matrix && getPrice(line.onlineprice || line.baseprice)) + "," + CSVString(line.description) + "," + CSVString(line.optionname1) + "," + CSVString(!line.matrix && line.optionvalue1) + "," + CSVString(line.optionname2) + "," + CSVString(!line.matrix && line.optionvalue2) + "," + CSVString(line.optionname3) + "," + CSVString(!line.matrix && line.optionvalue3) + "," + CSVString(line.features) + "," + CSVString(line.instructions) + "," + CSVString(line.included) + "," + CSVString(line.techspecs) + "," + CSVString(line.safety) + "," + CSVString(line.recommended) + "," + CSVString("https://www.stonetools.co.uk/" + line.urlcomponent) + "," + CSVString(images[0] && images[0].url) + "," + CSVString(images[1] && images[1].url) + "," + CSVString(images[2] && images[2].url);

							// body += "\r\n";

							// xml += "\t\t<Name>" + XMLString(line.displayname) + "</Name>\r\n";
							// xml += "\t\t<Sku>" + XMLString(getSku(line.itemid)) + "</Sku>\r\n";
							if (!line.matrix) {
								// xml += "\t\t<BasePrice>" + XMLString(getPrice(line.baseprice)) + "</BasePrice>\r\n";
								// xml += "\t\t<OnlinePrice>" + XMLString(getPrice(line.onlineprice || line.baseprice)) + "</OnlinePrice>\r\n";
								item.baseprice = line.baseprice;
								item.onlineprice = line.onlineprice || line.baseprice;
							}
							//xml += "\t\t<Description>" + XMLString(line.description) + "</Description>\r\n";
							if (line.features) {
								//xml += "\t\t<Features>" + XMLString(line.features) + "</Features>\r\n";
								item.features=line.features;
							}
							if (line.instructions) {
								//xml += "\t\t<Instructions>" + XMLString(line.instructions) + "</Instructions>\r\n";
								item.instructions=line.instructions;
							}
							if (line.included) {
								//xml += "\t\t<Included>" + XMLString(line.included) + "</Included>\r\n";
								item.included=line.included;
							}
							if (line.techspecs) {
								// xml += "\t\t<TechSpecs>" + XMLString(line.techspecs) + "</TechSpecs>\r\n";
								item.techspecs=line.techspecs;
							}
							if (line.safety) {
								// xml += "\t\t<Safety>" + XMLString(line.safety) + "</Safety>\r\n";
								item.safety=line.safety;
							}
							if (line.recommended) {
								// xml += "\t\t<Recommended>" + XMLString(line.recommended) + "</Recommended>\r\n";
								item.recommended=line.recommended;
							}

							// xml += "\t\t<Link>https://www.stonetools.co.uk/" + XMLString(line.urlcomponent) + "</Link>\r\n";

							if (images[0]) {
								// xml += "\t\t<Image1 href=\"" + XMLString(images[0].url) + "\"></Image1>\r\n";
								item.image1 = images[0].pdf;
								item.image1_url = images[0].url;
							}
							if (images[1]) {
								// xml += "\t\t<Image2 href=\"" + XMLString(images[1].url) + "\"></Image2>\r\n";
								item.image2 = images[1].pdf;
								item.image2_url = images[1].url;
							}
							if (images[2]) {
								// xml += "\t\t<Image3 href=\"" + XMLString(images[2].url) + "\"></Image3>\r\n";
								item.image3 = images[2].pdf;
								item.image3_url = images[2].url;
							}

							if (line.optionname1) {
								// xml += "\t\t<Option1><Label>" + XMLString(line.optionname1) + "</Label></Option1>\r\n";
								item.optionname1=line.optionname1;
							}
							if (line.optionname2) {
								// xml += "\t\t<Option2><Label>" + XMLString(line.optionname2) + "</Label></Option2>\r\n";
								item.optionname2=line.optionname2;
							}
							if (line.optionname3) {
								// xml += "\t\t<Option3><Label>" + XMLString(line.optionname3) + "</Label></Option3>\r\n";
								item.optionname3=line.optionname3;
							}
							line.children=[];
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

									child = {
										name: line.displayname,
										sku: getSku(result.getValue("itemid")),
										baseprice: getPrice(result.getValue("baseprice")),
										onlineprice:getPrice(result.getValue("onlineprice") || result.getValue("baseprice"))
									}

									childIndex++;
									filteredImages = filterImages(images, line, result);
									// body += CSVString(line.layout) + "Child" + (childIndex % 2 == 0 ? "Even" : "Odd") + ",,,,," + CSVString(result.getValue("displayname")) + "," + CSVString(getSku(result.getValue("itemid"))) + "," + CSVString(getPrice(result.getValue("baseprice"))) + "," + CSVString(getPrice(result.getValue("onlineprice") || result.getValue("baseprice"))) + ",," + CSVString(line.optionname1) + "," + CSVString(line.optionid1 && result.getText(line.optionid1)) + "," + CSVString(line.optionname2) + "," + CSVString(line.optionid2 && result.getText(line.optionid2)) + "," + CSVString(line.optionname3) + "," + CSVString(line.optionid3 && result.getText(line.optionid3)) + ",,,,,,,,," + CSVString(filteredImages[0] && filteredImages[0].url) + "," + CSVString(filteredImages[1] && filteredImages[1].url) + "," + CSVString(filteredImages[2] && filteredImages[2].url);

									// body += "\r\n";
									// xml += "\t\t<" + line.layout + "Child" + (childIndex % 2 == 0 ? "Even" : "Odd") + ">\r\n";

									// xml += "\t\t\t<Name>" + XMLString(line.displayname) + "</Name>\r\n";
									// xml += "\t\t\t<Sku>" + XMLString(getSku(result.getValue("itemid"))) + "</Sku>\r\n";
									// xml += "\t\t\t<BasePrice>" + XMLString(getPrice(result.getValue("baseprice"))) + "</BasePrice>\r\n";
									// xml += "\t\t\t<OnlinePrice>" + XMLString(getPrice(result.getValue("onlineprice") || result.getValue("baseprice"))) + "</OnlinePrice>\r\n";

									if (line.optionname1) {
										// xml += "\t\t\t<Option1><Label>" + XMLString(line.optionname1) + "</Label><Value>" + XMLString(result.getText(line.optionid1)) + "</Value></Option1>\r\n";
										child[line.optionname1]=result.getText(line.optionid1);
									}
									if (line.optionname2) {
										// xml += "\t\t\t<Option2><Label>" + XMLString(line.optionname2) + "</Label>><Value>" + XMLString(result.getText(line.optionid2)) + "</Value></Option2>\r\n";
										child[line.optionname2]=result.getText(line.optionid2);
									}
									if (line.optionname3) {
										// xml += "\t\t\t<Option3><Label>" + XMLString(line.optionname3) + "</Label>><Value>" + XMLString(result.getText(line.optionid3)) + "</Value></Option3>\r\n";
										child[line.optionname3]=result.getText(line.optionid3);
									}

									if (filteredImages[0]) {
										// xml += "\t\t\t<Image1 href=\"" + XMLString(filteredImages[0].url) + "\"></Image1>\r\n";
										child.image1=filteredImages[0].url;
									}
									if (filteredImages[1]) {
										// xml += "\t\t\t<Image2 href=\"" + XMLString(filteredImages[1].url) + "\"></Image2>\r\n";
										child.image2=filteredImages[1].url;
									}
									if (filteredImages[2]) {
										// xml += "\t\t\t<Image3 href=\"" + XMLString(filteredImages[2].url) + "\"></Image3>\r\n";
										child.image3=filteredImages[2].url;
									}

									// xml += "\t\t</" + line.layout + "Child" + (childIndex % 2 == 0 ? "Even" : "Odd") + ">\r\n";
									return true;
								});

							}
							//end of children

							// xml += "\t</" + line.layout + "Item>\r\n";

							//html += getPDFItem(item);

							xtg += getXTGItem(item);
						}

					}
				}
				// xml += "</Root>";

				//html += "</body>";

				//log.debug("CSV", body);
				let date: Date = new Date();

				let filename = "";
				switch (custscript_c25_catalogue_catalogue) {
					case "1":
						filename += "UK-";
						break;
				}

				filename += date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-Catalogue";


				let newFile: iFileObject;
				// newFile = file.create({ folder: catFolder, contents: body, name: filename + ".csv", encoding: "UTF-8", fileType: "CSV" });
				// newFile.save();


				// newFile = file.create({ folder: catFolder, contents: xml, name: filename + ".xml", encoding: "UTF-8", fileType: "XMLDOC" });
				// newFile.save();




				// newFile = file.create({ folder: catFolder, contents: "<html>" + html + "</html>", name: filename + ".html", encoding: "UTF-8", fileType: "HTMLDOC" });
				// newFile.save();

				newFile = file.create({ folder: catFolder, contents: xtg, name: filename + ".xtg", encoding: "UTF-8", fileType: "PLAINTEXT" });
				newFile.save();

				// let pdf: string = "<?xml version=\"1.0\"?>";
				// pdf += "<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//reportLAP\" \"reportLAP-18.1.dtd\">\n";
				// pdf += "<pdf>"
				// pdf += html;
				// pdf += "</pdf>"
				// newFile = render.xmlToPdf({ xmlString: pdf });
				// newFile.name = filename + ".pdf";
				// newFile.folder = catFolder;
				// newFile.save();

			}
		}
		// 


		function setOrigin(x: number, y: number): string {
			let xtg: string = "";
			xtg += "<&o(" + x + "," + y + ")>";

			return xtg;
		}

		function getXTGNextPage(): string {
			let xtg: string = "";
			if (pos.x != 0 || pos.y != 0) {
				xtg += "<\\b>";
				pos.x = 0;
				pos.y = 0;
				lineHeight = 0;
			}
			return xtg;
		}

		function getXTGStyles(): string {
			let xtg: string = "";
			xtg += "@NormalParagraphStyle=[S\"\",\"NormalParagraphStyle\"]<z16f\"Roboto-Regular\">" + setColour("StonetoolsCopy") + br;
			xtg += "@Category Title=[S\"\",\"Category Title\"]<z30f\"Roboto-Regular\"><B>" + setColour("StonetoolsCopyDark") + br;
			xtg += "@Sub Category=[S\"\",\"Sub Category\"]<z12f\"Roboto-Regular\">" + setColour("StonetoolsCopy") + br;

			let layouts:string[]=["Small","Medium","Large","Hero"];
			for(let i=0;i<layouts.length;i++){
				xtg += "@"+layouts[i]+" Item Title=[S\"\",\""+layouts[i]+" Item Title\"]<z16f\"Roboto-Regular\"><B>" + setColour("StonetoolsCopyDark") + br;
				xtg += "@"+layouts[i]+" Item Sku=[S\"\",\""+layouts[i]+" Item Sku\"]<z12f\"Roboto-Regular\">" + setColour("StonetoolsCopy") + br;
				xtg += "@"+layouts[i]+" Item Description=[S\"\",\""+layouts[i]+" Item Description\"]<z12f\"Roboto-Regular\">" + setColour("StonetoolsCopy") + br;
				xtg += "@"+layouts[i]+" Item Price=[S\"\",\""+layouts[i]+" Item Price\"]<z12f\"Roboto-Regular\"><B>" + setColour("StonetoolsGreen") + br;
			}
			return xtg;
		}

		function getXTGCategory(name: string, image: string): string {
			let xtg: string = "";
			let width: number = innerSize.width, height: number = innerSize.height * .25;
			xtg += checkForNewPage(width, height);
			let scale:number[]=[.3,.5,.7,.9],ix:number=width*.15;
			for(let i:number=0;i<scale.length;i++){
			xtg += getPicture(image, pos.x + ix, pos.y + height-(height * scale[i])-(i*(height*.0333)),  height * scale[i],  height * scale[i]);
			ix+=height * scale[i];
			}
			xtg += getRectangle("StonetoolsVeryDarkGrey", pos.x , pos.y, width, height);
			xtg += startTextbox(pos.x, pos.y+(height*.375), width, height*.25);
			xtg += setStyle("Category Title") + XString(name);
			xtg += endTextbox();
			
			xtg += getGroup(2);
			movePos(width, height);
			return xtg;
		}
		function getXTGSubCategory(name: string, parent: string): string {
			let xtg: string = "";
			let width: number = innerSize.width, height: number = innerSize.height * .05;
			xtg += checkForNewPage(width, height);
			xtg += startTextbox(pos.x, pos.y+(height*.25), width, height*.5);
			xtg += setStyle("Sub Category") +  XString(parent.toUpperCase()) + " " + setColour("StonetoolsCopyDark") + "/ " + XString(name.toUpperCase()) + defaultColour();
			xtg += endTextbox();
			xtg += getGroup(1);
			movePos(width, height);
			return xtg;
		}
		function getXTGItem(item: any): string {

			let xtg: string = "";
			let width: number = innerSize.width, height: number = innerSize.height * .2;
			xtg += checkForNewPage(width, height);
			xtg += getPicture(item.image1_url, pos.x, pos.y, height, height);
			xtg += startTextbox(pos.x + (height*1.05), pos.y, width - (height*1.05), height);
			xtg += setStyle(item.layout+" Item Title") + XString(item.name) + br;
			xtg += setStyle(item.layout+" Item Sku") + "CODE: " + XString(item.sku) + br + br;
			xtg += setStyle(item.layout+" Item Description") + XString(item.description) + br + br;
			xtg += setStyle(item.layout+" Item Price") + XString(getPrice(item.onlineprice || "0.00")) + br;
			xtg += endTextbox();
			xtg += getGroup(2);
			movePos(width, height);
			return xtg;
		}

		
		function getGroup(frames: number): string {
			let xtg: string = "";
			xtg += "<&g(";
			for (let i = frames; i > 0; i--) {
				xtg += i;
				if (i > 1) {
					xtg += ",";
				}
			}
			xtg += ")>";
			return xtg;
		}
		function setStyle(style: string = "$"): string {
			let xtg: string = "";
			xtg += "@" + style + ":";
			return xtg;
		}
		function startTextbox(x: number, y: number, width: number, height: number): string {
			let xtg: string = "";
			xtg += "<&tbu2(" + x + "," + y + "," + width + "," + height + ",0,0,,n,,,,,,,,,,,,,,,,\"Layer 3\",\"[Normal Text Frame]\")>";
			return xtg;
		}
		function endTextbox(): string {
			let xtg: string = "";
			xtg += "<&te>";
			return xtg;
		}
		
		// function setColour(C: number, M: number, Y: number, K: number): string {
		// 	return "<c\"C=" + C + " M=" + M + " Y=" + Y + " K=" + K + "\">";
		// }

		function setColour(name: "StonetoolsGreen"|"StonetoolsVeryDarkGrey"|"StonetoolsCopy"|"StonetoolsCopyDark"): string {
			return "<c\""+name+"\">";
		}

		function defaultColour(): string {
			return "<c$>";
		}

		function getPicture(image: string, x: number, y: number, width: number, height: number): string {
			let xtg: string = "";

			let skew: number = 0;
			let angle: number = 0;

			xtg += "<&pbu2(" + x + "," + y + "," + width + "," + height + "," + angle + "," + skew + ",,,,,,,,,,," + (width * .37) + "," + (height * .37) + ",0,0,0,0,\"" + image + "\",,,\"Layer 1\",\"[None]\")>";
			
			return xtg;
		}

		function getRectangle(colour: string, x: number, y: number, width: number, height: number): string {
			let xtg: string = "";

			let skew: number = 0;
			let angle: number = 0;
			xtg += "<&nbu2(" + x + "," + y + "," + width + "," + height + "," + angle + "," + skew + ",,n,0,(n,),,,\""+colour+"\",,,,\"Layer 2\",\"[Normal Graphics Frame]\")>";
			
			
			return xtg;
		}

		function movePos(width: number, height: number) {
			pos.x += width;
			if (height > lineHeight) {
				lineHeight = height;
			}
			if (pos.x > innerSize.width - 10) {
				pos.x = 0;
				pos.y += lineHeight;
				lineHeight = 0;
			}
		}
		function checkForNewPage(width: number, height: number): string {
			if (pos.x + width > innerSize.width) {
				pos.x = 0;
				pos.y += lineHeight;
				lineHeight = 0;
			}
			if (pos.y + height > innerSize.height) {
				pos.x = 0;
				pos.y = 0;
				lineHeight = 0;
				return "<\\b>";
			}
			return "";
		}
		function getBr(): string {
			let xtg: string = "";
			xtg += "<\\n>";
			return xtg;
		}

		// function getPDFSubCategory(name: string, parent: string): string {
		// 	let pdf: string = "";
		// 	pdf += "<div class=\"subcategory\">";
		// 	pdf += "<p>" + XMLString(parent.toUpperCase()) + " <span class=\"subcategory__title\">/ " + XMLString(name.toUpperCase()) + "</span></p>";

		// 	pdf += "</div>";

		// 	return pdf;
		// }


		// function getFrontPage(): string {
		// 	let pdf: string = "";

		// 	let months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		// 	let date: Date = new Date();

		// 	pdf += "<div class=\"frontpage\">";
		// 	pdf += "<div class=\"frontpage__title\">";
		// 	pdf += "<img class=\"frontpage__logo\" src=\"/core/media/media.nl?id=801463&amp;c=4554490&amp;h=8HYrKilpXJPoyAIclDRLa5brZJmNdjMljEBliXtOCw5h7EyF\" />";
		// 	pdf += "<h1 class=\"frontpage__year\">" + months[date.getMonth()] + " " + date.getFullYear() + "</h1>";
		// 	pdf += "</div>";
		// 	pdf += "<img class=\"frontpage__image\" src=\"/core/media/media.nl?id=140367&amp;c=4554490&amp;h=-AAlULxJVDIkf-jGB6MV3JWS-f8zH39FuKBVaV8ECdv6OtVC\" />";
		// 	pdf += "<div class=\"frontpage__footer\"><p>Next Day Delivery</p></div>";
		// 	pdf += "</div>";

		// 	return pdf;
		// }

		// function getPDFItem(item: any): string {
		// 	let pdf: string = "";
		// 	pdf += "<div class=\"item\">";
		// 	pdf += "<table><tr>";
		// 	pdf += "<td class=\"item__image__container\"><img class=\"item__image\" src=\"" + XMLString(item.image1) + "\" /></td>";
		// 	pdf += "<td class=\"item__details\"><p class=\"item__title\">" + XMLString(item.name) + "</p><p class=\"item__sku\"><span class=\"item__label\">CODE:</span> " + XMLString(item.sku) + "</p><p class=\"item__description\">" + XMLString(item.description) + "</p><p class=\"item__price\">" + XMLString(getPrice(item.onlineprice || "0.00")) + "</p></td>";
		// 	pdf += "</tr></table>";
		// 	pdf += "</div>";

		// 	return pdf;
		// }

		//function getPDFSize(): any {
		// 	return { width: 794, height: 1123 };
		// }
		// function getStyles(): string {
		// 	let pdf: string = "", size: any = getPDFSize();
		// 	let font: string = "font-family:Helvetica;";
		// 	let pagePadding = (getPDFSize().width * .05) + "px";
		// 	//pdf+="<link name=\"Roboto\" src=\"https://fonts.googleapis.com/css2?family=Roboto\" type=\"font\" subtype=\"TrueType\" />";
		// 	pdf += "<style type=\"text/css\">";


		// 	pdf += "*{font-family: Roboto, sans-serif;}";
		// 	pdf += "body{margin:0;padding:0;" + font + "color:#444444;}";
		// 	pdf += ".frontpage{height:" + (size.height) + ";}";
		// 	pdf += ".frontpage__title{width:" + (size.width) + ";height:" + (size.height * .3) + ";background-color:#303030;}";
		// 	pdf += ".frontpage__footer{width:" + (size.width) + ";height:" + (size.height * .1) + ";background-color:#303030;}";

		// 	pdf += ".frontpage__image{width:" + ((1200 / 598) * size.height * .6) + ";height:" + (size.height * .6) + ";}";
		// 	let logoWidth: number = ((601 / 92) * size.height * .05);
		// 	pdf += ".frontpage__logo{position:absolute;left:" + ((size.width - logoWidth) / 2) + ";top:" + (size.height * .1) + ";width:" + logoWidth + ";height:" + (size.height * .05) + ";}";
		// 	pdf += ".frontpage__year{" + font + "font-size:" + (size.width * .05) + "px;color:white;font-weight:bold;text-align:center;position:absolute;left:0;width:100%;height:30%;top:" + (size.height * .15) + ";}";

		// 	pdf += ".category{height:" + (size.height * .4) + ";position:relative;}";

		// 	pdf += ".category__overlay{position: absolute;left: 0;top: 0;bottom: 0;width: 100%;height: 100%;background-color: alpha(50%,#222222);}";
		// 	let scalex: number[] = [.16, .19, .22, .25];
		// 	let scaley: number[] = [.08, .09, .10, .11];
		// 	for (var i = 0; i < 4; i++) {
		// 		pdf += ".category__image" + (i + 1) + "{position:absolute;left:" + (size.width * (.05 + (i * scalex[i]))) + "px;top:" + (size.height * (.34 - (i * scaley[i]))) + "px;width:" + (size.width * (.18 + (i * .08))) + "px;height:" + (size.width * (.18 + (i * .08))) + "px;}";

		// 	}
		// 	pdf += ".category__title{" + font + "font-size:" + (size.width * .075) + "px;color:white;font-weight:bold;text-align:center;position:absolute;left:0;width:100%;height:30%;top:38%;}";

		// 	pdf += ".subcategory{padding-left:" + pagePadding + ";padding-right:" + pagePadding + ";" + font + "font-size:" + (size.width * .03) + "px;height:" + (size.height * .04) + ";color:#7e7e7e;}";
		// 	pdf += ".subcategory__title{color:#444444;}";
		// 	pdf += ".item{padding-left:" + pagePadding + ";padding-right:" + pagePadding + ";}";
		// 	pdf += ".item__image{width:" + (size.width * .25) + ";height:" + (size.width * .25) + ";}";
		// 	pdf += ".item__image__container{width:" + (size.width * .25) + ";height:" + (size.width * .25) + ";border:1px solid #d2d2d2;}";
		// 	pdf += ".item__details{padding-left:" + (size.width * .025) + ";}";
		// 	pdf += ".item__title{" + font + "font-size:" + (size.width * .035) + "px;color:#444444;}";
		// 	pdf += ".item__sku{" + font + "font-size:" + (size.width * .02) + "px;color:#767676;}";
		// 	pdf += ".item__description{" + font + "font-size:" + (size.width * .02) + "px;color:#767676;}";
		// 	pdf += ".item__price{" + font + "font-size:" + (size.width * .035) + "px;color:#00cf8b;}";
		// 	pdf += ".item__label{color:#afafaf;}";
		// 	pdf += "</style>";
		// 	return pdf;
		// }
		// function getPDFCategory(name: string, image: string): string {
		// 	let pdf: string = "";
		// 	pdf += "<div class=\"category\">";


		// 	pdf += "<img class=\"category__image1\" src=\"" + XMLString(image) + "\" />";
		// 	pdf += "<img class=\"category__image2\" src=\"" + XMLString(image) + "\" />";
		// 	pdf += "<img class=\"category__image3\" src=\"" + XMLString(image) + "\" />";
		// 	pdf += "<img class=\"category__image4\" src=\"" + XMLString(image) + "\" />";

		// 	pdf += "<div class=\"category__overlay\"></div>";
		// 	pdf += "<h1 class=\"category__title\">" + XMLString(name) + "</h1>";

		// 	pdf += "</div>";

		// 	return pdf;
		// }

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
