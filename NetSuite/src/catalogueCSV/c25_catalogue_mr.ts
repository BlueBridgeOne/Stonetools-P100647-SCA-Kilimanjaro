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
					search.createColumn({ name: "custitem_c25_cataloguefeatures" }),
					search.createColumn({ name: "custitem_c25_cataloguesequence" }),
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
					features: cleanHTML(searchResult.values.custitem_c25_cataloguefeatures || searchResult.values.custitem_bb1_sca_features_en),
					instructions: cleanHTML(searchResult.values.custitem_bb1_sca_instructions_en),
					included: cleanHTML(searchResult.values.custitem_bb1_sca_included_en),
					techspecs: cleanHTML(searchResult.values.custitem_bb1_sca_techspecs_en),
					safety: cleanHTML(searchResult.values.custitem_bb1_sca_safety_en),
					recommended: cleanHTML(searchResult.values.custitem_bb1_sca_recommended_en),
					urlcomponent: searchResult.values.urlcomponent,
					sequence: searchResult.values.custitem_c25_cataloguesequence || 1
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
				let childSearchObj: iRecordSearch;
				let catFolder: number = 646164;
				let columns: iColumn[], images: any[], filteredImages: any[], childIndex: number;

				log.debug("Generate", "XTG");
				let xtg: string = "";


				xtg = "<v7.00><e9>\r\n";

				xtg += getXTGStyles();
				xtg += setOrigin(margin, margin);

				//sort sequence
				let swap: any, change: boolean;
				do {
					change = false;
					for (let i: number = 0; i < context.values.length - 1; i++) {
						if (context.values[i].sequence > context.values[i + 1]) {
							swap = context.values[i];
							context.values[i] = context.values[i + 1];
							context.values[i + 1] = swap;
							change = true;
						}
					}
				} while (change);

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
								xtg += getXTGCategory(categories[j], line.parentcategorythumbnail_url);

							}

							//sub category line
							if (line.categoryname != lastSubCategory) {
								//log.debug("Process Reduce", "sub cat " +line.parentcategoryname +" > "+line.categoryname);
								lastCategory = categories[j];
								xtg += getXTGSubCategory(line.categoryname, line.parentcategoryname);
							}

							//item
							log.debug("Process Reduce", i + "=" + JSON.stringify(line));

							let item: any = {
								layout: line.layout,
								name: line.displayname,
								sku: getSku(line.itemid),
								description: line.description,
								link: line.urlcomponent,
								matrix: line.matrix
							}, child: any;
							images = getImages(line.type, line.id);
							//log.debug("images", JSON.stringify(images));
							if (!line.matrix) {
								item.baseprice = line.baseprice;
								item.onlineprice = line.onlineprice || line.baseprice;
							}
							if (line.features) {
								item.features = line.features;
							}
							if (line.instructions) {
								item.instructions = line.instructions;
							}
							if (line.included) {
								item.included = line.included;
							}
							if (line.techspecs) {
								item.techspecs = line.techspecs;
							}
							if (line.safety) {
								item.safety = line.safety;
							}
							if (line.recommended) {
								item.recommended = line.recommended;
							}


							if (images[0]) {
								item.image1 = images[0].pdf;
								item.image1_url = images[0].url;
							}
							if (images[1]) {
								item.image2 = images[1].pdf;
								item.image2_url = images[1].url;
							}
							if (images[2]) {
								item.image3 = images[2].pdf;
								item.image3_url = images[2].url;
							}

							if (line.optionname1) {
								item.optionname1 = line.optionname1;
							}
							if (line.optionname2) {
								item.optionname2 = line.optionname2;
							}
							if (line.optionname3) {
								item.optionname3 = line.optionname3;
							}
							item.children = [];
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
										onlineprice: getPrice(result.getValue("onlineprice") || result.getValue("baseprice"))
									}

									childIndex++;
									filteredImages = filterImages(images, line, result);

									if (line.optionname1) {
										child.optionvalue1 = result.getText(line.optionid1);
									}
									if (line.optionname2) {
										child.optionvalue2 = result.getText(line.optionid2);
									}
									if (line.optionname3) {
										child.optionvalue3 = result.getText(line.optionid3);
									}

									if (filteredImages[0]) {
										child.image1 = filteredImages[0].url;
									}
									if (filteredImages[1]) {
										child.image2 = filteredImages[1].url;
									}
									if (filteredImages[2]) {
										child.image3 = filteredImages[2].url;
									}

									item.children.push(child);

									return true;
								});

							}
							//end of children



							xtg += getXTGItem(item);
						}

					}
				}

				let date: Date = new Date();

				let filename = "";
				switch (custscript_c25_catalogue_catalogue) {
					case "1":
						filename += "UK-";
						break;
				}

				filename += date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-Catalogue";

				let newFile: iFileObject = file.create({ folder: catFolder, contents: xtg, name: filename + ".xtg", encoding: "UTF-8", fileType: "PLAINTEXT" });
				newFile.save();

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
			xtg += "@Table Head=[S\"\",\"Table Head\"]<z9f\"Roboto-Regular\">" + setColour("StonetoolsTableHead") + br;
			xtg += "@Table Cell=[S\"\",\"Table Cell\"]<z9f\"Roboto-Regular\">" + setColour("StonetoolsCopy") + br;
			xtg += "@Table Cell Price=[S\"\",\"Table Cell Price\"]<z9f\"Roboto-Regular\"><B>" + setColour("StonetoolsGreen") + br;
			xtg += "@QR Url=[S\"\",\"QR Url\"]<z9f\"Roboto-Regular\">" + setColour("Black") + br;

			let layouts: string[] = ["Small", "Medium", "Large", "Hero","Compare"];
			for (let i = 0; i < layouts.length; i++) {
				if(layouts[i]=="Hero"){
					xtg += "@" + layouts[i] + " Item Title=[S\"\",\"" + layouts[i] + " Item Title\"]<z24f\"Roboto-Regular\"><B>" + setColour("StonetoolsCopyDark") + br;
					xtg += "@" + layouts[i] + " Item Subtitle=[S\"\",\"" + layouts[i] + " Item Subtitle\"]<z16f\"Roboto-Regular\"><B>" + setColour("StonetoolsCopyDark") + br;
				}else{
				xtg += "@" + layouts[i] + " Item Title=[S\"\",\"" + layouts[i] + " Item Title\"]<z16f\"Roboto-Regular\"><B>" + setColour("StonetoolsCopyDark") + br;
				xtg += "@" + layouts[i] + " Item Subtitle=[S\"\",\"" + layouts[i] + " Item Subtitle\"]<z12f\"Roboto-Regular\"><B>" + setColour("StonetoolsCopyDark") + br;
				}
				
				xtg += "@" + layouts[i] + " Item Sku=[S\"\",\"" + layouts[i] + " Item Sku\"]<z12f\"Roboto-Regular\">" + setColour("StonetoolsCopy") + br;
				xtg += "@" + layouts[i] + " Item Description=[S\"\",\"" + layouts[i] + " Item Description\"]<z12f\"Roboto-Regular\">" + setColour("StonetoolsCopy") + br;
				xtg += "@" + layouts[i] + " Item Price=[S\"\",\"" + layouts[i] + " Item Price\"]<z12f\"Roboto-Regular\"><B>" + setColour("StonetoolsGreen") + br;
			}
			return xtg;
		}

		function getXTGCategory(name: string, image: string): string {
			let xtg: string = "";
			let width: number = innerSize.width, height: number = innerSize.height * .25,medheight:number=height*.41;
			xtg += checkForNewPage(width, height);
			let scale: number[] = [.3, .5, .7, .9], ix: number = width * .15;
			for (let i: number = 0; i < scale.length; i++) {
				xtg += getPicture(image, pos.x + ix, pos.y + height - (height * scale[i]) - (i * (height * .0333)), height * scale[i], height * scale[i]);
				ix += height * scale[i];
			}
			xtg += getRectangle("StonetoolsVeryDarkGrey", pos.x, pos.y, width, height);
			xtg += startTextbox(pos.x, pos.y + (height * .375), width, height * .25);
			xtg += setStyle("Category Title") + XString(name);
			xtg += endTextbox();

			let link:string=name;
			link=link.toLowerCase();
			link=link.split(" ").join("-");

			xtg += getQR("https://www.stonetools.co.uk/"+link, pos.x+innerSize.width-medheight, pos.y, medheight, medheight);
				
			xtg += getGroup(3);
			
			movePos(width, height);
			return xtg;
		}
		function getXTGSubCategory(name: string, parent: string): string {
			let xtg: string = "";
			let width: number = innerSize.width, height: number = innerSize.height * .05;
			xtg += checkForNewPage(width, height);
			xtg += startTextbox(pos.x, pos.y + (height * .25), width, height * .5);
			xtg += setStyle("Sub Category") + XString(parent.toUpperCase()) + " " + setColour("StonetoolsCopyDark") + "/ " + XString(name.toUpperCase()) + defaultColour();
			xtg += endTextbox();
			xtg += getGroup(1);
			movePos(width, height);
			return xtg;
		}
		function getXTGItem(item: any): string {

			let xtg: string = "";
			let width: number = innerSize.width, height: number = innerSize.height * .2, group: number = 2;

			let rowHeight: number = innerSize.height * .022, childHeight: number = item.matrix ? (1 + item.children.length) * rowHeight : 0;
			let spacing: number = rowHeight = innerSize.height * .01, extraImageHeight: number = 0;

			let fontWidth: number = innerSize.height * .0075;
			let isLarge: boolean = item.layout == "Hero" || item.layout == "Large";
			let isSmall: boolean = item.layout == "Small" || item.layout == "Medium";

			if (item.layout == "Medium") {
				width = (width - spacing) / 2;
				height = innerSize.height * .2;
			} else if (item.layout == "Small"||item.layout == "Compare") {
				width = (width - spacing - spacing) / 3;
				height = innerSize.height * .14;
			}

			let text: string = item.name + "\n" + item.sku + "\n\n" + item.description + "\n\n";
			if (item.features && (isLarge||item.layout=="Compare")) {
				text += "Features\n" + item.features + "\n";
				if(item.layout=="Hero"||item.layout=="Compare"){
					xtg += "\n";
				}
			}
			if (!item.matrix) {
				text += "0.00\n"
			}
			let descWidth: number = width - (height * 1.05);
			if (isSmall||item.layout=="Hero"||item.layout=="Compare") {
				descWidth = width;
			}
			let textHeight: number = guessHeight(text, descWidth, fontWidth);


			if ((item.image2_url || item.image3_url) && isLarge) {
				extraImageHeight = (height + spacing) / 2;
			}
			if(item.layout == "Compare"||item.layout == "Hero"){
				xtg += checkForNewPage(width, innerSize.height-.1);
			}else{
			xtg += checkForNewPage(width, Math.max(textHeight, height) + Math.max(childHeight, extraImageHeight));
			}
			
			if (isSmall) {

				xtg += getPicture(item.image1_url, pos.x + ((width - height) / 2), pos.y, height, height);

				xtg += startTextbox(pos.x, pos.y + height + spacing, width, textHeight);
			}else if(item.layout=="Compare"){
				xtg += getPicture(item.image1_url, pos.x, pos.y, width, width);

				xtg += startTextbox(pos.x, pos.y + width + spacing, width, innerSize.height-width-childHeight-spacing-spacing);
			}else if(item.layout=="Hero"){
				let bigHeight:number=height*1.75,medheight:number=height*.85;
				xtg += getPicture(item.image1_url, pos.x, pos.y, bigHeight, bigHeight);
				if (item.image2_url ) {

					xtg += getPicture(item.image2_url, pos.x+bigHeight+spacing, pos.y, medheight, medheight);

					group++;
				}
				if (item.image3_url) {

					xtg += getPicture(item.image3_url, pos.x+bigHeight, pos.y+spacing+medheight, medheight, medheight);

					group++;
				}

				xtg += getQR("https://www.stonetools.co.uk/"+item.link, pos.x+innerSize.width-medheight, pos.y, medheight, medheight);

				group++;

				xtg += startTextbox(pos.x, pos.y+bigHeight+spacing, descWidth, innerSize.height-bigHeight-childHeight-spacing-spacing);
			} else {
				xtg += getPicture(item.image1_url, pos.x, pos.y, height, height);
				if (item.image2_url && isLarge) {

					xtg += getPicture(item.image2_url, pos.x, pos.y + height + spacing, (height - spacing) / 2, (height - spacing) / 2);

					group++;
				}
				if (item.image3_url && isLarge) {

					xtg += getPicture(item.image3_url, pos.x + ((height + spacing) / 2), pos.y + height + spacing, (height - spacing) / 2, (height - spacing) / 2);

					group++;
				}
				if(item.layout=="Compare"){
					xtg += startTextbox(pos.x + (height * 1.05), pos.y, descWidth, innerSize.height-height-childHeight-spacing-spacing);
				}else{
				xtg += startTextbox(pos.x + (height * 1.05), pos.y, descWidth, Math.max(textHeight, height));
				}
			}


			xtg += setStyle(item.layout + " Item Title") + XString(item.name) + br;
			xtg += setStyle(item.layout + " Item Sku") + "CODE: " + XString(item.sku) + br + br;
			xtg += setStyle(item.layout + " Item Description") + XString(item.description) + br + br;
			if (item.features && (isLarge||item.layout=="Compare")) {
				xtg += setStyle(item.layout + " Item Subtitle") + XString("Features") + br;
				if(item.layout=="Hero"||item.layout=="Compare"){
					xtg += br;
				}
				xtg += setStyle(item.layout + " Item Description") + XString(item.features) + br + br;
			}
			if (!item.matrix) {
				xtg += setStyle(item.layout + " Item Price") + XString(getPrice(item.onlineprice || "0.00")) + br;
			}
			xtg += endTextbox();

			//children
			if (item.matrix) {
				if (isSmall) {
					xtg += getMatrixOptions(item, pos.x, pos.y + textHeight + height, descWidth);
				}else if(item.layout == "Compare"||item.layout == "Hero"){
					xtg += getMatrixOptions(item, pos.x, pos.y+innerSize.height-childHeight, descWidth);	
				}else {
					xtg += getMatrixOptions(item, pos.x + (height * 1.05), pos.y + Math.max(textHeight, height), descWidth);
				}
				group++;
			}
			xtg += getGroup(group);
			if (isSmall) {
				movePos(width + spacing, textHeight + height + spacing + childHeight);
			}else if(item.layout=="Hero"){
				movePos(width, innerSize.height);
			}else {
				movePos(width, Math.max(textHeight, height) + Math.max(childHeight, extraImageHeight));
			}
			return xtg;
		}

		function getMatrixOptions(item: any, left: number, top: number, tableWidth: number): string {
			let xtg: string = "";
			let height: number = innerSize.height * .2;
			let lineWidth: number = innerSize.height * .0015, cellPaddingX: number = innerSize.height * .01, cellPaddingY: number = innerSize.height * .003;
			let group: number = 0, columns: number = 2;
			let rowHeight = innerSize.height * .022, childHeight: number = item.matrix ? (1 + item.children.length) * rowHeight : 0, originalLeft: number = left;
			if (item.optionname1) {
				columns++;
			}
			if (item.optionname2) {
				columns++;
			}
			if (item.optionname3) {
				columns++;
			}
			let columnWidth: number = tableWidth / columns;

			xtg += getRectangle("StonetoolsTableLine", left, top, tableWidth, lineWidth);
			group++;
			xtg += getRectangle("StonetoolsTableLine", left, top + rowHeight, tableWidth, lineWidth);
			group++;
			xtg += getRectangle("StonetoolsTableLine", left, top + childHeight, tableWidth, lineWidth);
			group++;
			xtg += getTextbox(left + cellPaddingX, top + cellPaddingY, columnWidth - cellPaddingX, rowHeight, "Table Head", "CODE");
			left += columnWidth;

			if (item.optionname1) {
				xtg += getTextbox(left + cellPaddingX, top + cellPaddingY, columnWidth - cellPaddingX, rowHeight, "Table Head", item.optionname1.toUpperCase());
				left += columnWidth;
			}
			if (item.optionname2) {
				xtg += getTextbox(left + cellPaddingX, top + cellPaddingY, columnWidth - cellPaddingX, rowHeight, "Table Head", item.optionname2.toUpperCase());
				left += columnWidth;
			}
			if (item.optionname3) {
				xtg += getTextbox(left + cellPaddingX, top + cellPaddingY, columnWidth - cellPaddingX, rowHeight, "Table Head", item.optionname3.toUpperCase());
				left += columnWidth;
			}
			xtg += getTextbox(left + cellPaddingX, top + cellPaddingY, columnWidth - cellPaddingX, rowHeight, "Table Head", "PRICE");
			group += columns;
			top += rowHeight;
			for (let i: number = 0; i < item.children.length; i++) {
				left = originalLeft;

				if (i % 2 != 0) {
					xtg += getRectangle("StonetoolsTableRow", left, top, tableWidth, rowHeight);
					group++;
				}

				xtg += getTextbox(left + cellPaddingX, top + cellPaddingY, columnWidth - cellPaddingX, rowHeight, "Table Cell", item.children[i].sku);
				left += columnWidth;
				group++;
				if (item.optionname1) {
					xtg += getTextbox(left + cellPaddingX, top + cellPaddingY, columnWidth - cellPaddingX, rowHeight, "Table Cell", item.children[i].optionvalue1);
					left += columnWidth;
					group++;
				}
				if (item.optionname2) {
					xtg += getTextbox(left + cellPaddingX, top + cellPaddingY, columnWidth - cellPaddingX, rowHeight, "Table Cell", item.children[i].optionvalue2);
					left += columnWidth;
					group++;
				}
				if (item.optionname3) {
					xtg += getTextbox(left + cellPaddingX, top + cellPaddingY, columnWidth - cellPaddingX, rowHeight, "Table Cell", item.children[i].optionvalue3);
					left += columnWidth;
					group++;
				}
				xtg += getTextbox(left + cellPaddingX, top + cellPaddingY, columnWidth - cellPaddingX, rowHeight, "Table Cell Price", item.children[i].onlineprice);
				group++;
				top += rowHeight;
			}

			xtg += getGroup(group);
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
		function getTextbox(x: number, y: number, width: number, height: number, style: string, text: string): string {
			let xtg: string = "";
			xtg += startTextbox(x, y, width, height);
			xtg += setStyle(style) + XString(text) + br;
			xtg += endTextbox();
			return xtg;
		}

		function startTextbox(x: number, y: number, width: number, height: number): string {
			let xtg: string = "";
			xtg += "<&tbu2(" + x.toFixed(2) + "," + y.toFixed(2) + "," + width.toFixed(2) + "," + height.toFixed(2) + ",0,0,,n,,,,,,,,,,,,,,,,\"Layer 1\",\"[Normal Text Frame]\")>";
			return xtg;
		}
		function endTextbox(): string {
			let xtg: string = "";
			xtg += "<&te>";
			return xtg;
		}

		function setColour(name: "StonetoolsGreen" | "StonetoolsVeryDarkGrey" | "StonetoolsCopy" | "StonetoolsCopyDark" | "StonetoolsTableHead" | "StonetoolsTableRow"|"Black"|"Paper"): string {
			return "<c\"" + name + "\">";
		}

		function defaultColour(): string {
			return "<c$>";
		}

		function getPicture(image: string, x: number, y: number, width: number, height: number): string {
			let xtg: string = "";

			let skew: number = 0;
			let angle: number = 0;

			xtg += "<&pbu2(" + x.toFixed(2) + "," + y.toFixed(2) + "," + width.toFixed(2) + "," + height.toFixed(2) + "," + angle + "," + skew + ",,,,,,,,,,," + (width * .37) + "," + (height * .37) + ",0,0,0,0,\"" + image + "\",,,\"Layer 1\",\"[None]\")>";

			return xtg;
		}

		function getQR(url: string, x: number, y: number, width: number, height: number): string {
			let xtg: string = "";

			let skew: number = 0;
			let angle: number = 0;
			let border:number=height*.05;
			x+=border+border;
			y+=border+border;
			width-=border*4;
			height-=border*4;
			xtg+=getRectangle("StonetoolsTableHead",x,y,width,height);
			xtg+=getRectangle("Paper",x+border,y+border,width-border-border,height-border-border);
			
			xtg+=getTextbox(x+border,y+border,width-border-border,height-border-border,"QR Url",url);
			xtg += getGroup(3);
			return xtg;
		}

		function getRectangle(colour: string, x: number, y: number, width: number, height: number): string {
			let xtg: string = "";

			let skew: number = 0;
			let angle: number = 0;
			xtg += "<&nbu2(" + x.toFixed(2) + "," + y.toFixed(2) + "," + width.toFixed(2) + "," + height.toFixed(2) + "," + angle + "," + skew + ",,n,0,(n,),,,\"" + colour + "\",,,,\"Layer 1\",\"[Normal Graphics Frame]\")>";


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

		function guessHeight(text: string, width: number, fontWidth: number): number {
			let x: number = 0, y: number = 0, fontHeight: number = fontWidth * 1.4, line: string = "";
			y += fontHeight;
			for (let i: number = 0; i < text.length; i++) {
				if (text.charAt(i) == "\n") {
					x = 0;
					y += fontHeight;
					//log.debug("Return",line);
					line = "";
				} else {
					x += fontWidth;
					line += text.charAt(i);
					if (x > width) {
						x = fontWidth;
						y += fontHeight;
						//log.debug("End of Line",line.substring(0,line.length-1));
						line = text.charAt(i);
					}
				}
			}
			if (x > 0) {
				y += fontHeight;
			}
			return y;
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
