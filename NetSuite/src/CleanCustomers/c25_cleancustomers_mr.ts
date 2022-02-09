/**
 * Description : 
 * 
 * @Author : Gordon Truslove - code25.com
 * @Date   : 2/9/2022, 4:22:29 PM
 * 
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
/// <reference path="../suitescript.ts" />

define([ 'N/record', 'N/search','N/runtime' ],

function(record:iRecord, search:iSearch,runtime:iRuntime) {

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
	function getInputData():iRecordSearch {
        try{
			log.debug("Map Reduce", "Start");


		var customerSearchObj = search.create({
			type: "customer",
			filters:
			[
			   ["shippingaddress.address1","startswith","506 Boulevard"],
			   "AND", 
      ["internalidnumber","greaterthan","429850"]
			],
			columns:
			[
			   search.createColumn({
				  name: "entityid"
			   }),
			   search.createColumn({name: "email"})
			]
		 });
		 return customerSearchObj;
        
		} catch (err) {
			log.debug("getInputData Error", err);
			return;
		}
	}

	/**
	 * Executes when the map entry point is triggered and applies to each key/value pair.
	 *
	 * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
	 * @since 2015.1
	 */
	function map(context:iMapContext) {
		if (!abort()) {
			log.debug("Process MAP", "context=" + context.key);
            let searchResult:any = JSON.parse(context.value);
        }

	}

	/**
	 * Executes when the reduce entry point is triggered and applies to each group.
	 *
	 * @param {ReduceSummary} context - Data collection containing the groups to process through the reduce stage
	 * @since 2015.1
	 */
	function reduce(context:iReduceContext) {
        if (!abort()) {
			//log.debug("Process Reduce", "context=" + context.key + " " + JSON.stringify(context.values));
		}
	}

	/**
	 * Executes when the summarize entry point is triggered and applies to the result set.
	 *
	 * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
	 * @since 2015.1
	 */
	function summarize(summary:iSummary) {

        var seconds = summary.seconds;
		var usage = summary.usage;
		var yields = summary.yields;

		log.debug("Summary", "Complete seconds=" + seconds + " usage=" + usage + " yields=" + yields);

		if(summary.inputSummary.error){
			log.error('Input Error:', summary.inputSummary.error);
			}

		summary.mapSummary.errors.iterator().each(function(key, error) {
			log.error('Map Error for key: ' + key, error);
			return true;
		});

		summary.reduceSummary.errors.iterator().each(function(key, error) {
			log.error('Reduce Error for key: ' + key, error);
			return true;
        });
        
    }
    
    let isAbort:boolean = false;
	function abort():boolean { //Abort the script if this parameter is checked.
		if (isAbort) {
			return isAbort;
		}
		let abort:any = runtime.getCurrentScript().getParameter({
			name : 'custscript_bb1_abort'
		});
		let newAbort:boolean = (abort == "T" || abort == true);
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
