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
                features: cleanHTML(searchResult.values.custitem_bb1_sca_features_en),
                instructions: cleanHTML(searchResult.values.custitem_bb1_sca_instructions_en),
                included: cleanHTML(searchResult.values.custitem_bb1_sca_included_en),
                techspecs: cleanHTML(searchResult.values.custitem_bb1_sca_techspecs_en),
                safety: cleanHTML(searchResult.values.custitem_bb1_sca_safety_en),
                recommended: cleanHTML(searchResult.values.custitem_bb1_sca_recommended_en),
                urlcomponent: searchResult.values.urlcomponent
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
            var line_1, lastCategory = void 0, lastSubCategory = void 0, body_1 = "", xml_1 = "<Root>\r\n";
            var catColumns = ["categoryname", "parentcategoryname", "breadcrumbs", "@parentcategorythumbnail"];
            var itemColumns = ["displayname", "sku", "baseprice", "onlineprice", "description", "optionname1", "optionvalue1", "optionname2", "optionvalue2", "optionname3", "optionvalue3", "features", "instructions", "included", "techspecs", "safety", "recommended", "urlcomponent", "@image1", "@image2", "@image3"];
            var childSearchObj = void 0;
            var catFolder = 646164;
            var columns = void 0, images_1, filteredImages_1, childIndex_1;
            log.debug("Generate", "HTML");
            var xtg = ""; //html: string = "",
            // html = "<head>";
            // html += getStyles();
            // html += "</head>\n<body width=\"" + getPDFSize().width + "\" height=\"" + getPDFSize().height + "\" >";
            // html += getFrontPage();
            body_1 += "layout";
            for (var i = 0; i < catColumns.length; i++) {
                body_1 += "," + catColumns[i];
            }
            for (var i = 0; i < itemColumns.length; i++) {
                body_1 += "," + itemColumns[i];
            }
            body_1 += "\r\n";
            xtg = "<v7.00><e9>\r\n";
            xtg += getXTGStyles();
            xtg += setOrigin(margin, margin);
            for (var j = 0; j < categories.length; j++) {
                for (var i = 0; i < context.values.length; i++) {
                    line_1 = JSON.parse(context.values[i]);
                    if (line_1.parentcategoryname == categories[j]) {
                        //main category line
                        if (categories[j] != lastCategory) {
                            //log.debug("Process Reduce", "cat " + categories[j]);
                            if (lastCategory) {
                                xtg += getXTGNextPage();
                            }
                            lastCategory = categories[j];
                            body_1 += CSVString("Category") + "," + CSVString(categories[j]) + ",," + CSVString(categories[j]) + "," + CSVString(line_1.parentcategorythumbnail_url);
                            body_1 += addCommas(itemColumns.length);
                            body_1 += "\r\n";
                            xml_1 += "\t<Category><Name>" + XMLString(categories[j]) + "</Name><Image href=\"" + XMLString(line_1.parentcategorythumbnail_url) + "\"></Image></Category>\r\n";
                            //html += getPDFCategory(categories[j], line.parentcategorythumbnail_pdf);
                            xtg += getXTGCategory(categories[j], line_1.parentcategorythumbnail_url);
                        }
                        //sub category line
                        if (line_1.categoryname != lastSubCategory) {
                            //log.debug("Process Reduce", "sub cat " +line.parentcategoryname +" > "+line.categoryname);
                            lastCategory = categories[j];
                            body_1 += CSVString("Subcategory") + "," + CSVString(categories[j]) + "," + CSVString(line_1.parentcategoryname) + "," + CSVString(line_1.parentcategoryname + " > " + line_1.categoryname) + ",";
                            body_1 += addCommas(itemColumns.length);
                            body_1 += "\r\n";
                            xml_1 += "\t<SubCategory><Name>" + XMLString(line_1.categoryname) + "</Name><ParentName>" + XMLString(line_1.parentcategoryname) + "</ParentName><Breadcrumbs>" + XMLString(line_1.parentcategoryname + " > " + line_1.categoryname) + "</Breadcrumbs></SubCategory>\r\n";
                            //html += getPDFSubCategory(line.categoryname, line.parentcategoryname);
                            xtg += getXTGSubCategory(line_1.categoryname, line_1.parentcategoryname);
                        }
                        //item
                        log.debug("Process Reduce", i + "=" + JSON.stringify(line_1));
                        var item = {
                            layout: line_1.layout,
                            name: line_1.displayname,
                            sku: getSku(line_1.itemid),
                            description: line_1.description
                        };
                        images_1 = getImages(line_1.type, line_1.id);
                        //log.debug("images", JSON.stringify(images));
                        xml_1 += "\t<" + line_1.layout + "Item>\r\n";
                        body_1 += CSVString(line_1.layout) + "," + CSVString(categories[j]) + "," + CSVString(line_1.parentcategoryname) + "," + CSVString(line_1.parentcategoryname + " > " + line_1.categoryname) + ",," + CSVString(line_1.displayname) + "," + CSVString(getSku(line_1.itemid)) + "," + CSVString(!line_1.matrix && getPrice(line_1.baseprice)) + "," + CSVString(!line_1.matrix && getPrice(line_1.onlineprice || line_1.baseprice)) + "," + CSVString(line_1.description) + "," + CSVString(line_1.optionname1) + "," + CSVString(!line_1.matrix && line_1.optionvalue1) + "," + CSVString(line_1.optionname2) + "," + CSVString(!line_1.matrix && line_1.optionvalue2) + "," + CSVString(line_1.optionname3) + "," + CSVString(!line_1.matrix && line_1.optionvalue3) + "," + CSVString(line_1.features) + "," + CSVString(line_1.instructions) + "," + CSVString(line_1.included) + "," + CSVString(line_1.techspecs) + "," + CSVString(line_1.safety) + "," + CSVString(line_1.recommended) + "," + CSVString("https://www.stonetools.co.uk/" + line_1.urlcomponent) + "," + CSVString(images_1[0] && images_1[0].url) + "," + CSVString(images_1[1] && images_1[1].url) + "," + CSVString(images_1[2] && images_1[2].url);
                        body_1 += "\r\n";
                        xml_1 += "\t\t<Name>" + XMLString(line_1.displayname) + "</Name>\r\n";
                        xml_1 += "\t\t<Sku>" + XMLString(getSku(line_1.itemid)) + "</Sku>\r\n";
                        if (!line_1.matrix) {
                            xml_1 += "\t\t<BasePrice>" + XMLString(getPrice(line_1.baseprice)) + "</BasePrice>\r\n";
                            xml_1 += "\t\t<OnlinePrice>" + XMLString(getPrice(line_1.onlineprice || line_1.baseprice)) + "</OnlinePrice>\r\n";
                            item.baseprice = line_1.baseprice;
                            item.onlineprice = line_1.onlineprice || line_1.baseprice;
                        }
                        xml_1 += "\t\t<Description>" + XMLString(line_1.description) + "</Description>\r\n";
                        if (line_1.features) {
                            xml_1 += "\t\t<Features>" + XMLString(line_1.features) + "</Features>\r\n";
                        }
                        if (line_1.instructions) {
                            xml_1 += "\t\t<Instructions>" + XMLString(line_1.instructions) + "</Instructions>\r\n";
                        }
                        if (line_1.included) {
                            xml_1 += "\t\t<Included>" + XMLString(line_1.included) + "</Included>\r\n";
                        }
                        if (line_1.techspecs) {
                            xml_1 += "\t\t<TechSpecs>" + XMLString(line_1.techspecs) + "</TechSpecs>\r\n";
                        }
                        if (line_1.safety) {
                            xml_1 += "\t\t<Safety>" + XMLString(line_1.safety) + "</Safety>\r\n";
                        }
                        if (line_1.recommended) {
                            xml_1 += "\t\t<Recommended>" + XMLString(line_1.recommended) + "</Recommended>\r\n";
                        }
                        xml_1 += "\t\t<Link>https://www.stonetools.co.uk/" + XMLString(line_1.urlcomponent) + "</Link>\r\n";
                        if (images_1[0]) {
                            xml_1 += "\t\t<Image1 href=\"" + XMLString(images_1[0].url) + "\"></Image1>\r\n";
                            item.image1 = images_1[0].pdf;
                            item.image1_url = images_1[0].url;
                        }
                        if (images_1[1]) {
                            xml_1 += "\t\t<Image2 href=\"" + XMLString(images_1[1].url) + "\"></Image2>\r\n";
                            item.image2 = images_1[1].pdf;
                            item.image2_url = images_1[1].url;
                        }
                        if (images_1[2]) {
                            xml_1 += "\t\t<Image3 href=\"" + XMLString(images_1[2].url) + "\"></Image3>\r\n";
                            item.image3 = images_1[2].pdf;
                            item.image3_url = images_1[2].url;
                        }
                        if (line_1.optionname1) {
                            xml_1 += "\t\t<Option1><Label>" + XMLString(line_1.optionname1) + "</Label></Option1>\r\n";
                        }
                        if (line_1.optionname2) {
                            xml_1 += "\t\t<Option2><Label>" + XMLString(line_1.optionname2) + "</Label></Option2>\r\n";
                        }
                        if (line_1.optionname3) {
                            xml_1 += "\t\t<Option3><Label>" + XMLString(line_1.optionname3) + "</Label></Option3>\r\n";
                        }
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
                                childIndex_1++;
                                filteredImages_1 = filterImages(images_1, line_1, result);
                                body_1 += CSVString(line_1.layout) + "Child" + (childIndex_1 % 2 == 0 ? "Even" : "Odd") + ",,,,," + CSVString(result.getValue("displayname")) + "," + CSVString(getSku(result.getValue("itemid"))) + "," + CSVString(getPrice(result.getValue("baseprice"))) + "," + CSVString(getPrice(result.getValue("onlineprice") || result.getValue("baseprice"))) + ",," + CSVString(line_1.optionname1) + "," + CSVString(line_1.optionid1 && result.getText(line_1.optionid1)) + "," + CSVString(line_1.optionname2) + "," + CSVString(line_1.optionid2 && result.getText(line_1.optionid2)) + "," + CSVString(line_1.optionname3) + "," + CSVString(line_1.optionid3 && result.getText(line_1.optionid3)) + ",,,,,,,,," + CSVString(filteredImages_1[0] && filteredImages_1[0].url) + "," + CSVString(filteredImages_1[1] && filteredImages_1[1].url) + "," + CSVString(filteredImages_1[2] && filteredImages_1[2].url);
                                body_1 += "\r\n";
                                xml_1 += "\t\t<" + line_1.layout + "Child" + (childIndex_1 % 2 == 0 ? "Even" : "Odd") + ">\r\n";
                                xml_1 += "\t\t\t<Name>" + XMLString(line_1.displayname) + "</Name>\r\n";
                                xml_1 += "\t\t\t<Sku>" + XMLString(getSku(result.getValue("itemid"))) + "</Sku>\r\n";
                                xml_1 += "\t\t\t<BasePrice>" + XMLString(getPrice(result.getValue("baseprice"))) + "</BasePrice>\r\n";
                                xml_1 += "\t\t\t<OnlinePrice>" + XMLString(getPrice(result.getValue("onlineprice") || result.getValue("baseprice"))) + "</OnlinePrice>\r\n";
                                if (line_1.optionname1) {
                                    xml_1 += "\t\t\t<Option1><Label>" + XMLString(line_1.optionname1) + "</Label><Value>" + XMLString(result.getText(line_1.optionid1)) + "</Value></Option1>\r\n";
                                }
                                if (line_1.optionname2) {
                                    xml_1 += "\t\t\t<Option2><Label>" + XMLString(line_1.optionname2) + "</Label>><Value>" + XMLString(result.getText(line_1.optionid2)) + "</Value></Option2>\r\n";
                                }
                                if (line_1.optionname3) {
                                    xml_1 += "\t\t\t<Option3><Label>" + XMLString(line_1.optionname3) + "</Label>><Value>" + XMLString(result.getText(line_1.optionid3)) + "</Value></Option3>\r\n";
                                }
                                if (filteredImages_1[0]) {
                                    xml_1 += "\t\t\t<Image1 href=\"" + XMLString(filteredImages_1[0].url) + "\"></Image1>\r\n";
                                }
                                if (filteredImages_1[1]) {
                                    xml_1 += "\t\t\t<Image2 href=\"" + XMLString(filteredImages_1[1].url) + "\"></Image2>\r\n";
                                }
                                if (filteredImages_1[2]) {
                                    xml_1 += "\t\t\t<Image3 href=\"" + XMLString(filteredImages_1[2].url) + "\"></Image3>\r\n";
                                }
                                xml_1 += "\t\t</" + line_1.layout + "Child" + (childIndex_1 % 2 == 0 ? "Even" : "Odd") + ">\r\n";
                                return true;
                            });
                        }
                        //end of children
                        xml_1 += "\t</" + line_1.layout + "Item>\r\n";
                        //html += getPDFItem(item);
                        xtg += getXTGItem(item);
                    }
                }
            }
            xml_1 += "</Root>";
            //html += "</body>";
            //log.debug("CSV", body);
            var date = new Date();
            var filename = "";
            switch (custscript_c25_catalogue_catalogue) {
                case "1":
                    filename += "UK-";
                    break;
            }
            filename += date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-Catalogue";
            var newFile = file.create({ folder: catFolder, contents: body_1, name: filename + ".csv", encoding: "UTF-8", fileType: "CSV" });
            newFile.save();
            newFile = file.create({ folder: catFolder, contents: xml_1, name: filename + ".xml", encoding: "UTF-8", fileType: "XMLDOC" });
            newFile.save();
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
        var layouts = ["Small", "Medium", "Large", "Hero"];
        for (var i = 0; i < layouts.length; i++) {
            xtg += "@" + layouts[i] + " Item Title=[S\"\",\"" + layouts[i] + " Item Title\"]<z16f\"Roboto-Regular\"><B>" + setColour("StonetoolsCopyDark") + br;
            xtg += "@" + layouts[i] + " Item Sku=[S\"\",\"" + layouts[i] + " Item Sku\"]<z12f\"Roboto-Regular\">" + setColour("StonetoolsCopy") + br;
            xtg += "@" + layouts[i] + " Item Description=[S\"\",\"" + layouts[i] + " Item Description\"]<z12f\"Roboto-Regular\">" + setColour("StonetoolsCopy") + br;
            xtg += "@" + layouts[i] + " Item Price=[S\"\",\"" + layouts[i] + " Item Price\"]<z12f\"Roboto-Regular\"><B>" + setColour("StonetoolsGreen") + br;
        }
        return xtg;
    }
    function getXTGCategory(name, image) {
        var xtg = "";
        var width = innerSize.width, height = innerSize.height * .25;
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
        xtg += getGroup(2);
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
        var width = innerSize.width, height = innerSize.height * .2;
        xtg += checkForNewPage(width, height);
        xtg += getPicture(item.image1_url, pos.x, pos.y, height, height);
        xtg += startTextbox(pos.x + (height * 1.05), pos.y, width - (height * 1.05), height);
        xtg += setStyle(item.layout + " Item Title") + XString(item.name) + br;
        xtg += setStyle(item.layout + " Item Sku") + "CODE: " + XString(item.sku) + br + br;
        xtg += setStyle(item.layout + " Item Description") + XString(item.description) + br + br;
        xtg += setStyle(item.layout + " Item Price") + XString(getPrice(item.onlineprice || "0.00")) + br;
        xtg += endTextbox();
        xtg += getGroup(2);
        movePos(width, height);
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
    function startTextbox(x, y, width, height) {
        var xtg = "";
        xtg += "<&tbu2(" + x + "," + y + "," + width + "," + height + ",0,0,,n,,,,,,,,,,,,,,,,\"Layer 3\",\"[Normal Text Frame]\")>";
        return xtg;
    }
    function endTextbox() {
        var xtg = "";
        xtg += "<&te>";
        return xtg;
    }
    // function setColour(C: number, M: number, Y: number, K: number): string {
    // 	return "<c\"C=" + C + " M=" + M + " Y=" + Y + " K=" + K + "\">";
    // }
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
        xtg += "<&pbu2(" + x + "," + y + "," + width + "," + height + "," + angle + "," + skew + ",,,,,,,,,,," + (width * .37) + "," + (height * .37) + ",0,0,0,0,\"" + image + "\",,,\"Layer 1\",\"[None]\")>";
        return xtg;
    }
    function getRectangle(colour, x, y, width, height) {
        var xtg = "";
        var skew = 0;
        var angle = 0;
        xtg += "<&nbu2(" + x + "," + y + "," + width + "," + height + "," + angle + "," + skew + ",,n,0,(n,),,,\"" + colour + "\",,,,\"Layer 2\",\"[Normal Graphics Frame]\")>";
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
