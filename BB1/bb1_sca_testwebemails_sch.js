/**
 * Project: 
 *
 * Teamwork Task: 
 * 
 * replacewithoverview
 *
 * Date			SOW/Case #	Author			Purpose		
 * 15 Jun 2018	XXXXX		Gordon Truslove	Initial release
 *
 * Copyright (c) 2017 BlueBridge One Business Solutions, All Rights Reserved
 * support@bluebridgeone.com, +44 (0)1932 300007
 *
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define([ 'N/runtime', 'N/config', 'N/record', 'N/render', 'N/file', 'N/email' ],

function(runtime, config, record, render, file, email) {

	/**
	 * Definition of the Scheduled script trigger point.
	 *
	 * @param {Object} scriptContext
	 * @param {string} scriptContext.type - The context in which the script is executed. It is one of the values from the scriptContext.InvocationType enum.
	 * @Since 2015.2
	 */
	function execute(scriptContext) {
		var salesorderid = 326840;
		var ifid = 326899;

		try {

			var IF = record.load({
				type : record.Type.ITEM_FULFILLMENT,
				id : ifid,
				isDynamic : false
			});
			var tranid = IF.getValue("tranid");

			salesorderid = IF.getValue("createdfrom");
			var createdfrom = salesorderid;

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
				custemail = "gtruslove@bluebridgeone.com";

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

				var htmlPdf = renderer.renderAsString();

				//log.debug("Result", htmlPdf);

				email.send({ // Send Notification
					author : 69397,
					recipients : custemail,
					subject : 'Stonetools Ltd - Order Shipped ' + tranid,
					body : htmlPdf,
					relatedRecords : {
						transactionId : createdfrom
					}
				});
			}
		} catch (err) {
			log.err("Error sending email for IF #" + ifid);
		}

		return;

		try {

			var renderer = render.create();
			var xmlTemplateFile = file.load({
				id : "SuiteScripts/BB1/bb1_sca_advpdf_so.txt"
			});
			var companyConfig = config.load({
				type : config.Type.COMPANY_INFORMATION
			});
			//Add company information to renderer
			renderer.addRecord({
				templateName : 'companyInformation',
				record : companyConfig
			});
			var SO = record.load({
				type : record.Type.SALES_ORDER,
				id : salesorderid,
				isDynamic : false
			});
			var tranid = SO.getValue("tranid");
			var custemail = SO.getValue("email");
			var createdfrom = salesorderid;
			//add record
			renderer.addRecord({
				templateName : 'record',
				record : SO
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

			var htmlPdf = renderer.renderAsString();

			//log.debug("Result", htmlPdf);

			email.send({ // Send Notification
				author : 69397,
				recipients : custemail,
				subject : 'Stonetools Ltd - Order Notification ' + tranid,
				body : htmlPdf,
				relatedRecords : {
					transactionId : createdfrom
				}
			});
		} catch (err) {
			log.err("Error sending email for SO #" + salesorderid);
		}
	}

	function xmlSafe(value) {
		if (!value) {
			return value;
		}
		return value.split("&").join("&amp;");
	}

	return {
		execute : execute
	};

});
