/**
 * Project: P100647
 * 
 * When a PO is saved, update each item with the nearest delivery date.
 *
 * Date			Author			Purpose		
 * 14 May 2018	Gordon Truslove	Initial release
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

			var currentRecord = scriptContext.newRecord;

			var numLines = currentRecord.getLineCount({
				sublistId: 'item'
			});
			var item, expectedreceiptdate, itemtype, fieldLookUp, today = new Date(),
				nextdelivery, quantityreceived, quantity;
			for (var i = 0; i < numLines; i++) {

				item = currentRecord.getSublistValue({
					sublistId: 'item',
					fieldId: 'item',
					line: i
				});
				itemtype = currentRecord.getSublistValue({
					sublistId: 'item',
					fieldId: 'itemtype',
					line: i
				});
				//log.debug("ITEM","item="+item+" "+itemtype);
				expectedreceiptdate = new Date(currentRecord.getSublistValue({
					sublistId: 'item',
					fieldId: 'expectedreceiptdate',
					line: i
				}));
				quantityreceived = currentRecord.getSublistValue({
					sublistId: 'item',
					fieldId: 'quantityreceived',
					line: i
				});
				quantity = currentRecord.getSublistValue({
					sublistId: 'item',
					fieldId: 'quantity',
					line: i
				});

				if (quantityreceived >= quantity) {
					try {

						//log.debug("quantity", quantity+">"+quantityreceived);
						fieldLookUp = lookupFields({
							type:itemtype,
							id: item,
							columns: ['parent']
						});


						if (parent && parent.length > 0) {
							parent = parent[0].value;

							// submitFields({
							// 	type:itemtype,
							// 	id: parent,
							// 	values: {
							// 		custitem_bb1_sca_nextdelivery: "@NONE@"
							// 	},
							// 	options: {
							// 		enableSourcing: false,
							// 		ignoreMandatoryFields: true
							// 	}
							// });


							var pFieldLookUp = lookupFields({
								type:itemtype,
								id: parent,
								columns: ['custitem_bb1_sca_childrennextdelivery']
							});
							var custitem_bb1_sca_childrennextdelivery = pFieldLookUp.custitem_bb1_sca_childrennextdelivery || "{}";

							//log.debug("custitem_bb1_sca_childrennextdelivery", custitem_bb1_sca_childrennextdelivery);
							var datelist = JSON.parse(custitem_bb1_sca_childrennextdelivery);
							//log.debug("datelist before", JSON.stringify(datelist));
							var changeddates = false;
							if (datelist[item] && datelist[item].onorder) {
								datelist[item].onorder = undefined;
								changeddates = true;
							}
							//log.debug("changeddates", changeddates);
							if (changeddates) {
								log.debug("children next delivery", datelist);
								submitFields({
									type:itemtype,
									id: parent,
									values: {
										custitem_bb1_sca_childrennextdelivery: JSON.stringify(datelist)
									},
									options: {
										enableSourcing: false,
										ignoreMandatoryFields: true
									}
								});
							}
						}

					} catch (err) {
						log.debug("Unable to update item lead", err);
					}
				} else if (expectedreceiptdate >= today) {
					try {

						fieldLookUp = lookupFields({
							type:itemtype,
							id: item,
							columns: ['custitem_bb1_sca_nextdelivery', 'parent']
						});


						if (fieldLookUp.custitem_bb1_sca_nextdelivery) {
							nextdelivery = new Date(fieldLookUp.custitem_bb1_sca_nextdelivery);
						} else {
							nextdelivery = new Date(today.getFullYear() + 1000, 1, 1);
						}

						if (nextdelivery <= today || expectedreceiptdate <= nextdelivery) { //TEMP, only needs to be less than

							

							log.debug("Delivery date", "Found new delivery date for item " + item + " " + expectedreceiptdate);
							var parent = fieldLookUp.parent;
							if (parent && parent.length > 0) {
								parent = parent[0].value;

								submitFields({
								type:itemtype,
								id: parent,
								values: {
									custitem_bb1_sca_nextdelivery: expectedreceiptdate.getDate() + "/" + (expectedreceiptdate.getMonth() + 1) + "/" + expectedreceiptdate.getFullYear()
								},
								options: {
									enableSourcing: false,
									ignoreMandatoryFields: true
								}
							});
							//Store list of dates in parent for use in the web store.

								//log.debug("parent", JSON.stringify(fieldLookUp.parent));
								var pFieldLookUp = lookupFields({
									type:itemtype,
									id: parent,
									columns: ['custitem_bb1_sca_childrennextdelivery']
								});
								var custitem_bb1_sca_childrennextdelivery = pFieldLookUp.custitem_bb1_sca_childrennextdelivery || "{}";
								//log.debug("custitem_bb1_sca_childrennextdelivery", custitem_bb1_sca_childrennextdelivery);
								var datelist = JSON.parse(custitem_bb1_sca_childrennextdelivery);
								if (datelist[item]) {
									datelist[item].onorder = expectedreceiptdate;
								} else {
									datelist[item] = {
										onorder: expectedreceiptdate
									};
								}

								submitFields({
									type:itemtype,
									id: parent,
									values: {
										custitem_bb1_sca_childrennextdelivery: JSON.stringify(datelist)
									},
									options: {
										enableSourcing: false,
										ignoreMandatoryFields: true
									}
								});
							}
						}
					} catch (err) {
						log.debug("Unable to update item delivery", err);
					}
				}

			}

		}
//Frustrating NS API, have to guess the record type.
		function lookupFields(options) {
			var types = ["InvtPart",search.Type.INVENTORY_ITEM, search.Type.LOT_NUMBERED_INVENTORY_ITEM];
				for (var i = 0; i < types.length; i++) {
					try {
						options.type = types[i];
						return search.lookupFields(options);
					} catch (err) {
					}
				}
				log.debug("Lookup","Lookup Failed "+JSON.stringify(options));
		}

		function submitFields(options) {
			var types = ["InvtPart",options.itemtype,search.Type.INVENTORY_ITEM, search.Type.LOT_NUMBERED_INVENTORY_ITEM];
				for (var i = 0; i < types.length; i++) {
					try {
						options.type = types[i];
						return record.submitFields(options);
					} catch (err) {
						//log.debug("submit err",err);
					}
				}
				log.debug("Submit","Submit Failed "+JSON.stringify(options));
		}

		return {
			afterSubmit: afterSubmit
		};

	});