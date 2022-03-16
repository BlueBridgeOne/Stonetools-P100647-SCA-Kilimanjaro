/**
 * Project: P100647
 *
 * Change the color swatch when the color is updated.
 * 
 * Set a url when the name is set.
 *
 * Date			Author			Purpose		
 * 27 Nov 2017	Gordon Truslove	Initial release
 *
 * Copyright (c) 2017 BlueBridge One Business Solutions, All Rights Reserved
 * support@bluebridgeone.com, +44 (0)1932 300007
 *
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define([ 'N/record', 'N/ui/message' ],
/**
 * @param {record} record
 */
function(record, message) {

	/**
	* Function to be executed after page is initialized.
	*
	* @param {Object} scriptContext
	* @param {Record} scriptContext.currentRecord - Current form record
	* @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
	*
	* @since 2015.2
	*/
	function pageInit(scriptContext) { //Set an initial value for the swatch.

	}

	/**
	 * Function to be executed when field is changed.
	 *
	 * @param {Object} scriptContext
	 * @param {Record} scriptContext.currentRecord - Current form record
	 * @param {string} scriptContext.sublistId - Sublist name
	 * @param {string} scriptContext.fieldId - Field name
	 * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
	 * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
	 *
	 * @since 2015.2
	 */
	function fieldChanged(scriptContext) {
		if (scriptContext.fieldId == "custrecord_bb1_sca_a_colour") { //The colour has changes so update the swatch
			var colour = scriptContext.currentRecord.getValue("custrecord_bb1_sca_a_colour");
			var swatchHTML = "<div style=\"margin-top:10px;background-color:" + (colour || "black") + ";width:200px;height:25px;\"></div>";
			var swatchElement = document.getElementById("custrecord_bb1_sca_a_swatch_val");
			if (swatchElement) {
				swatchElement.innerHTML = swatchHTML;
			}
		}

		if (scriptContext.fieldId == "name") { //If the url is blank, set a url
			var url = scriptContext.currentRecord.getValue("custrecord_bb1_sca_a_url");
			var name = scriptContext.currentRecord.getValue("name");
			if (!url || url.length == 0 && name && name.length != 0) {
				var body = "", charCode, char, lastDash;
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
				scriptContext.currentRecord.setValue({
					fieldId : "custrecord_bb1_sca_a_url",
					value : body
				});
			}
		}

		if (scriptContext.fieldId == "custrecord_bb1_sca_a_priority") { //If the priority changes, set default page width
			var R = scriptContext.currentRecord;
			var priority = R.getValue("custrecord_bb1_sca_a_priority");
			var homepagewidth = R.getValue("custrecord_bb1_sca_a_homepagewidth"), pagewidth = R.getValue("custrecord_bb1_sca_a_pagewidth"), newpagewidth = pagewidth || 1, newhomepagewidth = homepagewidth || 1;
			if (!(pagewidth > 1 && homepagewidth > 1)) {

				var Priorities = {
					LargeBanner : 1,
					MediumImage : 2,
					Standard : 3,
					Archive : 4,
					Hidden : 5,
					HomePageBanner : 6,
					HomePageText : 7,
					HomePageImage : 8
				};
				var Widths = {
					Full : 1,
					OneThird : 2,
					TwoThirds : 3,
					OneQuarter : 4,
					Half : 5,
					ThreeQuarters : 6
				};
				if (priority == Priorities.HomePageBanner) {
					newhomepagewidth = Widths.Full;
				}
				if (priority == Priorities.LargeBanner || priority == Priorities.Hidden) {
					newpagewidth = Widths.Full;
				}
				if (priority == Priorities.HomePageText || priority == Priorities.HomePageImage) {
					newhomepagewidth = Widths.Half;
					newpagewidth = Widths.Half;
				}
				if (priority == Priorities.Standard || priority == Priorities.Archive) {
					newpagewidth = Widths.Half;
					newhomepagewidth = Widths.Half;
				}
				if (priority == Priorities.MediumImage) {
					newpagewidth = Widths.OneQuarter;
					newhomepagewidth = Widths.OneQuarter;
				}
				if (pagewidth != newpagewidth) {
					R.setValue({
						fieldId : "custrecord_bb1_sca_a_pagewidth",
						value : newpagewidth
					});
				}
				if (homepagewidth != newhomepagewidth) {
					R.setValue({
						fieldId : "custrecord_bb1_sca_a_pagewidth",
						value : newhomepagewidth
					});
				}
			}
		}
	}

	return {
		pageInit : pageInit,
		fieldChanged : fieldChanged
	};

});
