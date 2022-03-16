/**
 * Project: P100647
 *
 * If a customer has terms then don't allow a default credit card.
 *
 * Date			Author			Purpose		
 * 2 Nov 2018	Gordon Truslove	Initial release
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

		function beforeSubmit(scriptContext) {

			if (scriptContext.type == scriptContext.UserEventType.DELETE)
				return;

				var currentRecord = scriptContext.newRecord;
			var terms = currentRecord.getValue({
				fieldId: 'terms'
			});
			if(terms&&terms>0){
				log.debug("Remove Default CC", "Terms...." + terms);

				var numLines = currentRecord.getLineCount({
					sublistId : 'creditcards'
				});
				//Calculate tax table, breakdown of different totals per percentage.
				var Default;
				for (var i = 0; i < numLines; i++) {
	
					Default = currentRecord.getSublistValue({
						sublistId : 'creditcards',
						fieldId : 'ccdefault',
						line : i
					});
					if(Default){
						log.debug("Remove Default CC", "Default...." + Default);
						currentRecord.setSublistValue({
							sublistId: 'creditcards',
							fieldId: 'ccdefault',
							value: false,
							ignoreFieldChange: true,
							line : i
						});
					}
	}

	
			}
		}

		
		return {
			beforeSubmit:beforeSubmit
		};

	});