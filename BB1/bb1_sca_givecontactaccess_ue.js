/**
 * Project: P100647
 *
 * This allows an initial password to be set on a contact record. When it's set to something, access is given on the parent customer.
 * A mail merge can then be carried out using the initial password field.
 * After the mail merge the initial password field should be blanked.
 *
 * Date			Author			Purpose		
 * 25 Jul 2018	Gordon Truslove	Initial release
 *
 * Copyright (c) 2017 BlueBridge One Business Solutions, All Rights Reserved
 * support@bluebridgeone.com, +44 (0)1932 300007
 *
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define([ 'N/record', 'N/search','N/runtime' ],

function(record, search,runtime) {
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

		var oldRecord = scriptContext.oldRecord;
		var currentRecord = scriptContext.newRecord;
		var pw = currentRecord.getValue({
			fieldId : 'custentity_bb1_sca_initialpassword'
		});
	
		var oldpw = "";
		if (oldRecord) {
			oldpw = oldRecord.getValue({
				fieldId : 'custentity_bb1_sca_initialpassword'
			});
		}

		// var lastname = currentRecord.getValue({
		// 	fieldId : 'lastname'
		// });
		
		// var entityid = currentRecord.getValue({
		// 	fieldId : 'entityid'
		// });
		// var B=lastname.indexOf("|");
		// if(B>-1){
		// 	pw=lastname.substring(B+1);
		// 	oldpw="";
		// 	//log.error("PW",PW);
			
		// 	lastname=lastname.substring(0,B);
		// 	//log.error("lastname",lastname);

		// 	var C=entityid.indexOf("|");
		// 	entityid=entityid.substring(0,C);
		// 	record.submitFields({
		// 		type : record.Type.CONTACT,
		// 		id : currentRecord.id,
		// 		values : {
		// 			lastname : lastname,
		// 			entityid:entityid
		// 		},
		// 		options : {
		// 			enableSourcing : false,
		// 			ignoreMandatoryFields : true
		// 		}
		// 	});

		// }


		if (pw && pw.length > 0) { //Only if a password is set
			if (pw != oldpw) {//Password changed
				log.error("Give Contact Access", "A new password has been set.");
				try {
					var company = currentRecord.getValue({
						fieldId : 'company'
					});

					if (company) {
						log.error("Give Contact Access", "Give access to contact at company " + company + ".");
						var contactemail = currentRecord.getValue({
							fieldId : 'email'
						});

						var custRecord
						try {
							custRecord = record.load({
								type : record.Type.CUSTOMER,
								id : company,
								isDynamic : false
							});
						} catch (err2) { //No idea how to find a entity/lead/customer, so cheaty hack with a try catch.
							try {
								custRecord = record.load({
									type : record.Type.LEAD,
									id : company,
									isDynamic : false
								});
							} catch (err3) {
								log.error("Give Contact Access", "Unable to guess type of company " + company);
								return;
							}
						}

						var numLines = custRecord.getLineCount({
							sublistId : 'contactroles'
						});

						//Calculate tax table, breakdown of different totals per percentage.
						var contact, email;
						for (var i = 0; i < numLines; i++) {

							contact = custRecord.getSublistValue({
								sublistId : 'contactroles',
								fieldId : 'contact',
								line : i
							});

							email = custRecord.getSublistValue({
								sublistId : 'contactroles',
								fieldId : 'email',
								line : i
							});

							log.error("Contact", contact + " " + email);
							if (email == contactemail) {

								custRecord.setValue({
									fieldId : 'giveaccess',
									value : false,
									ignoreFieldChange : true
								});

								custRecord.setSublistValue({
									sublistId : 'contactroles',
									fieldId : 'giveaccess',
									value : true,
									ignoreFieldChange : true,
									line : i
								});
								custRecord.setSublistValue({
									sublistId : 'contactroles',
									fieldId : 'password',
									value : pw,
									ignoreFieldChange : true,
									line : i
								});
								custRecord.setSublistValue({
									sublistId : 'contactroles',
									fieldId : 'passwordconfirm',
									value : pw,
									ignoreFieldChange : true,
									line : i
								});
								custRecord.setSublistValue({
									sublistId : 'contactroles',
									fieldId : 'sendemail',
									value : false,
									ignoreFieldChange : true,
									line : i
								});
								// if(B==-1){
								custRecord.setSublistValue({
									sublistId : 'contactroles',
									fieldId : 'role',
									value : 1029,
									ignoreFieldChange : true,
									line : i
								});
							// }
								custRecord.save({
									enableSourcing : true,
									ignoreMandatoryFields : true
								});

								break;
							}
						}
					}

				} catch (err) {
					log.error("Give Contact Access", err.toString());
				}
			}
		}

	}

	return {
		afterSubmit : afterSubmit
	};

});
