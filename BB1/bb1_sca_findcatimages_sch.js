/**
 * Project: P100647
 *
 * Automatically find images for categories by looking for the first item in a category with an image.
 *
 * Date			SOW/Case #	Author			Purpose		
 * 01 Feb 2018	XXXXX		Gordon Truslove	Initial release
 *
 * Copyright (c) 2017 BlueBridge One Business Solutions, All Rights Reserved
 * support@bluebridgeone.com, +44 (0)1932 300007
 *
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define([ 'N/runtime', 'N/record', 'N/search' ],

function(runtime, record, search) {

	/**
	 * Definition of the Scheduled script trigger point.
	 *
	 * @param {Object} scriptContext
	 * @param {string} scriptContext.type - The context in which the script is executed. It is one of the values from the scriptContext.InvocationType enum.
	 * @Since 2015.2
	 */
	function execute(scriptContext) {

		var commercecategorySearchObj = search.create({
			type : "commercecategory",

			columns : [ "name", "itemid", "thumbnail" ]
		});
		var searchResultCount = commercecategorySearchObj.runPaged().count, thumb, name, lastname, itemid;
		for (k = 0; k < 10; k++) {
			var results = commercecategorySearchObj.runPaged({
				pageSize : 4000
			}).fetch({
				index : k
			}).data;
			log.debug("page=" + k);
			for (var i = 0; i < results.length; i++) {
				result = results[i];
				thumb = result.getValue("thumbnail");
				name = result.getValue("name");
				itemid = result.getValue("itemid");
				if (!thumb) {
					if (name != lastname) {
						log.debug("name=" + name + " itemid=" + itemid);
						if (itemid) {
							var objRecord = record.load({
								type : record.Type.INVENTORY_ITEM,
								id : itemid,
								isDynamic : true
							});

							var numLines = objRecord.getLineCount({
								sublistId : 'itemimages'
							});

							if (numLines > 0) {
								lastname = name;

								objRecord.selectLine({
									sublistId : 'itemimages',
									line : 0
								});
								var nkey = objRecord.getCurrentSublistValue({
									sublistId : 'itemimages',
									fieldId : 'nkey'
								});
								log.debug("nkey=" + nkey);

								record.submitFields({
									type : "commercecategory",
									id : result.id,
									values : {
										thumbnail : nkey
									},
									options : {
										enableSourcing : false,
										ignoreMandatoryFields : true
									}
								});

							}

						} else {
							var objRecord = record.load({
								type : "commercecategory",
								id : result.id,
								isDynamic : true
							});

							var numLines = objRecord.getLineCount({
								sublistId : 'subcategories'
							});
							if (numLines > 0) {
								log.debug("Maybe a cat");

								objRecord.selectLine({
									sublistId : 'subcategories',
									line : 0
								});
								var subcategory = objRecord.getCurrentSublistValue({
									sublistId : 'subcategories',
									fieldId : 'subcategory'
								});
								log.debug("subcategory=" + subcategory);

								lastname = name;

								var fieldLookUp = search.lookupFields({
									type : "commercecategory",
									id : subcategory,
									columns : [ 'thumbnail' ]
								});

								if (fieldLookUp && fieldLookUp.thumbnail) {

									log.debug("thumbnail=" + fieldLookUp.thumbnail);

									record.submitFields({
										type : "commercecategory",
										id : result.id,
										values : {
											thumbnail : fieldLookUp.thumbnail
										},
										options : {
											enableSourcing : false,
											ignoreMandatoryFields : true
										}
									});
								}

							}
						}

					}
				}
			}

		}

	}

	return {
		execute : execute
	};

});
