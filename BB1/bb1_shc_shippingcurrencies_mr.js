/**
 *
 * Fix foreign currency shipping items by programatically recalculating shipping items to allow for EU exchange rate
 *
 * Date			Author			Purpose		
 * 21 Sep 2017	Gordon Truslove	Initial release
 *
 * Copyright (c) 2017 BlueBridge One Business Solutions, All Rights Reserved
 * support@bluebridgeone.com, +44 (0)1932 300007
 *
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define([ 'N/record', 'N/search', 'N/runtime', 'N/currency' ],

function(record, search, runtime, currency) {

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
		log.debug("Start Shipping Currency Conversion", "Get all shipping items.");

		var filters = [ [ 'isinactive', search.Operator.IS, 'F' ] ];
		var newSearch = search.create({
			type : record.Type.SHIP_ITEM,
			filters : filters,
			columns : [ 'itemid', 'description' ],
			title : 'All Shipping Items Search'
		});
		return newSearch;
	}

	/**
	 * Use the description field to set shipping amounts using exchange rate.
	 *
	 * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
	 * @since 2015.1
	 */
	function map(context) {
		if (!abort()) {
			try {
				var searchResult = JSON.parse(context.value);
				if (searchResult.values.description && searchResult.values.description.length > 0) {
					//log.debug("Process MAP", "Shipping item=" + context.key);
					//log.debug("Process MAP DATA", "data=" + JSON.stringify(JSON.parse(context.value)));
					var desc = searchResult.values.description;
					var lines = desc.split("\n");
					var values = {}, params;
					for (var i = 0; i < lines.length; i++) {
						params = lines[i].split(":");
						if (params.length == 2) {
							values[params[0].trim().toUpperCase().split(" ").join("_")] = params[1].trim();
						}
					}
					//log.debug("Process MAP JSON", "json=" + JSON.stringify(values));
					if (values.CURRENCY) {
						var rate = currency.exchangeRate({
							source : values.CURRENCY,
							target : 'GBP'
						});
						var submit = {};
						if (values.FLAT_RATE) {
							var fxAmount = parseFloat(values.FLAT_RATE);
							submit.shippingflatrateamount = Math.round(100 * fxAmount * rate) / 100;
if((Math.ceil((100 * submit.shippingflatrateamount) / rate)) / 100>fxAmount){
	submit.shippingflatrateamount-=.01;
}
							log.debug("Process MAP", "FLAT_RATE=" + fxAmount + " * " + rate + " = " + submit.shippingflatrateamount + " " + ((Math.ceil((100 * submit.shippingflatrateamount) / rate)) / 100));
						}
						if (values.FREE_IF_TOTAL_ORDER_IS_OVER) {
							var fxAmount = parseFloat(values.FREE_IF_TOTAL_ORDER_IS_OVER);
							submit.freeifordertotalisoveramount = Math.round(100 * fxAmount * rate) / 100;
							if((Math.ceil((100 * submit.freeifordertotalisoveramount) / rate)) / 100>fxAmount){
								submit.freeifordertotalisoveramount-=.01;
							}
							log.debug("Process MAP", "FREE_IF_TOTAL_ORDER_IS_OVER=" + fxAmount + " * " + rate);
						}
						if (values.AVAILABLE_IF_ORDER_TOTAL_IS) {
							var fxAmount = parseFloat(values.AVAILABLE_IF_ORDER_TOTAL_IS);
							submit.doiftotalamt = Math.round(100 * fxAmount * rate) / 100;
							if((Math.ceil((100 * submit.doiftotalamt) / rate)) / 100>fxAmount){
								submit.doiftotalamt-=.01;
							}
							log.debug("Process MAP", "AVAILABLE_IF_ORDER_TOTAL_IS=" + fxAmount + " * " + rate);
						}

						if (values.MINIMUM_SHIPPING_AMOUNT) {
							var fxAmount = parseFloat(values.MINIMUM_SHIPPING_AMOUNT);
							submit.minimumshippingcost = Math.round(100 * fxAmount * rate) / 100;
							if((Math.ceil((100 * submit.minimumshippingcost) / rate)) / 100>fxAmount){
								submit.minimumshippingcost-=.01;
							}
							log.debug("Process MAP", "MINIMUM_SHIPPING_AMOUNT=" + fxAmount + " * " + rate);
						}
						if (values.MAXIMUM_SHIPPING_AMOUNT) {
							var fxAmount = parseFloat(values.MAXIMUM_SHIPPING_AMOUNT);
							submit.maximumshippingcost = Math.round(100 * fxAmount * rate) / 100;
							if((Math.ceil((100 * submit.maximumshippingcost) / rate)) / 100>fxAmount){
								submit.maximumshippingcost-=.01;
							}
							log.debug("Process MAP", "MAXIMUM_SHIPPING_AMOUNT=" + fxAmount + " * " + rate);
						}

						var id = record.submitFields({
							type : record.Type.SHIP_ITEM,
							id : context.key,
							values : submit,
							options : {
								enableSourcing : false,
								ignoreMandatoryFields : true
							}
						});

					}
				}

			} catch (err) {
				log.error("Process MAP", err);
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

		log.debug("Summary", "Complete seconds=" + seconds + " usage=" + usage + " yields=" + yields);

		summary.mapSummary.errors.iterator().each(function(key, error) {
			log.error('Map Error for key: ' + key, error);
			return true;
		});

		summary.reduceSummary.errors.iterator().each(function(key, error) {
			log.error('Reduce Error for key: ' + key, error);
			return true;
		});
	}

	var isAbort = false;
	function abort() { //Abort the script if this parameter is checked.
		if (isAbort) {
			return isAbort;
		}
		var abort = runtime.getCurrentScript().getParameter({
			name : 'custscript_bb1_abort2'
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
