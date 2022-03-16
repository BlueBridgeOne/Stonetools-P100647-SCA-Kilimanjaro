/**
 * Project: P100647
 *
 * This workaround is used to give new customer sign ups on the website a password only for the contact and not for the whole customer.
 * An initial password is set on signup in SCA on a customer record. When it's set to something, access is given to the only contact.
 * After access is given the password is blanked.
 * 
 * Date			Author			Purpose		
 * 8 Aug 2018	Gordon Truslove	Initial release
 *
 * Copyright (c) 2017 BlueBridge One Business Solutions, All Rights Reserved
 * support@bluebridgeone.com, +44 (0)1932 300007
 *
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search'],

	function (record, search) {

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

			if (scriptContext.type == scriptContext.UserEventType.DELETE)
				return;

			log.debug("Give Customer Access", "Testing...." + scriptContext.type);

			var oldRecord = scriptContext.oldRecord;
			var currentRecord = scriptContext.newRecord;

			var pw = currentRecord.getValue({
				fieldId: 'custentity_bb1_sca_initialcustpassword'
			});


			//log.debug("Give Customer Access", "pw...."+pw);

			if (pw && pw.length > 0) { //Only if a password is set
				log.debug("Give Customer Access", "A new password has been set.");
				try {

					var custRecord = record.load({
						type: record.Type.LEAD,
						id: currentRecord.id,
						isDynamic: false
					});

					var numLines = custRecord.getLineCount({
						sublistId: 'contactroles'
					});

					if (numLines == 0) {
						return;
					}

					var contactemail = custRecord.getValue({
						fieldId: 'email'
					});

					// var leadcontact = custRecord.getValue({
					// 	fieldId: 'contact'
					// });

					
					var contact, email, found;
					for (var i = 0; i < numLines; i++) {

						contact = custRecord.getSublistValue({
							sublistId: 'contactroles',
							fieldId: 'contact',
							line: i
						});

						email = custRecord.getSublistValue({
							sublistId: 'contactroles',
							fieldId: 'email',
							line: i
						});
						// if(!leadcontact){
						// 	leadcontact=contact;
						// 	custRecord.setValue({
						// 		fieldId: 'contact',
						// 		value: contact,
						// 		ignoreFieldChange: true
						// 	});
						// }

						log.error("Contact", contact + " " + email);
						if (email == contactemail) {
							found = true;
							custRecord.setValue({
								fieldId: 'giveaccess',
								value: false,
								ignoreFieldChange: true
							});

							custRecord.setSublistValue({
								sublistId: 'contactroles',
								fieldId: 'giveaccess',
								value: true,
								ignoreFieldChange: true,
								line: i
							});
							custRecord.setSublistValue({
								sublistId: 'contactroles',
								fieldId: 'password',
								value: pw,
								ignoreFieldChange: true,
								line: i
							});
							custRecord.setSublistValue({
								sublistId: 'contactroles',
								fieldId: 'passwordconfirm',
								value: pw,
								ignoreFieldChange: true,
								line: i
							});
							custRecord.setSublistValue({
								sublistId: 'contactroles',
								fieldId: 'sendemail',
								value: false,
								ignoreFieldChange: true,
								line: i
							});

							break;
						}
					}

					if (found) {

						custRecord.setValue({
							fieldId: 'custentity_bb1_sca_initialcustpassword',
							value: "",
							ignoreFieldChange: true
						});

						custRecord.save({
							enableSourcing: true,
							ignoreMandatoryFields: true
						});
					}

				} catch (err) {
					log.error("Give Customer Access", err.toString());
				}

			}

		}

		return {
			afterSubmit: afterSubmit
		};

	});