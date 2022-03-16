/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 * 
 * BB1 G Truslove - May 2017
 * Invoices and Credit Notes are bundled into batches. An email is then sent to the bank with details and a spreadsheet.
 * This runs daily.
 */
define([ 'N/email', 'N/record', 'N/search', 'N/render', 'N/runtime', 'N/file' ],
/**
 * @param {email} email
 * @param {record} record
 * @param {search} search
 */
function(email, record, search, render, runtime, file) {

	/**
	 * Definition of the Scheduled script trigger point.
	 *
	 * @param {Object} scriptContext
	 * @param {string} scriptContext.type - The context in which the script is executed. It is one of the values from the scriptContext.InvocationType enum.
	 * @Since 2015.2
	 */
	function execute(scriptContext) {
		//Email To Param
		var scriptObj = runtime.getCurrentScript();
		var emailTo = scriptObj.getParameter({
			name : 'custscript_bb1_email'
		});
		var emailFrom = scriptObj.getParameter({
			name : 'custscript_bb1_from'
		});
		var emailCC = scriptObj.getParameter({
			name : 'custscript_bb1_cc'
		});
		var now = new Date();

		//Search for Invoices/ Credit that are not batched.

		var types = [ search.Type.INVOICE, search.Type.CREDIT_MEMO ], recordName, csvName;
		for (var i = 0; i < types.length; i++) {
			recordName = i == 0 ? "Invoice" : "Credit Note";
			csvName = i == 0 ? "Invoice" : "Credit";
			log.debug("Start Report", "Search for type: " + recordName);
			var filters = [];
			var columns = [];

			//filters.push([ 'isinactive', 'is', 'F' ]);
			//			filters.push('AND');
			filters.push(search.createFilter({
				name : 'custbody_bb1_ir_batch',
				operator : search.Operator.IS,
				values : [ '@NONE@' ]
			}));
			filters.push(search.createFilter({
				name : 'custbody_bb1_ir_exclude',
				operator : search.Operator.IS,
				values : [ 'F' ]
			}));
			filters.push(search.createFilter({
				name : 'mainline',
				operator : search.Operator.IS,
				values : [ 'T' ]
			}));

			if (i == 0) {
				filters.push(search.createFilter({
					name : 'terms',
					operator : search.Operator.NONEOF,
					values : [ 4 ]
				}));
			} else {
				filters.push(search.createFilter({
					name : 'terms',
					join : 'customer',
					operator : search.Operator.NONEOF,
					values : [ 4 ]
				}));
			}

			columns.push(search.createColumn({
				name : 'total'
			}), search.createColumn({
				name : 'trandate'
			}), search.createColumn({
				name : 'taxtotal'
			}), search.createColumn({
				name : 'custcol_2663_companyname'
			}), search.createColumn({
				name : 'currency'
			}), search.createColumn({
				name : 'exchangerate'
			}), search.createColumn({
				name : 'tranid'
			}), search.createColumn({
				name : 'tranid',
				join : 'createdfrom'
			}), search.createColumn({
				name : 'custbody_bb1_ir_exclude'
			}), search.createColumn({
				name : 'custbody_bb1_ir_batch'
			}));

			var searchResults = search.create({
				type : types[i],
				columns : columns,
				filters : filters
			});
			var newTran, exchangerate, hcheck = {}, list = [], firstId, lastId, firstDate, lastDate, currency, hcurrency = {}, currencylist = [];
			searchResults.run().each(function(result) { //get all invoices/credit
				//for some reason pulls back duplicates, so best do a check.
				if (!hcheck[result.id]) {
					//log.debug("custbody_bb1_ir_batch", result.getValue("custbody_bb1_ir_batch"));
					if (result.getValue("custbody_bb1_ir_batch") < 1) {
						hcheck[result.id] = true;
						newTran = {
							id : result.id,
							tranid : result.getValue("tranid"),
							total : result.getValue("total"),
							trandate : result.getValue("trandate"),
							taxtotal : result.getValue("taxtotal"),
							subtotal : (result.getValue("total") - result.getValue("taxtotal")),
							entity : result.getValue('custcol_2663_companyname'),
							currency : result.getText("currency"),
							salesorder : result.getValue({
								name : 'tranid',
								join : 'createdfrom'
							})
						};
						exchangerate = result.getValue("exchangerate");
						newTran.total /= exchangerate;
						newTran.taxtotal /= exchangerate;
						newTran.subtotal /= exchangerate;
						list.push(newTran);

						currency = result.getText("currency");
						if (!hcurrency.hasOwnProperty(currency)) {
							hcurrency[currency] = {
								total : 0,
								firstId : result.getValue("tranid"),
								firstDate : result.getValue("trandate")
							};
							currencylist.push(currency);
						}
						//log.debug("Search", "Result: " + result.id);
						log.debug("search", "Found #" + result.id + " total=" + (result.getValue("total") / exchangerate) + " currency=" + currency);
						hcurrency[currency].total += (parseFloat(result.getValue("total")) / exchangerate);
						hcurrency[currency].lastId = result.getValue("tranid");
						hcurrency[currency].lastDate = result.getValue("trandate");
					}
				}
				return true;
			});
			var count = 0;
			if (list.length > 0) {
				//Create new batch record and then set on invoices or credit notes.

				var recordId = 201, recordDate = new Date();

				for (var k = 0; k < currencylist.length; k++) {
					currency = currencylist[k];
					if (currency == "GBP" || currency == "EUR") {
						//if (false) { //TEMP testing
						var objRecord = record.create({
							type : 'customrecord_bb1_ir_batch',
						});

						objRecord.setValue("custrecord_bb1_ir_type", i + 1);
						objRecord.setValue("custrecord_bb1_ir_total", hcurrency[currency].total);
						objRecord.setText("custrecord_bb1_ir_currency", currency);

						var recordId = objRecord.save({
							enableSourcing : true,
							ignoreMandatoryFields : true
						});
						count = 0;
						for (var j = 0; j < list.length; j++) {
							if (list[j].currency == currency) {
								count++;
								record.submitFields({
									type : types[i],
									id : list[j].id,
									values : {
										custbody_bb1_ir_batch : recordId
									},
									options : {
										enableSourcing : false,
										ignoreMandatoryFields : true
									}
								});
							}
						}
						//} //Edd of testing
						log.debug("Batch Report", "Created " + currency + " batch #" + recordId + " with " + count + " " + recordName + "'s added.");

						//Send Email
						if (emailTo && emailFrom && count > 0) {

							var body = "<html><head><title>" + currency + " Batch " + recordName + " Report #" + recordId + "</title></head><body style=\"font-family:arial,sans-serif;\">";

							body += "<h3>Stonetools Limited</h3>";
							body += "<p>" + currency + " Batch " + recordName + " Report #" + recordId + "</p>";

							//Email Properties
							var tstyle = " style=\"border-top:1px solid #DDD;border-left:1px solid #DDD;\"";
							var thstyle = " style=\"border-right:1px solid #DDD;border-bottom:1px solid #DDD;padding:2px 4px;background-color:#EEE;\"";
							var tdstyle = " style=\"border-right:1px solid #DDD;border-bottom:1px solid #DDD;padding:2px 4px;text-align:center;\"";
							body += "<table cellspacing=\"0\">";
							body += "<tr><td><b>Customer</b></td><td>#15703</td></tr>";
							body += "<tr><td><b>Batch</b></td><td>#" + recordId + "</td></tr>";
							body += "<tr><td><b>Type</b></td><td>" + recordName + "</td></tr>";
							body += "<tr><td><b>Currency</b></td><td>" + currency + "</td></tr>";

							body += "<tr><td><b>Date</b></td><td>" + recordDate.getDate() + "/" + (recordDate.getMonth() + 1) + "/" + recordDate.getFullYear() + "</td></tr>";
							var totalstr = hcurrency[currency].total.toFixed(2).replace(/./g, function(c, i, a) {
								return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
							});
							body += "<tr><td><b>Total</b></td><td>" + totalstr + " " + currency + "</td></tr>";
							body += "<tr><td style=\"padding-right:10px;\"><b>" + recordName + " Range</b></td><td>" + hcurrency[currency].firstId + " to " + hcurrency[currency].lastId + "</td></tr>";
							body += "<tr><td><b>Date Range</b></td><td>" + hcurrency[currency].firstDate + " to " + hcurrency[currency].lastDate + "</td></tr>";

							body += "</table>";
							//Email Table

							body += "<br /><table cellspacing=\"0\"" + tstyle + ">";
							body += "<tr><th" + thstyle + ">" + csvName + "</th><th" + thstyle + ">" + csvName + " Date</th><th" + thstyle + ">Customer Name</th><th" + thstyle + ">Currency</th><th" + thstyle + ">Sales Order</th><th" + thstyle + ">" + csvName + " Net Total</th><th" + thstyle + ">Vat Amount</th><th" + thstyle + ">" + csvName + " Gross Total</th><th" + thstyle + ">Schedule</th><th" + thstyle + ">Schedule Date</th></tr>";
							for (var j = 0; j < list.length; j++) {
								if (list[j].currency == currency) {
									body += "<tr><td" + tdstyle + ">" + list[j].tranid + "</td><td" + tdstyle + ">" + list[j].trandate + "</td><td" + tdstyle + ">" + list[j].entity + "</td><td" + tdstyle + ">" + currency + "</td><td" + tdstyle + ">" + list[j].salesorder + "</td><td" + tdstyle + ">" + list[j].subtotal.toFixed(2) + "</td><td" + tdstyle + ">" + list[j].taxtotal + "</td><td" + tdstyle + ">" + list[j].total.toFixed(2) + "</td><td" + tdstyle + ">#" + recordId + "</td><td" + tdstyle + ">" + recordDate.getDate() + "/" + (recordDate.getMonth() + 1) + "/" + recordDate.getFullYear() + "</td></tr>";
								}
							}
							body += "</table>";

							body += "</body></html>";

							//CSV File
							var csv = "", eol = "\r\n";

							csv += csvName + "_Id," + csvName + "_Date,Customer_Name,Currency,Sales_Order,Invoice_Net_Total,Vat_Amount,Invoice_Gross_Total,Schedule_Id,Schedule Date" + eol;
							for (var j = 0; j < list.length; j++) {
								if (list[j].currency == currency) {
									csv += list[j].tranid + "," + list[j].trandate + "," + CSVEncode(list[j].entity) + "," + currency + "," + list[j].salesorder + "," + list[j].subtotal.toFixed(2) + "," + list[j].taxtotal + "," + list[j].total.toFixed(2) + "," + recordId + "," + recordDate.getDate() + "/" + (recordDate.getMonth() + 1) + "/" + recordDate.getFullYear() + eol;
								}
							}

							var fileObj = file.create({
								name : "Stonetools Limited " + currency + " Batch " + recordName + " Report #" + recordId + ".csv",
								fileType : file.Type.PLAINTEXT,
								contents : csv,
								encoding : file.Encoding.UTF8
							});

							//Send email
							var cc;
							if (emailCC && emailCC.length > 0) {
								cc = [ emailCC ];
							}
							email.send({ // Send Email
								author : emailFrom,
								recipients : emailTo,
								cc : cc,
								subject : "Stonetools Limited " + currency + " Batch " + recordName + " Report #" + recordId,
								body : body,
								attachments : [ fileObj ]
							});
						}
					}
				}
			} else {
				log.debug("Batch Report", "No " + recordName + "'s found.");

			}
		}
	}

	function CSVEncode(value) {
		if (!value) {
			return value;
		}
		var csv = "\"";
		for (var i = 0; i < value.length; i++) {
			if (value.charAt(i) == "\"") {
				csv += "\\\"";
			} else {
				csv += value.charAt(i);
			}
		}
		csv += "\"";
		return csv;
	}

	return {
		execute : execute
	};

});
