/**
 * Project: P100647
 *
 * This script sends out product lists by email to all customers who have asked for them on the web site.
 * 
 * The send details are stored in the description of the product lists. There are two variables e.g. send:weekly and lastsend:2018-01-01
 *
 * Date			Author			Purpose		
 * 28 Mar 2018	Gordon Truslove	Initial release
 *
 * Copyright (c) 2017 BlueBridge One Business Solutions, All Rights Reserved
 * support@bluebridgeone.com, +44 (0)1932 300007
 *
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define([ 'N/record', 'N/search', 'N/runtime', 'N/http' ],

function(record, search, runtime, http) {

	/**
	 * Marks the beginning of the Map/Reduce process and generates input data.
	 *
	 * @typedef {Object} ObjectRef
	 * @property {number} id - Internal ID of the record instance
	 * @property {string} type - Record type id
	 *
	 * @return {Array|Object|Search|RecordRef} inputSummary
	 * @since 2015.1
	 */
	function getInputData() {
		//customrecord_ns_pl_productlist
		//custrecord_ns_pl_pl_description
		//custrecord_ns_pl_pl_owner

		log.debug("Input Data", "Get all product lists.");
		var newSearch = search.create({
			type : "customrecord_ns_pl_productlist",
			filters : [],
			columns : [ "custrecord_ns_pl_pl_description", "custrecord_ns_pl_pl_owner", "custrecord_ns_pl_pl_owner.email" ],
			title : 'All customrecord_ns_pl_productlist Search'
		});
		//, 'AND', [ 'isonline', search.Operator.IS, "T" ]

		return newSearch;
	}

	/**
	 * Executes when the map entry point is triggered and applies to each key/value pair.
	 *
	 * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
	 * @since 2015.1
	 */
	function map(context) {
		if (!abort()) {
			var searchResult = JSON.parse(context.value);
			var description = searchResult.values.custrecord_ns_pl_pl_description;

			if (description && description.length > 0 && description.indexOf("send") > -1) {
				log.debug("Map", searchResult.id + " " + description);
				var email = searchResult.values["email.custrecord_ns_pl_pl_owner"];
				var values = description.split(',');
				var send = "never";
				var lastsend = "2001-01-01", foundlast = false;

				for (var i = 0; i < values.length; i++) {
					var parts = values[i].split(':');
					if (parts.length > 1) {
						if (parts[0] == "send") {
							send = parts[1];
						} else if (parts[0] == "lastsend") {
							lastsend = parts[1];
							foundlast = true;
						}
					}
				}
				//log.debug("Map", "split " + searchResult.id + " " + send + " " + lastsend);
				if (send != "never" && email && email.length > 0) {
					var lastsenddate = new Date(lastsend + "T01:00:00.000Z");
					var newdate = new Date(lastsend + "T01:00:00.000Z");
					//log.debug("Map", searchResult.id + " " + send + " " + lastsend + " " + lastsenddate.toDateString());
					switch (send) {
					case "week":
						newdate.setDate(newdate.getDate() + 7);
						break;
					case "2weeks":
						newdate.setDate(newdate.getDate() + 14);
						break;
					case "month":
						newdate.setMonth(newdate.getMonth() + 1);
						break;
					case "2months":
						newdate.setMonth(newdate.getMonth() + 2);
						break;
					case "3months":
						newdate.setMonth(newdate.getMonth() + 3);
						break;
					case "6months":
						newdate.setMonth(newdate.getMonth() + 6);
						break;
					default:
						newdate.setFullYear(newdate.getFullYear() + 1);
						break;
					}
					if (new Date() >= newdate) {
						log.debug("Map", "SEND! " + searchResult.id + " " + send + " next " + newdate.toDateString() + "<" + (new Date()));
						var url = "http://stonetools.co.uk/store/services/ToolLists.Service.ss";
						//
						//
						var response = http.get({
							url : url + "?system=T&send=" + send + "&task=email-csv&email=" + encodeURIComponent(email) + "&productListId=" + searchResult.id
						});

						var date = new Date().toISOString();
						var T = date.indexOf("T");
						if (T > -1) {
							date = date.substring(0, T);
						}

						if (foundlast) {
							''
							for (var i = 0; i < values.length; i++) {
								var parts = values[i].split(':');
								if (parts.length > 1 && parts[0] == "lastsend") {
									values[i] = "lastsend:" + date;
								}
							}
						} else {
							values.push("lastsend:" + date);
						}
						var newdesc = values.join(',');

						var id = record.submitFields({
							type : "customrecord_ns_pl_productlist",
							id : searchResult.id,
							values : {
								custrecord_ns_pl_pl_description : newdesc
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

	/**
	 * Executes when the summarize entry point is triggered and applies to the result set.
	 *
	 * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
	 * @since 2015.1
	 */
	function summarize(summary) {
		var seconds = summary.seconds;
		var usage = summary.usage;
		var yields = summary.yields;

		log.debug("Map/Reduce", "Complete seconds=" + seconds + " usage=" + usage + " yields=" + yields);
	}
	var isAbort = false;
	function abort() { //Abort the script if this parameter is checked.
		if (isAbort) {
			return isAbort;
		}
		var abort = runtime.getCurrentScript().getParameter({
			name : 'custscript_bb1_abort_emailprod'
		});
		var newAbort = (abort == "T" || abort == true);
		if (!isAbort && newAbort) {
			log.error("Map/Reduce", "**** ABORT!! - Note: Script will continue, but map/reduce will be skipped. ****");
			isAbort = newAbort;
		}
		return newAbort;
	}

	return {
		getInputData : getInputData,
		map : map,
		summarize : summarize
	};

});
