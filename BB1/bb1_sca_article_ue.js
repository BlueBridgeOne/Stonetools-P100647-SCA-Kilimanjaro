/**
 * Project: P100647
 *
 * Add an approval button to an article. Only for certain roles and when the record is not approved.
 * 
 * Set the swatch colour.
 * 
 * Clear approval when copying record.
 *
 * Date			Author			Purpose		
 * 27 Nov 2017	Gordon Truslove	Initial release
 *
 * Copyright (c) 2017 BlueBridge One Business Solutions, All Rights Reserved
 * support@bluebridgeone.com, +44 (0)1932 300007
 *
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define([ 'N/record', 'N/ui/serverWidget', 'N/runtime' ],

function(record, serverWidget, runtime) {

	/**
	 * Function definition to be triggered before record is loaded.
	 *
	 * @param {Object} scriptContext
	 * @param {Record} scriptContext.newRecord - New record
	 * @param {string} scriptContext.type - Trigger type
	 * @param {Form} scriptContext.form - Current form
	 * @Since 2015.2
	 */
	function beforeLoad(scriptContext) {

		var currentRecord = scriptContext.newRecord;

//		if (scriptContext.type == "create" || scriptContext.type == "edit") {
//			scriptContext.form.getField({
//				id : "custrecord_147_cseg_bb1_website_se"
//			}).defaultValue = 1;
//		}

		if (scriptContext.type == "view") {

			var approved = currentRecord.getValue({
				fieldId : 'custrecord_bb1_sca_a_approved'
			});
			if (!approved) { //Add approve button
				var user = runtime.getCurrentUser().id;
				var owner = currentRecord.getValue({
					fieldId : 'owner'
				});
				var role = runtime.getCurrentUser().role;
				if (user != owner || role == 3) { //Must be a different person or an administrator

					if (role == 3 || role == 1017 || role == 1021) { //only show the approve button for certain roles.
						log.debug("testing", "add " + approved + " " + scriptContext.type + " " + role);

						scriptContext.form.clientScriptModulePath = "./bb1_sca_article_approve_cl.js";

						scriptContext.form.addButton({
							id : 'custpage_approvebutton',
							label : 'Approve',
							functionName : 'bb1_approve_article'
						});
					}
				}
			}
		}

		//Set swatch html
		var colour = currentRecord.getValue("custrecord_bb1_sca_a_colour");
		var swatchHTML = "<div style=\"margin-top:10px;background-color:" + (colour || "black") + ";width:200px;height:25px;\"></div>";

		var swatchField = scriptContext.form.getField({
			id : 'custrecord_bb1_sca_a_swatch'
		});
		if (swatchField) {
			swatchField.defaultValue = swatchHTML;
		}

		//clear approval
		if (scriptContext.type == "copy") {
			currentRecord.setValue({
				fieldId : 'custrecord_bb1_sca_a_approved',
				value : false
			});
			currentRecord.setValue({
				fieldId : 'custrecord_bb1_sca_a_approvedby',
				value : null
			});
		}
	}
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

		if (scriptContext.type == "delete")
			return;

		//set url fragment
		var R = scriptContext.newRecord;
		var name = R.getValue({
			fieldId : 'name'
		});

		//force home page order;

		var site = R.getValue("custrecord_147_cseg_bb1_website_se");
		if (!site) {
			currentRecord.setValue({
				fieldId : 'custrecord_147_cseg_bb1_website_se',
				value : 1
			});
		}

		//If the url is blank, set a url
		var url = R.getValue("custrecord_bb1_sca_a_url");
		var name = R.getValue("name");
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
			if (body.length > 0) {
				R.setValue({
					fieldId : "custrecord_bb1_sca_a_url",
					value : body
				});
			}
		}
		//Copy Content to plain text field.
		var content = R.getValue("custrecord_bb1_sca_a_content");
		var contentastext = R.getValue("custrecord_bb1_sca_a_contentastext");
		if (content != contentastext) {
			R.setValue({
				fieldId : 'custrecord_bb1_sca_a_contentastext',
				value : content,
				ignoreFieldChange : true
			});

		}

		//Set default page widths
		if (false) { //TEMP, only used for mass update.
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
		beforeSubmit : beforeSubmit,
		beforeLoad : beforeLoad

	};

});
