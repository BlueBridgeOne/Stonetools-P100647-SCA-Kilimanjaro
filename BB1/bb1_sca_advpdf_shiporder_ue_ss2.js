/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 * 
 * BB1 G Truslove - on web item fulfillment send out email.
 * 
 * Updated by Pan Florentzos (BB1) 31/07/2020
 * Originally, this script worked under three possible modes: CREATE, EDIT, SHIP.
 * Changed to operating under just CREATE mode as requested by Rhys Gottvald and confirmed by Ross Mead (Stonetools)
 */
define([ 'N/record', 'N/email', 'N/render', 'N/runtime', 'N/config', 'N/search', 'N/file' ],
/**
 * @param {email} email
 * @param {render} render
 */
function(record, email, render, runtime, config, search, file) {

	/**
	 * Function definition to be triggered before record is loaded.
	 *
	 * @param {Object} scriptContext
	 * @param {Record} scriptContext.newRecord - New record
	 * @param {Record} scriptContext.oldRecord - Old record
	 * @param {string} scriptContext.type - Trigger type
	 * @Since 2015.2
	 */
	function afterSubmit(scriptContext) {

		var tranid = "#IF " + scriptContext.newRecord.id;
		var ifid = scriptContext.newRecord.id;

		if (scriptContext.type == 'create' || scriptContext.type == 'edit' || scriptContext.type == 'ship') {

			try {

				log.debug("Item Fulfillment Saved", "Testing After " + scriptContext.type + " " + scriptContext.newRecord.id + " " + JSON.stringify(runtime.executionContext) + " " + (runtime.executionContext == "USERINTERFACE"));

				var IF = scriptContext.newRecord || scriptContext.oldRecord;
				var tranid = IF.getValue("tranid");

				var salesorderid = IF.getValue("createdfrom");
				var createdfrom = ifid;

				var SO = record.load({
					type : record.Type.SALES_ORDER,
					id : salesorderid,
					isDynamic : false
				});

				if (SO.getValue("custbody_bb1_sca_webstoreorder")) {

					var renderer = render.create();
					var xmlTemplateFile = file.load({
						id : "SuiteScripts/BB1/bb1_sca_advpdf_pn.txt"
					});
					var companyConfig = config.load({
						type : config.Type.COMPANY_INFORMATION
					});
					//Add company information to renderer
					renderer.addRecord({
						templateName : 'companyInformation',
						record : companyConfig
					});

					var custemail = SO.getValue("email");
                  	log.debug('custemail',custemail);
					//custemail = "gtruslove@bluebridgeone.com";
					//add record
					renderer.addRecord({
						templateName : 'record',
						record : IF
					});
					var settings = {}, pagelogo = companyConfig.getValue("pagelogo");
					if (pagelogo) {
						var logoFile = file.load({
							id : pagelogo
						});
						settings.logoUrl = xmlSafe(logoFile.url);
					}
					renderer.addCustomDataSource({
						format : render.DataSource.OBJECT,
						alias : "settings",
						data : settings
					});
					renderer.templateContent = xmlTemplateFile.getContents();
                  	log.debug('renderer.templateContent',renderer.templateContent);

					var htmlPdf = renderer.renderAsString();

					email.send({ // Send Notification
						author : 69397,
						recipients : custemail,
						subject : 'Stonetools Ltd - Order Shipped ' + tranid,
						body : htmlPdf,
						relatedRecords : {
							transactionId : ifid
						}
					});

					log.debug("Email sent", custemail);

				}
			} catch (err) {
				log.error("Order Shipped", "Error sending email for IF #" + ifid + " " + err);
			}
		}
	}

	function xmlSafe(value) {
		if (!value) {
			return value;
		}
		return value.split("&").join("&amp;");
	}

	return {
		afterSubmit : afterSubmit
	};

});
