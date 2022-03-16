/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 * 
 * BB1 G Truslove - feb 2017
 * G Truslove - Updated Jun 2018 to use files rather than records.
 * 
 * A new web order has been created, so set web order check box and send Adv PDF email.
 */
define(['N/record', 'N/runtime', 'N/render', 'N/email', 'N/file', 'N/config', 'N/search'],
	/**
	 * @param {record} record
	 */
	function (record, runtime, render, email, file, config, search) {

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

			if (scriptContext.type == "create") {
				try {
					scriptContext.newRecord.setValue({
						fieldId: 'custbody_bb1_released_to_ship',
						value: false,
						ignoreFieldChange: true
					});
				} catch (error1) {
					log.error("New Sales Order", "Unable to set shipping " + tranid + ". " + error1);
				}
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
			log.debug("Sales Order Before Saved", "Testing Before " + scriptContext.type + " " + scriptContext.newRecord.id + " " + JSON.stringify(runtime.executionContext) + " " + (runtime.executionContext == "USERINTERFACE"));
			if (scriptContext.type == "create" && runtime.executionContext == "WEBSTORE") {
				scriptContext.newRecord.setValue({
					fieldId: 'custbody_bb1_sca_webstoreorder',
					value: true,
					ignoreFieldChange: true
				});
			}
			//Fix an error that I can't figure out, terms keeps changing to blank client side and I don't know why
			if (scriptContext.type == "create") {
				try {
					var entity = scriptContext.newRecord.getValue({
						fieldId: 'entity'
					});
					var fieldLookUp;
					try {
						fieldLookUp = search.lookupFields({
							type: 'customer',
							id: entity,
							columns: ['terms']
						});
					} catch (err) {
						fieldLookUp = search.lookupFields({
							type: 'lead',
							id: entity,
							columns: ['terms']
						});
					}
					log.debug("fieldLookUp", "fieldLookUp=" + JSON.stringify(fieldLookUp));
					if (fieldLookUp && fieldLookUp.terms.length > 0) {
						if (fieldLookUp.terms[0].value != 4 || runtime.executionContext != "WEBSTORE") {
							scriptContext.newRecord.setValue({
								fieldId: 'terms',
								value: fieldLookUp.terms[0].value,
								ignoreFieldChange: true
							});
							
						}
						if(runtime.executionContext != "WEBSTORE"){
							scriptContext.newRecord.setValue({
								fieldId: 'paymentmethod',
								value: "",
								ignoreFieldChange: true
							});
						}
					}

				} catch (err) {
					log.debug("Terms!", err);
				}
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
		function afterSubmit(scriptContext) {

			var tranid = "#SO " + scriptContext.newRecord.id;
			var salesorderid = scriptContext.newRecord.id;
			try {
				log.debug("Sales Order Saved", "Testing After " + scriptContext.type + " " + scriptContext.newRecord.id + " " + JSON.stringify(runtime.executionContext) + " " + (runtime.executionContext == "USERINTERFACE"));

				if (scriptContext.type == "create" && runtime.executionContext == "WEBSTORE") {
					log.debug("Sales Order Saved", "Testing " + scriptContext.type + " " + scriptContext.newRecord.id + " " + JSON.stringify(runtime.executionContext) + " " + (runtime.executionContext == "USERINTERFACE"));

					var renderer = render.create();
					var xmlTemplateFile = file.load({
						id: "SuiteScripts/BB1/bb1_sca_advpdf_so.txt"
					});
					var companyConfig = config.load({
						type: config.Type.COMPANY_INFORMATION
					});
					//Add company information to renderer
					renderer.addRecord({
						templateName: 'companyInformation',
						record: companyConfig
					});
					var SO = scriptContext.newRecord || scriptContext.oldRecord;
					var tranid = SO.getValue("tranid");
					var custemail = SO.getValue("email");
					var createdfrom = salesorderid;
					//add record
					renderer.addRecord({
						templateName: 'record',
						record: SO
					});
					var settings = {},
						pagelogo = companyConfig.getValue("pagelogo");
					if (pagelogo) {
						var logoFile = file.load({
							id: pagelogo
						});
						settings.logoUrl = xmlSafe(logoFile.url);
					}
					renderer.addCustomDataSource({
						format: render.DataSource.OBJECT,
						alias: "settings",
						data: settings
					});
					renderer.templateContent = xmlTemplateFile.getContents();

					var htmlPdf = renderer.renderAsString();

					//log.debug("Result", htmlPdf);

					email.send({ // Send Notification
						author: 69397,
						recipients: custemail,
						subject: 'Stonetools Ltd - Order Notification ' + tranid,
						body: htmlPdf,
						relatedRecords: {
							transactionId: createdfrom
						}
					});

					log.debug("Email sent", custemail);
				}
			} catch (error1) {
				log.error("New Sales Order", "Unable to send out email to " + tranid + ". " + error1);
			}


		}

		function xmlSafe(value) {
			if (!value) {
				return value;
			}
			return value.split("&").join("&amp;");
		}

		return {
			beforeLoad: beforeLoad,
			beforeSubmit: beforeSubmit,
			afterSubmit: afterSubmit
		};

	});