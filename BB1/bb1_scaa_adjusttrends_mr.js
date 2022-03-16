/**
 * Description : This map reduce will update analytics value each night so that the values trend.
 * Fields will also be set of the top trending values.
 * 
 * @Author : Gordon Truslove
 * @Date   : 1/17/2019, 4:55:58 PM
 * 
 * Copyright (c) 2017 BlueBridge One Business Solutions, All Rights Reserved
 * support@bluebridgeone.com, +44 (0)1932 300007
 * 
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/runtime'],

	function (record, search, runtime) {

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
			try {
				log.debug("Map Reduce", "Start");
				var filters = [
					['isinactive', search.Operator.IS, 'F']
				];
				//, "AND",['internalid', search.Operator.IS, 1]

				var prefix = "custrecord_bb1_scaa_custana_";

				var newSearch = search.create({
					type: "customrecord_bb1_scaa_custana",
					filters: filters,
					columns: [prefix + 'viewdata', prefix + 'artdata', prefix + 'catdata', prefix + 'itemdata', prefix + 'visitdata'],
					title: 'Search Results'
				});
				return newSearch;

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
		function map(context) {
			if (!abort()) {
				log.debug("Process MAP", "context=" + context.key);
				var searchResult = JSON.parse(context.value);
				var prefix = "custrecord_bb1_scaa_custana_",
					top;

				var viewdata = searchResult.values.custrecord_bb1_scaa_custana_viewdata;
				var itemdata = searchResult.values.custrecord_bb1_scaa_custana_itemdata;
				var catdata = searchResult.values.custrecord_bb1_scaa_custana_catdata;
				var artdata = searchResult.values.custrecord_bb1_scaa_custana_artdata;
				var visitdata = searchResult.values.custrecord_bb1_scaa_custana_visitdata;
				var update = {};
				var adjust = .99;
				if (viewdata) {
					viewdata = JSON.parse(viewdata);
					for (var i in viewdata) {
						viewdata[i] = viewdata[i] * adjust;
						if (viewdata[i] < .05) {
							viewdata[i] = undefined;
						}
					}
					update.custrecord_bb1_scaa_custana_viewdata = JSON.stringify(viewdata);

					top = findTop(viewdata);
					if (top) {
						update.custrecord_bb1_scaa_custana_trendingview = top;
					}
				}
				if (itemdata) {
					itemdata = JSON.parse(itemdata);
					for (var i in itemdata) {
						itemdata[i] = itemdata[i] * adjust;
						if (itemdata[i] < .05) {
							itemdata[i] = undefined;
						}
					}
					update.custrecord_bb1_scaa_custana_itemdata = JSON.stringify(itemdata);

					top = findTop(itemdata);
					if (top) {
						top = top.split("|");
						if (top.length == 2) {
							try {
								top = parseInt(top);
							} catch (err) {}
						}
						if (top > 0) {
							update.custrecord_bb1_scaa_custana_trendingitem = top;
						}
					}
				}
				if (catdata) {
					catdata = JSON.parse(catdata);
					for (var i in catdata) {
						catdata[i] = catdata[i] * adjust;
						if (catdata[i] < .05) {
							catdata[i] = undefined;
						}
					}
					update.custrecord_bb1_scaa_custana_catdata = JSON.stringify(catdata);

					top = findTop(catdata);
					if (top) {
						var commercecategorySearchObj = search.create({
							type: "commercecategory",
							filters: [
								["fullurl", "is", top]
							],
							columns: [
								search.createColumn({
									name: "name",
									label: "Name"
								})
							]
						});
						var searchResultCount = commercecategorySearchObj.runPaged().count;
						//log.debug("commercecategorySearchObj result count",searchResultCount);
						commercecategorySearchObj.run().each(function (result) {
							update.custrecord_bb1_scaa_custana_trendingcat = result.id;
							return false;
						});
					}

				}
				if (artdata) {
					artdata = JSON.parse(artdata);
					for (var i in artdata) {
						artdata[i] = artdata[i] * adjust;
						if (artdata[i] < .05) {
							artdata[i] = undefined;
						}
					}
					update.custrecord_bb1_scaa_custana_artdata = JSON.stringify(artdata);

					top = findTop(artdata) || "";
					top = top.split("|");
					if (top.length == 2) {
						try {
							top = parseInt(top);
						} catch (err) {}
					}
					if (top > 0) {
						update.custrecord_bb1_scaa_custana_trendingart = top;
					}
				}
				if (visitdata) { //calculate visit trends.
					visitdata = JSON.parse(visitdata);

					var prev = 24; //last 2 years
					var CurrentDate = new Date();
					CurrentDate.setMonth(CurrentDate.getMonth() - prev);
					var total = 0,
						m = 0,
						l = 0,
						diff = 0;
					for (var i = 0; i < prev; i++) {
						total *= .97;
						m = visitdata[CurrentDate.getFullYear()];
						if (m) {
							m = m[CurrentDate.getMonth()];
						}
						if (!m) {
							m = 0;
						}
						diff = m - l;
						total += diff;
						//log.error("diff", i+" "+diff+" "+total);
						l = m;
						CurrentDate.setMonth(CurrentDate.getMonth() + 1);
					}
					
						update.custrecord_bb1_scaa_custana_trendingvis = parseFloat(total.toFixed(2));
					

				}

				try {

					//log.error("DO UPDATE", context.key + " " + JSON.stringify(update));
					record.submitFields({
						type: "customrecord_bb1_scaa_custana",
						id: context.key,
						values: update,
						options: {
							enableSourcing: false,
							ignoreMandatoryFields: true
						}
					});

				} catch (error1) {
					log.error("MAP UPDATE", error1);
				}

				//var viewdata = rec.getValue(prefix + "viewdata");
			}

		}

		function findTop(values) {
			var list = [];
			for (var value in values) {
				list.push({
					name: value,
					value: values[value]
				});
			}
			var swap, change = false;
			do {
				change = false;
				for (var i = 0; i < list.length - 1; i++) {
					if (list[i].value < list[i + 1].value) {
						swap = list[i];
						list[i] = list[i + 1];
						list[i + 1] = swap;
						change = true;
					}
				}
			} while (change);
			if (list.length > 0) {
				return list[0].name;
			}
		}

		/**
		 * Executes when the reduce entry point is triggered and applies to each group.
		 *
		 * @param {ReduceSummary} context - Data collection containing the groups to process through the reduce stage
		 * @since 2015.1
		 */
		function reduce(context) {
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
		function summarize(summary) {

			var seconds = summary.seconds;
			var usage = summary.usage;
			var yields = summary.yields;

			log.debug("Summary", "Complete seconds=" + seconds + " usage=" + usage + " yields=" + yields);

			summary.mapSummary.errors.iterator().each(function (key, error) {
				log.error('Map Error for key: ' + key, error);
				return true;
			});

			summary.reduceSummary.errors.iterator().each(function (key, error) {
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
				name: 'custscript_bb1_scaa_abort'
			});
			var newAbort = (abort == "T" || abort == true);
			if (!isAbort && newAbort) {
				log.error("Map/Reduce", "**** ABORT!! - Note: Script will continue, but map/reduce will be skipped. ****");
				isAbort = newAbort;
			}
			return newAbort;
		}

		return {
			getInputData: getInputData,
			map: map,
			reduce: reduce,
			summarize: summarize
		};

	});