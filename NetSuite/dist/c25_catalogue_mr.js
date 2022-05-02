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
define(['N/record', 'N/search', 'N/runtime', 'N/file', 'N/render'], function (record, search, runtime, file, render) {
    var br = "\r\n";
    var margin = 36;
    var innerSize = { width: 540, height: 720 };
    var outerSize = { width: innerSize.width + margin + margin, height: innerSize.height + margin + margin };
    var pos = { x: 0, y: 0 };
    var lineHeight = 0;
    var facets = [
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
    function getInputData() {
        try {
            log.debug("Map Reduce", "Start");
            var custscript_c25_catalogue_catalogue = runtime.getCurrentScript().getParameter({
                name: 'custscript_c25_catalogue_catalogue'
            });
            var columns = [
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
            for (var i = 0; i < facets.length; i++) {
                columns.push(search.createColumn({ name: facets[i].id }));
            }
            var itemSearchObj = search.create({
                type: "item",
                filters: [
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
        }
        catch (err) {
            log.debug("getInputData Error", err);
            return;
        }
    }
    function getText(value) {
        if (value && value.text) {
            return value.text;
        }
        return value;
    }
    function getSku(value) {
        if (value) {
            var parts = value.split(" : ");
            return parts[parts.length - 1];
        }
        return value;
    }
    function getPrice(value) {
        if (value) {
            return "£" + value;
        }
        return value;
    }
    function cleanHTML(html) {
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
    function CSVString(text) {
        text = (text || "").toString().trim();
        text = text.split("\n").join(" ");
        text = text.split("\r").join(" ");
        text = text.split("  ").join(" ");
        if (text.indexOf("\"") > -1) {
            text = text.split("\"").join("\"\"");
            text = "\"" + text + "\"";
        }
        else if (text.indexOf(",") > -1) {
            text = "\"" + text + "\"";
        }
        return text;
    }
    function XMLString(text) {
        text = (text || "").toString().trim();
        text = text.split("&").join("&amp;");
        text = text.split("<").join("&lt;");
        text = text.split(">").join("&gt;");
        text = text.split("\"").join("&quot;");
        text = text.split("'").join("&apos;");
        return text;
    }
    function XString(text) {
        if (text) {
            var body = "", char = void 0;
            for (var i = 0; i < text.length; i++) {
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
    function addCommas(length) {
        var body = "";
        for (var i = 0; i < length; i++) {
            body += ",";
        }
        return body;
    }
    function getImageUrl(id) {
        var imageObj = file.load({ id: id });
        return "./images/" + imageObj.name;
    }
    function getPDFUrl(id) {
        var imageObj = file.load({ id: id });
        return imageObj.url;
    }
    function getImages(type, id) {
        var images = [];
        var imageR = record.load({ type: type, id: id });
        var numImages = imageR.getLineCount({
            sublistId: 'itemimages'
        });
        if (numImages > 0) {
            var nkey = void 0, fileObject = void 0;
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
    function filterImages(images, line, result) {
        if (images.length == 0) {
            return images;
        }
        var newImages = [], urlL, newScores = [];
        for (var i = 0; i < images.length; i++) {
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
        var change = false, swap;
        do {
            for (var i = 0; i < newScores.length - 1; i++) {
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
    function map(context) {
        if (!abort()) {
            log.debug("Process MAP", "context=" + context.key);
            var searchResult = JSON.parse(context.value);
            //log.debug("Process MAP", "searchResult=" + JSON.stringify(searchResult));
            var commercecategoryid = searchResult.values.commercecategoryid;
            var category = record.load({ type: "commercecategory", id: commercecategoryid });
            var categoryname = category.getValue("name");
            var primaryparent = category.getValue("primaryparent");
            var parentcategory = record.load({ type: "commercecategory", id: primaryparent });
            var parentcategoryname = parentcategory.getValue("name");
            var parentcategorythumbnail = parentcategory.getValue("thumbnail");
            var parentcategorythumbnail_url = void 0, parentcategorythumbnail_pdf = void 0;
            if (parentcategorythumbnail) {
                parentcategorythumbnail_url = getImageUrl(parentcategorythumbnail);
                parentcategorythumbnail_pdf = getPDFUrl(parentcategorythumbnail);
            }
            var value = {
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
            var facetNumber = 0;
            for (var i = 0; i < facets.length; i++) {
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
    function reduce(context) {
        if (!abort()) {
            log.debug("Process Reduce", "context=" + context.key + " " + JSON.stringify(context.values));
            var custscript_c25_catalogue_catalogue = runtime.getCurrentScript().getParameter({
                name: 'custscript_c25_catalogue_catalogue'
            });
            var categories = runtime.getCurrentScript().getParameter({
                name: 'custscript_c25_catalogue_categories'
            }).split(",");
            var line_1, lastCategory = void 0, lastSubCategory = void 0; //, body: string = "", xml: string = "<Root>\r\n";
            var childSearchObj = void 0;
            var catFolder = 646164;
            var columns = void 0, images_1, filteredImages_1, childIndex_1;
            log.debug("Generate", "XTG");
            var xtg = "";
            xtg = "<v7.00><e9>\r\n";
            xtg += getXTGStyles();
            xtg += setOrigin(margin, margin);
            //sort sequence
            var swap = void 0, change = void 0;
            do {
                change = false;
                for (var i = 0; i < context.values.length - 1; i++) {
                    if (context.values[i].sequence > context.values[i + 1]) {
                        swap = context.values[i];
                        context.values[i] = context.values[i + 1];
                        context.values[i + 1] = swap;
                        change = true;
                    }
                }
            } while (change);
            for (var j = 0; j < categories.length; j++) {
                var _loop_1 = function (i) {
                    line_1 = JSON.parse(context.values[i]);
                    if (line_1.parentcategoryname == categories[j]) {
                        //main category line
                        if (categories[j] != lastCategory) {
                            //log.debug("Process Reduce", "cat " + categories[j]);
                            if (lastCategory) {
                                xtg += getXTGNextPage();
                            }
                            lastCategory = categories[j];
                            xtg += getXTGCategory(categories[j], line_1.parentcategorythumbnail_url);
                        }
                        //sub category line
                        if (line_1.categoryname != lastSubCategory) {
                            //log.debug("Process Reduce", "sub cat " +line.parentcategoryname +" > "+line.categoryname);
                            lastCategory = categories[j];
                            xtg += getXTGSubCategory(line_1.categoryname, line_1.parentcategoryname);
                        }
                        //item
                        log.debug("Process Reduce", i + "=" + JSON.stringify(line_1));
                        var item_1 = {
                            layout: line_1.layout,
                            name: line_1.displayname,
                            sku: getSku(line_1.itemid),
                            description: line_1.description,
                            link: line_1.urlcomponent,
                            matrix: line_1.matrix
                        }, child_1;
                        images_1 = getImages(line_1.type, line_1.id);
                        //log.debug("images", JSON.stringify(images));
                        if (!line_1.matrix) {
                            item_1.baseprice = line_1.baseprice;
                            item_1.onlineprice = line_1.onlineprice || line_1.baseprice;
                        }
                        if (line_1.features) {
                            item_1.features = line_1.features;
                        }
                        if (line_1.instructions) {
                            item_1.instructions = line_1.instructions;
                        }
                        if (line_1.included) {
                            item_1.included = line_1.included;
                        }
                        if (line_1.techspecs) {
                            item_1.techspecs = line_1.techspecs;
                        }
                        if (line_1.safety) {
                            item_1.safety = line_1.safety;
                        }
                        if (line_1.recommended) {
                            item_1.recommended = line_1.recommended;
                        }
                        if (images_1[0]) {
                            item_1.image1 = images_1[0].pdf;
                            item_1.image1_url = images_1[0].url;
                        }
                        if (images_1[1]) {
                            item_1.image2 = images_1[1].pdf;
                            item_1.image2_url = images_1[1].url;
                        }
                        if (images_1[2]) {
                            item_1.image3 = images_1[2].pdf;
                            item_1.image3_url = images_1[2].url;
                        }
                        if (line_1.optionname1) {
                            item_1.optionname1 = line_1.optionname1;
                        }
                        if (line_1.optionname2) {
                            item_1.optionname2 = line_1.optionname2;
                        }
                        if (line_1.optionname3) {
                            item_1.optionname3 = line_1.optionname3;
                        }
                        item_1.children = [];
                        if (line_1.matrix) {
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
                            if (line_1.optionid1) {
                                columns.push(search.createColumn({ name: line_1.optionid1 }));
                            }
                            if (line_1.optionid2) {
                                columns.push(search.createColumn({ name: line_1.optionid2 }));
                            }
                            if (line_1.optionid3) {
                                columns.push(search.createColumn({ name: line_1.optionid3 }));
                            }
                            childSearchObj = search.create({
                                type: "item",
                                filters: [
                                    ["parent", "anyof", line_1.id],
                                    "AND",
                                    ["custitem_c25_cataloguedisplay", "anyof", custscript_c25_catalogue_catalogue],
                                    "AND",
                                    ["isinactive", "is", "F"]
                                ],
                                columns: columns
                            });
                            childIndex_1 = 0;
                            childSearchObj.run().each(function (result) {
                                //log.debug("Child", result.id);
                                child_1 = {
                                    name: line_1.displayname,
                                    sku: getSku(result.getValue("itemid")),
                                    baseprice: getPrice(result.getValue("baseprice")),
                                    onlineprice: getPrice(result.getValue("onlineprice") || result.getValue("baseprice"))
                                };
                                childIndex_1++;
                                filteredImages_1 = filterImages(images_1, line_1, result);
                                if (line_1.optionname1) {
                                    child_1.optionvalue1 = result.getText(line_1.optionid1);
                                }
                                if (line_1.optionname2) {
                                    child_1.optionvalue2 = result.getText(line_1.optionid2);
                                }
                                if (line_1.optionname3) {
                                    child_1.optionvalue3 = result.getText(line_1.optionid3);
                                }
                                if (filteredImages_1[0]) {
                                    child_1.image1 = filteredImages_1[0].url;
                                }
                                if (filteredImages_1[1]) {
                                    child_1.image2 = filteredImages_1[1].url;
                                }
                                if (filteredImages_1[2]) {
                                    child_1.image3 = filteredImages_1[2].url;
                                }
                                item_1.children.push(child_1);
                                return true;
                            });
                        }
                        //end of children
                        xtg += getXTGItem(item_1);
                    }
                };
                for (var i = 0; i < context.values.length; i++) {
                    _loop_1(i);
                }
            }
            var date = new Date();
            var filename = "";
            switch (custscript_c25_catalogue_catalogue) {
                case "1":
                    filename += "UK-";
                    break;
            }
            filename += date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-Catalogue";
            var newFile = file.create({ folder: catFolder, contents: xtg, name: filename + ".xtg", encoding: "UTF-8", fileType: "PLAINTEXT" });
            newFile.save();
        }
    }
    // 
    function setOrigin(x, y) {
        var xtg = "";
        xtg += "<&o(" + x + "," + y + ")>";
        return xtg;
    }
    function getXTGNextPage() {
        var xtg = "";
        if (pos.x != 0 || pos.y != 0) {
            xtg += "<\\b>";
            pos.x = 0;
            pos.y = 0;
            lineHeight = 0;
        }
        return xtg;
    }
    function getXTGStyles() {
        var xtg = "";
        xtg += "@NormalParagraphStyle=[S\"\",\"NormalParagraphStyle\"]<z16f\"Roboto-Regular\">" + setColour("StonetoolsCopy") + br;
        xtg += "@Category Title=[S\"\",\"Category Title\"]<z30f\"Roboto-Regular\"><B>" + setColour("StonetoolsCopyDark") + br;
        xtg += "@Sub Category=[S\"\",\"Sub Category\"]<z12f\"Roboto-Regular\">" + setColour("StonetoolsCopy") + br;
        xtg += "@Table Head=[S\"\",\"Table Head\"]<z9f\"Roboto-Regular\">" + setColour("StonetoolsTableHead") + br;
        xtg += "@Table Cell=[S\"\",\"Table Cell\"]<z9f\"Roboto-Regular\">" + setColour("StonetoolsCopy") + br;
        xtg += "@Table Cell Price=[S\"\",\"Table Cell Price\"]<z9f\"Roboto-Regular\"><B>" + setColour("StonetoolsGreen") + br;
        xtg += "@QR Url=[S\"\",\"QR Url\"]<z9f\"Roboto-Regular\">" + setColour("Black") + br;
        var layouts = ["Small", "Medium", "Large", "Hero", "Compare"];
        for (var i = 0; i < layouts.length; i++) {
            if (layouts[i] == "Hero") {
                xtg += "@" + layouts[i] + " Item Title=[S\"\",\"" + layouts[i] + " Item Title\"]<z24f\"Roboto-Regular\"><B>" + setColour("StonetoolsCopyDark") + br;
                xtg += "@" + layouts[i] + " Item Subtitle=[S\"\",\"" + layouts[i] + " Item Subtitle\"]<z16f\"Roboto-Regular\"><B>" + setColour("StonetoolsCopyDark") + br;
            }
            else {
                xtg += "@" + layouts[i] + " Item Title=[S\"\",\"" + layouts[i] + " Item Title\"]<z16f\"Roboto-Regular\"><B>" + setColour("StonetoolsCopyDark") + br;
                xtg += "@" + layouts[i] + " Item Subtitle=[S\"\",\"" + layouts[i] + " Item Subtitle\"]<z12f\"Roboto-Regular\"><B>" + setColour("StonetoolsCopyDark") + br;
            }
            xtg += "@" + layouts[i] + " Item Sku=[S\"\",\"" + layouts[i] + " Item Sku\"]<z12f\"Roboto-Regular\">" + setColour("StonetoolsCopy") + br;
            xtg += "@" + layouts[i] + " Item Description=[S\"\",\"" + layouts[i] + " Item Description\"]<z12f\"Roboto-Regular\">" + setColour("StonetoolsCopy") + br;
            xtg += "@" + layouts[i] + " Item Price=[S\"\",\"" + layouts[i] + " Item Price\"]<z12f\"Roboto-Regular\"><B>" + setColour("StonetoolsGreen") + br;
        }
        return xtg;
    }
    function getXTGCategory(name, image) {
        var xtg = "";
        var width = innerSize.width, height = innerSize.height * .25, medheight = height * .41;
        xtg += checkForNewPage(width, height);
        var scale = [.3, .5, .7, .9], ix = width * .15;
        for (var i = 0; i < scale.length; i++) {
            xtg += getPicture(image, pos.x + ix, pos.y + height - (height * scale[i]) - (i * (height * .0333)), height * scale[i], height * scale[i]);
            ix += height * scale[i];
        }
        xtg += getRectangle("StonetoolsVeryDarkGrey", pos.x, pos.y, width, height);
        xtg += startTextbox(pos.x, pos.y + (height * .375), width, height * .25);
        xtg += setStyle("Category Title") + XString(name);
        xtg += endTextbox();
        var link = name;
        link = link.toLowerCase();
        link = link.split(" ").join("-");
        xtg += getQR("https://www.stonetools.co.uk/" + link, pos.x + innerSize.width - medheight, pos.y, medheight, medheight);
        xtg += getGroup(3);
        movePos(width, height);
        return xtg;
    }
    function getXTGSubCategory(name, parent) {
        var xtg = "";
        var width = innerSize.width, height = innerSize.height * .05;
        xtg += checkForNewPage(width, height);
        xtg += startTextbox(pos.x, pos.y + (height * .25), width, height * .5);
        xtg += setStyle("Sub Category") + XString(parent.toUpperCase()) + " " + setColour("StonetoolsCopyDark") + "/ " + XString(name.toUpperCase()) + defaultColour();
        xtg += endTextbox();
        xtg += getGroup(1);
        movePos(width, height);
        return xtg;
    }
    function getXTGItem(item) {
        var xtg = "";
        var width = innerSize.width, height = innerSize.height * .2, group = 2;
        var rowHeight = innerSize.height * .022, childHeight = item.matrix ? (1 + item.children.length) * rowHeight : 0;
        var spacing = rowHeight = innerSize.height * .01, extraImageHeight = 0;
        var fontWidth = innerSize.height * .0075;
        var isLarge = item.layout == "Hero" || item.layout == "Large";
        var isSmall = item.layout == "Small" || item.layout == "Medium";
        if (item.layout == "Medium") {
            width = (width - spacing) / 2;
            height = innerSize.height * .2;
        }
        else if (item.layout == "Small" || item.layout == "Compare") {
            width = (width - spacing - spacing) / 3;
            height = innerSize.height * .14;
        }
        var text = item.name + "\n" + item.sku + "\n\n" + item.description + "\n\n";
        if (item.features && (isLarge || item.layout == "Compare")) {
            text += "Features\n" + item.features + "\n";
            if (item.layout == "Hero" || item.layout == "Compare") {
                xtg += "\n";
            }
        }
        if (!item.matrix) {
            text += "0.00\n";
        }
        var descWidth = width - (height * 1.05);
        if (isSmall || item.layout == "Hero" || item.layout == "Compare") {
            descWidth = width;
        }
        var textHeight = guessHeight(text, descWidth, fontWidth);
        if ((item.image2_url || item.image3_url) && isLarge) {
            extraImageHeight = (height + spacing) / 2;
        }
        if (item.layout == "Compare" || item.layout == "Hero") {
            xtg += checkForNewPage(width, innerSize.height - .1);
        }
        else {
            xtg += checkForNewPage(width, Math.max(textHeight, height) + Math.max(childHeight, extraImageHeight));
        }
        if (isSmall) {
            xtg += getPicture(item.image1_url, pos.x + ((width - height) / 2), pos.y, height, height);
            xtg += startTextbox(pos.x, pos.y + height + spacing, width, textHeight);
        }
        else if (item.layout == "Compare") {
            xtg += getPicture(item.image1_url, pos.x, pos.y, width, width);
            xtg += startTextbox(pos.x, pos.y + width + spacing, width, innerSize.height - width - childHeight - spacing - spacing);
        }
        else if (item.layout == "Hero") {
            var bigHeight = height * 1.75, medheight = height * .85;
            xtg += getPicture(item.image1_url, pos.x, pos.y, bigHeight, bigHeight);
            if (item.image2_url) {
                xtg += getPicture(item.image2_url, pos.x + bigHeight + spacing, pos.y, medheight, medheight);
                group++;
            }
            if (item.image3_url) {
                xtg += getPicture(item.image3_url, pos.x + bigHeight, pos.y + spacing + medheight, medheight, medheight);
                group++;
            }
            xtg += getQR("https://www.stonetools.co.uk/" + item.link, pos.x + innerSize.width - medheight, pos.y, medheight, medheight);
            group++;
            xtg += startTextbox(pos.x, pos.y + bigHeight + spacing, descWidth, innerSize.height - bigHeight - childHeight - spacing - spacing);
        }
        else {
            xtg += getPicture(item.image1_url, pos.x, pos.y, height, height);
            if (item.image2_url && isLarge) {
                xtg += getPicture(item.image2_url, pos.x, pos.y + height + spacing, (height - spacing) / 2, (height - spacing) / 2);
                group++;
            }
            if (item.image3_url && isLarge) {
                xtg += getPicture(item.image3_url, pos.x + ((height + spacing) / 2), pos.y + height + spacing, (height - spacing) / 2, (height - spacing) / 2);
                group++;
            }
            if (item.layout == "Compare") {
                xtg += startTextbox(pos.x + (height * 1.05), pos.y, descWidth, innerSize.height - height - childHeight - spacing - spacing);
            }
            else {
                xtg += startTextbox(pos.x + (height * 1.05), pos.y, descWidth, Math.max(textHeight, height));
            }
        }
        xtg += setStyle(item.layout + " Item Title") + XString(item.name) + br;
        xtg += setStyle(item.layout + " Item Sku") + "CODE: " + XString(item.sku) + br + br;
        xtg += setStyle(item.layout + " Item Description") + XString(item.description) + br + br;
        if (item.features && (isLarge || item.layout == "Compare")) {
            xtg += setStyle(item.layout + " Item Subtitle") + XString("Features") + br;
            if (item.layout == "Hero" || item.layout == "Compare") {
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
            }
            else if (item.layout == "Compare" || item.layout == "Hero") {
                xtg += getMatrixOptions(item, pos.x, pos.y + innerSize.height - childHeight, descWidth);
            }
            else {
                xtg += getMatrixOptions(item, pos.x + (height * 1.05), pos.y + Math.max(textHeight, height), descWidth);
            }
            group++;
        }
        xtg += getGroup(group);
        if (isSmall) {
            movePos(width + spacing, textHeight + height + spacing + childHeight);
        }
        else if (item.layout == "Hero") {
            movePos(width, innerSize.height);
        }
        else {
            movePos(width, Math.max(textHeight, height) + Math.max(childHeight, extraImageHeight));
        }
        return xtg;
    }
    function getMatrixOptions(item, left, top, tableWidth) {
        var xtg = "";
        var height = innerSize.height * .2;
        var lineWidth = innerSize.height * .0015, cellPaddingX = innerSize.height * .01, cellPaddingY = innerSize.height * .003;
        var group = 0, columns = 2;
        var rowHeight = innerSize.height * .022, childHeight = item.matrix ? (1 + item.children.length) * rowHeight : 0, originalLeft = left;
        if (item.optionname1) {
            columns++;
        }
        if (item.optionname2) {
            columns++;
        }
        if (item.optionname3) {
            columns++;
        }
        var columnWidth = tableWidth / columns;
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
        for (var i = 0; i < item.children.length; i++) {
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
    function getGroup(frames) {
        var xtg = "";
        xtg += "<&g(";
        for (var i = frames; i > 0; i--) {
            xtg += i;
            if (i > 1) {
                xtg += ",";
            }
        }
        xtg += ")>";
        return xtg;
    }
    function setStyle(style) {
        if (style === void 0) { style = "$"; }
        var xtg = "";
        xtg += "@" + style + ":";
        return xtg;
    }
    function getTextbox(x, y, width, height, style, text) {
        var xtg = "";
        xtg += startTextbox(x, y, width, height);
        xtg += setStyle(style) + XString(text) + br;
        xtg += endTextbox();
        return xtg;
    }
    function startTextbox(x, y, width, height) {
        var xtg = "";
        xtg += "<&tbu2(" + x.toFixed(2) + "," + y.toFixed(2) + "," + width.toFixed(2) + "," + height.toFixed(2) + ",0,0,,n,,,,,,,,,,,,,,,,\"Layer 1\",\"[Normal Text Frame]\")>";
        return xtg;
    }
    function endTextbox() {
        var xtg = "";
        xtg += "<&te>";
        return xtg;
    }
    function setColour(name) {
        return "<c\"" + name + "\">";
    }
    function defaultColour() {
        return "<c$>";
    }
    function getPicture(image, x, y, width, height) {
        var xtg = "";
        var skew = 0;
        var angle = 0;
        xtg += "<&pbu2(" + x.toFixed(2) + "," + y.toFixed(2) + "," + width.toFixed(2) + "," + height.toFixed(2) + "," + angle + "," + skew + ",,,,,,,,,,," + (width * .37) + "," + (height * .37) + ",0,0,0,0,\"" + image + "\",,,\"Layer 1\",\"[None]\")>";
        return xtg;
    }
    function getQR(url, x, y, width, height) {
        var xtg = "";
        var skew = 0;
        var angle = 0;
        var border = height * .05;
        x += border + border;
        y += border + border;
        width -= border * 4;
        height -= border * 4;
        xtg += getRectangle("StonetoolsTableHead", x, y, width, height);
        xtg += getRectangle("Paper", x + border, y + border, width - border - border, height - border - border);
        xtg += getTextbox(x + border, y + border, width - border - border, height - border - border, "QR Url", url);
        xtg += getGroup(3);
        return xtg;
    }
    function getRectangle(colour, x, y, width, height) {
        var xtg = "";
        var skew = 0;
        var angle = 0;
        xtg += "<&nbu2(" + x.toFixed(2) + "," + y.toFixed(2) + "," + width.toFixed(2) + "," + height.toFixed(2) + "," + angle + "," + skew + ",,n,0,(n,),,,\"" + colour + "\",,,,\"Layer 1\",\"[Normal Graphics Frame]\")>";
        return xtg;
    }
    function movePos(width, height) {
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
    function checkForNewPage(width, height) {
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
    function getBr() {
        var xtg = "";
        xtg += "<\\n>";
        return xtg;
    }
    function guessHeight(text, width, fontWidth) {
        var x = 0, y = 0, fontHeight = fontWidth * 1.4, line = "";
        y += fontHeight;
        for (var i = 0; i < text.length; i++) {
            if (text.charAt(i) == "\n") {
                x = 0;
                y += fontHeight;
                //log.debug("Return",line);
                line = "";
            }
            else {
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
    function summarize(summary) {
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
    var isAbort = false;
    function abort() {
        if (isAbort) {
            return isAbort;
        }
        var abort = runtime.getCurrentScript().getParameter({
            name: 'custscript_c25_catalogue_abort'
        });
        var newAbort = (abort == "T" || abort == true);
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
