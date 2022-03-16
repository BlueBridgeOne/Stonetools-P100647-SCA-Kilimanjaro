/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 * 
 * WARNING!! ********** Be careful with this script. ********
 * 
 * BB1 G Truslove - Mar 2018 - Time saving. Map Reduce Script which deletes every item or a specified type between two internal ids.
 */
define([ 'N/record', 'N/search', 'N/runtime' ],
/**
 * @param {record} record
 * @param {search} search
 */
function(record, search, runtime) {

	var minid=0,maxid=351;
	
	var type = "customrecord_bb1_ba_busana";
	var minfield = "name"; //Specify at least one field for the search.

	//var type = "customrecord_bb1_sca_article";
	//var minfield = "name"; //Specify at least one field for the search.

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
		log.debug("Input Data", "Get all " + type + ".");
		var newSearch = search.create({
			type : type,
			filters : [],
			columns : [ minfield ],
			title : 'All "+type+" Search'
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
			var itemId = searchResult.id;
			var minvalue = searchResult.values[minfield];

			//applyLocationDiscountToInvoice(itemId);
			

			try {
				if(itemId>=minid&&itemId<=maxid){
					log.audit("MAP", itemId + "=" + minvalue);
				var objRecord = record.delete({
					type : type,
					id : itemId
				});
				}
				
			} catch (error1) {
				log.error("MAP DELETE", error1);
			}

			//context.write(itemId, upccode);
		}
	}

	/**
	 * Executes when the reduce entry point is triggered and applies to each group.
	 *
	 * @param {ReduceSummary} context - Data collection containing the groups to process through the reduce stage
	 * @since 2015.1
	 */
	function reduce(context) {
		//log.debug("REDUCE", context.key + " " + context.values.join(","));
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
			name : 'custscript_bb1_abort_delete'
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
		reduce : reduce,
		summarize : summarize
	};

});
