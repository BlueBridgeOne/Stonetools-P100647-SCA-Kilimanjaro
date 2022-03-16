/**
 * Project: P100647
 *
 * Add an approval button to an article. Only for certain roles and when the record is not approved.
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
define([ 'N/ui/serverWidget' ],

function(serverWidget) {

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

		if (scriptContext.type == scriptContext.UserEventType.DELETE)
			return;

		var currentRecord = scriptContext.newRecord;
		var duedate = currentRecord.getValue({
			fieldId : 'duedate'
		});

		scriptContext.form.addButton({
			id : 'custpage_approvebutton',
			label : 'Approve',
			functionName : 'bb1_approve_article'
		});
	}

	return {
		beforeLoad : beforeLoad
	};

});
