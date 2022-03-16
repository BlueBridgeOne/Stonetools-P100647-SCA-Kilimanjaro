/**
 * case: SC34204
 * 
 * Stop web store proforma invoice from getting added to the BSF Batch Reports (by default). 
 *
 * Date			Author			Purpose		
 * 18 Jul 2018	Gordon Truslove	Initial release
 *
 * Copyright (c) 2017 BlueBridge One Business Solutions, All Rights Reserved
 * support@bluebridgeone.com, +44 (0)1932 300007
 *
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define([ 'N/record', 'N/search' ],

function(record, search) {

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

		if (scriptContext.type == "create") {

			var currentRecord = scriptContext.newRecord;
			var terms = currentRecord.getText({
				fieldId : 'terms'
			});
			if (!terms || terms == "" || terms == "proforma" || terms == "Proforma") {
				scriptContext.newRecord.setValue({
					fieldId : 'custbody_bb1_ir_exclude',
					value : true,
					ignoreFieldChange : true
				});
			}

		}

	}

	return {
		beforeSubmit : beforeSubmit
	};

});
