/**
 * Project : P100647 (MS)
 *
 * Description : This map reduce looks at every customer and collates all the data into digestible trending data which can be used to work out if customer spend is declining in general or in any specific area.
 *
 * @Author : Gordon Truslove - code25.com
 * @Date   : 2/22/2019, 4:05:32 PM
 *
 * Updated Mar 2022
 *
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
/// <reference path="../suitescript.ts" />
define(['N/record', 'N/search', 'N/runtime', 'N/format'], function (record, search, runtime, format) {
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
                //["internalid", "anyof", 17329]	
                ["isinactive", "is", "F"]
            ];
            //
            var newSearch = search.create({
                type: "customer",
                filters: filters,
                columns: ['entityid', 'currency', 'custentity_bb1_ba_businessanalytics', 'custentity_noofstoneworkers', 'custentity_toolspendpermonth', 'datecreated', 'billcountry']
            });
            return newSearch;
        }
        catch (err) {
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
            //log.debug("Customer", JSON.stringify(searchResult));
            //Collate all the sales data for this customer into easy to manage JSON objects.
            var salesorderSearchObj = search.create({
                type: "salesorder",
                filters: [
                    ["type", "anyof", "SalesOrd"],
                    "AND",
                    ["customer.internalid", "anyof", searchResult.id],
                    "AND",
                    ["mainline", "is", "F"],
                    "AND",
                    ["amount", "greaterthan", "0.00"]
                ],
                columns: [
                    search.createColumn({
                        name: "mainline"
                    }),
                    search.createColumn({
                        name: "trandate"
                    }),
                    search.createColumn({
                        name: "amount"
                    }),
                    search.createColumn({
                        name: "item"
                    }),
                    search.createColumn({
                        name: "class",
                        join: "item"
                    }),
                    search.createColumn({
                        name: "custitem_cseg1",
                        join: "item"
                    })
                ]
            });
            var custentity_noofstoneworkers = searchResult.values.custentity_noofstoneworkers || 1;
            var custentity_toolspendpermonth = searchResult.values.custentity_noofstoneworkers || 300;
            var opportunity_1 = custentity_noofstoneworkers * custentity_toolspendpermonth;
            if (!(opportunity_1 > 50)) {
                opportunity_1 = 50;
            }
            var datecreated_1 = format.parse({
                value: searchResult.values.datecreated,
                type: format.Type.DATE
            });
            //log.debug("salesorderSearchObj result count",searchResultCount);
            var date_1, salesData_1 = {}, ordersData_1 = {}, oppData_1 = {}, catData_1 = {}, year_1, month_1, amount_1, found_1 = false, cat_1;
            //calculate all time
            var allTime_1 = 0;
            salesorderSearchObj.run().each(function (result) {
                date_1 = format.parse({
                    value: result.getValue("trandate"),
                    type: format.Type.DATE
                });
                amount_1 = parseFloat(result.getValue("amount"));
                allTime_1 += amount_1;
                year_1 = date_1.getFullYear();
                month_1 = date_1.getMonth();
                if (!salesData_1[year_1]) {
                    salesData_1[year_1] = [];
                    ordersData_1[year_1] = [];
                    oppData_1[year_1] = [];
                }
                if (!salesData_1[year_1][month_1]) {
                    salesData_1[year_1][month_1] = amount_1;
                    ordersData_1[year_1][month_1] = 1;
                    oppData_1[year_1][month_1] = Math.max(0, opportunity_1 - amount_1);
                }
                else {
                    salesData_1[year_1][month_1] = salesData_1[year_1][month_1] + amount_1;
                    ordersData_1[year_1][month_1] = ordersData_1[year_1][month_1] + 1;
                    oppData_1[year_1][month_1] = Math.max(0, oppData_1[year_1][month_1] - amount_1);
                }
                salesData_1[year_1][month_1] = Math.round(salesData_1[year_1][month_1] * 100) / 100;
                if (month_1 > 0) {
                    for (var i = 0; i < month_1; i++) {
                        if (!salesData_1[year_1][i]) {
                            salesData_1[year_1][i] = 0;
                            ordersData_1[year_1][i] = 0;
                            if (new Date(year_1, i + 1, 1) > datecreated_1) {
                                oppData_1[year_1][i] = opportunity_1;
                            }
                        }
                    }
                }
                cat_1 = result.getText({
                    name: "class",
                    join: "item"
                });
                //+ " : " + result.getText({
                // name: "custitem_cseg1",
                // join: "item"
                // })
                if (cat_1 != "") {
                    if (!catData_1[cat_1]) {
                        catData_1[cat_1] = {};
                    }
                    if (!catData_1[cat_1][year_1]) {
                        catData_1[cat_1][year_1] = [];
                    }
                    if (!catData_1[cat_1][year_1][month_1]) {
                        catData_1[cat_1][year_1][month_1] = amount_1;
                    }
                    else {
                        catData_1[cat_1][year_1][month_1] = catData_1[cat_1][year_1][month_1] + amount_1;
                    }
                    catData_1[cat_1][year_1][month_1] = Math.round(catData_1[cat_1][year_1][month_1] * 100) / 100;
                    if (month_1 > 0) {
                        for (var i = 0; i < month_1; i++) {
                            if (!catData_1[cat_1][year_1][i]) {
                                catData_1[cat_1][year_1][i] = 0;
                            }
                        }
                    }
                }
                found_1 = true;
                return true;
            });
            //set sales rep
            if (allTime_1 >= 1000) {
                var billcountry = searchResult.values.billcountry;
                log.debug("set sales rep", "country " + billcountry.value + " " + allTime_1);
                if (billcountry.value == "GB" || billcountry.value == "IE") {
                    log.debug("set sales rep", "submit! 76406");
                    record.submitFields({
                        type: "customer",
                        id: searchResult.id,
                        values: {
                            salesrep: 76406
                        },
                        options: {
                            enableSourcing: false,
                            ignoreMandatoryFields: true
                        }
                    });
                    var cust = record.load({ type: "customer", id: searchResult.id });
                    cust.setValue({ fieldId: "salesrep", value: 76406 });
                    cust.save();
                }
            }
            if (found_1) { //only create analytics record if there are any orders
                var newBA = void 0;
                var custentity_bb1_ba_businessanalytics = searchResult.values.custentity_bb1_ba_businessanalytics;
                if (!custentity_bb1_ba_businessanalytics) {
                    //Create a new business analytics record and attach it to the customer.
                    newBA = record.create({
                        type: "customrecord_bb1_ba_busana",
                        isDynamic: true
                    });
                    newBA.setValue({
                        fieldId: 'name',
                        value: "Customer " + searchResult.values.entityid,
                        ignoreFieldChange: true
                    });
                    newBA.setValue({
                        fieldId: 'custrecord_bb1_ba_busana_customer',
                        value: searchResult.id,
                        ignoreFieldChange: true
                    });
                    var newAnalyticsId = newBA.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: true
                    });
                    newBA = record.load({
                        type: "customrecord_bb1_ba_busana",
                        id: newAnalyticsId,
                        isDynamic: true
                    });
                    record.submitFields({
                        type: "customer",
                        id: searchResult.id,
                        values: {
                            custentity_bb1_ba_businessanalytics: newAnalyticsId
                        },
                        options: {
                            enableSourcing: false,
                            ignoreMandatoryFields: true
                        }
                    });
                }
                else {
                    //log.debug("custentity_bb1_ba_businessanalytics", custentity_bb1_ba_businessanalytics);
                    newBA = record.load({
                        type: "customrecord_bb1_ba_busana",
                        id: custentity_bb1_ba_businessanalytics.value,
                        isDynamic: true
                    });
                }
                //Fill in hidden data on record.
                newBA.setValue({
                    fieldId: 'custrecord_bb1_ba_busana_salesdata',
                    value: JSON.stringify(salesData_1),
                    ignoreFieldChange: true
                });
                newBA.setValue({
                    fieldId: 'custrecord_bb1_ba_busana_orderdata',
                    value: JSON.stringify(ordersData_1),
                    ignoreFieldChange: true
                });
                newBA.setValue({
                    fieldId: 'custrecord_bb1_ba_busana_oppdata',
                    value: JSON.stringify(oppData_1),
                    ignoreFieldChange: true
                });
                newBA.setValue({
                    fieldId: 'custrecord_bb1_ba_busana_toolspend',
                    value: opportunity_1,
                    ignoreFieldChange: true
                });
                newBA.setValue({
                    fieldId: 'custrecord_bb1_ba_busana_catdata',
                    value: JSON.stringify(catData_1),
                    ignoreFieldChange: true
                });
                //calculate trends
                var prev = 24; //last 2 years
                var total = 0, m = 0, l = 0, diff = 0, lastthree = 0, previousthree = 0, lastsix = 0, previoussix = 0, lastyear = 0, previousyear = 0, max = 0, CurrentDate = new Date();
                CurrentDate.setMonth(CurrentDate.getMonth() - prev);
                for (var j = 0; j < prev; j++) {
                    m = salesData_1[CurrentDate.getFullYear()];
                    if (m) {
                        m = m[CurrentDate.getMonth()];
                    }
                    if (!m) {
                        m = 0;
                    }
                    if (m > max) {
                        max = m;
                    }
                    CurrentDate.setMonth(CurrentDate.getMonth() + 1);
                }
                CurrentDate = new Date();
                CurrentDate.setMonth(CurrentDate.getMonth() - prev);
                for (var j = 0; j < prev; j++) {
                    total *= .95;
                    m = salesData_1[CurrentDate.getFullYear()];
                    if (m) {
                        m = m[CurrentDate.getMonth()];
                    }
                    if (!m) {
                        m = 0;
                    }
                    diff = m - l;
                    if (m != 0) {
                        total += Math.min(100, Math.max(-100, 100 * (diff / max)));
                        //log.debug("total",diff+" / "+max+" : "+Math.min(100, Math.max(-100, 100 * (diff / max)))+" = "+total);
                        l = m;
                    }
                    else {
                        total *= .8;
                        //log.debug("total","Reduce "+total);
                    }
                    //log.debug("diff",l+" "+diff+" "+Math.max(-100,Math.min(100,100*(diff/l))));
                    if (j >= prev - 3) {
                        lastthree += m;
                    }
                    else if (j >= prev - 6) {
                        previousthree += m;
                    }
                    if (j >= prev - 6) {
                        lastsix += m;
                    }
                    else if (j >= prev - 12) {
                        previoussix += m;
                    }
                    if (j >= prev - 12) {
                        lastyear += m;
                    }
                    else if (j >= prev - 24) {
                        previousyear += m;
                    }
                    //log.error("diff", i+" "+diff+" "+total);
                    CurrentDate.setMonth(CurrentDate.getMonth() + 1);
                }
                newBA.setValue({
                    fieldId: 'custrecord_bb1_ba_busana_lastthree',
                    value: Math.round(lastthree * 100) / 100,
                    ignoreFieldChange: true
                });
                newBA.setValue({
                    fieldId: 'custrecord_bb1_ba_busana_previousthree',
                    value: Math.round(previousthree * 100) / 100,
                    ignoreFieldChange: true
                });
                newBA.setValue({
                    fieldId: 'custrecord_bb1_ba_busana_lastsix',
                    value: Math.round(lastsix * 100) / 100,
                    ignoreFieldChange: true
                });
                newBA.setValue({
                    fieldId: 'custrecord_bb1_ba_busana_previoussix',
                    value: Math.round(previoussix * 100) / 100,
                    ignoreFieldChange: true
                });
                newBA.setValue({
                    fieldId: 'custrecord_bb1_ba_busana_lastyear',
                    value: Math.round(lastyear * 100) / 100,
                    ignoreFieldChange: true
                });
                newBA.setValue({
                    fieldId: 'custrecord_bb1_ba_busana_previousyear',
                    value: Math.round(previousyear * 100) / 100,
                    ignoreFieldChange: true
                });
                newBA.setValue({
                    fieldId: 'custrecord_bb1_ba_busana_trend',
                    value: Math.round(total * 100) / 100,
                    ignoreFieldChange: true
                });
                newBA.setValue({
                    fieldId: 'custrecord_bb1_ba_busana_yearchange',
                    value: Math.round((lastyear - previousyear) * 100) / 100,
                    ignoreFieldChange: true
                });
                newBA.setValue({
                    fieldId: 'custrecord_bb1_ba_busana_monthchange',
                    value: Math.round((lastthree - previousthree) * 100) / 100,
                    ignoreFieldChange: true
                });
                newBA.setValue({
                    fieldId: 'custrecord_bb1_ba_busana_6monthchange',
                    value: Math.round((lastsix - previoussix) * 100) / 100,
                    ignoreFieldChange: true
                });
                var monthlyPercentage = void 0;
                if (previousthree == 0) {
                    if (lastthree > 0) {
                        monthlyPercentage = 100;
                    }
                    else {
                        monthlyPercentage = 0;
                    }
                }
                else {
                    monthlyPercentage = Math.round(((lastthree - previousthree) / previousthree) * 100 * 100) / 100;
                }
                var sixmonthlyPercentage = void 0;
                if (previoussix == 0) {
                    if (lastsix > 0) {
                        sixmonthlyPercentage = 100;
                    }
                    else {
                        sixmonthlyPercentage = 0;
                    }
                }
                else {
                    sixmonthlyPercentage = Math.round(((lastsix - previoussix) / previoussix) * 100 * 100) / 100;
                }
                var yearlyPercentage = void 0;
                if (previousyear == 0) {
                    if (lastyear > 0) {
                        yearlyPercentage = 100;
                    }
                    else {
                        yearlyPercentage = 0;
                    }
                }
                else {
                    yearlyPercentage = Math.round(((lastyear - previousyear) / previousyear) * 100 * 100) / 100;
                }
                newBA.setValue({
                    fieldId: 'custrecord_bb1_ba_busana_yearchangep',
                    value: yearlyPercentage,
                    ignoreFieldChange: true
                });
                newBA.setValue({
                    fieldId: 'custrecord_bb1_ba_busana_monthchangep',
                    value: monthlyPercentage,
                    ignoreFieldChange: true
                });
                newBA.setValue({
                    fieldId: 'custrecord_bb1_ba_busana_6monthchangep',
                    value: sixmonthlyPercentage,
                    ignoreFieldChange: true
                });
                newBA.setValue({
                    fieldId: 'custrecord_bb1_ba_busana_alltimesales',
                    value: Math.round(allTime_1 * 100) / 100,
                    ignoreFieldChange: true
                });
                //var statusp = (monthlyPercentage + yearlyPercentage) / 2;
                if (lastyear == 0) {
                    newBA.setText({
                        fieldId: 'custrecord_bb1_ba_busana_status',
                        text: "Declined",
                        ignoreFieldChange: true
                    });
                }
                else if (lastthree > 0 && lastthree == lastyear) {
                    newBA.setText({
                        fieldId: 'custrecord_bb1_ba_busana_status',
                        text: "New",
                        ignoreFieldChange: true
                    });
                }
                else if (total < -30) {
                    newBA.setText({
                        fieldId: 'custrecord_bb1_ba_busana_status',
                        text: "Declining",
                        ignoreFieldChange: true
                    });
                }
                else if (total > 30) {
                    newBA.setText({
                        fieldId: 'custrecord_bb1_ba_busana_status',
                        text: "Growing",
                        ignoreFieldChange: true
                    });
                }
                else if (lastsix == 0) {
                    newBA.setText({
                        fieldId: 'custrecord_bb1_ba_busana_status',
                        text: "Stopped",
                        ignoreFieldChange: true
                    });
                }
                else {
                    newBA.setText({
                        fieldId: 'custrecord_bb1_ba_busana_status',
                        text: "Stable",
                        ignoreFieldChange: true
                    });
                }
                //catculate Category Trends
                //catData[cat][year][month]
                var decCats = [], growCats = [];
                for (var cat_2 in catData_1) {
                    CurrentDate = new Date();
                    CurrentDate.setMonth(CurrentDate.getMonth() - prev);
                    total = 0;
                    lastthree = 0;
                    previousthree = 0;
                    lastyear = 0;
                    previousyear = 0;
                    l = 0;
                    for (var j = 0; j < prev; j++) {
                        total *= .95;
                        m = catData_1[cat_2][CurrentDate.getFullYear()];
                        if (m) {
                            m = m[CurrentDate.getMonth()];
                        }
                        if (!m) {
                            m = 0;
                        }
                        diff = m - l;
                        if (m != 0) {
                            total += Math.min(100, Math.max(-100, 100 * (diff / max)));
                            l = m;
                        }
                        else {
                            total *= .8;
                        }
                        if (j >= prev - 3) {
                            lastthree += m;
                        }
                        else if (j >= prev - 6) {
                            previousthree += m;
                        }
                        if (j >= prev - 12) {
                            lastyear += m;
                        }
                        else if (j >= prev - 24) {
                            previousyear += m;
                        }
                        //log.error("diff", i+" "+diff+" "+total);
                        CurrentDate.setMonth(CurrentDate.getMonth() + 1);
                    }
                    if (previousthree == 0) {
                        monthlyPercentage = 0;
                    }
                    else {
                        monthlyPercentage = Math.round(((lastthree - previousthree) / previousthree) * 100 * 100) / 100;
                    }
                    if (previousyear == 0) {
                        yearlyPercentage = 0;
                    }
                    else {
                        yearlyPercentage = Math.round(((lastyear - previousyear) / previousyear) * 100 * 100) / 100;
                    }
                    //statusp = (monthlyPercentage + yearlyPercentage) / 2;
                    if (lastyear == 0) {
                        decCats.push(cat_2);
                    }
                    else if (lastthree == lastyear) {
                    }
                    else if (total < -30) {
                        decCats.push(cat_2);
                    }
                    else if (total > 30) {
                        growCats.push(cat_2);
                    }
                }
                newBA.setText({
                    fieldId: 'custrecord_bb1_ba_busana_deccat',
                    text: decCats.join(", "),
                    ignoreFieldChange: true
                });
                newBA.setText({
                    fieldId: 'custrecord_bb1_ba_busana_growcat',
                    text: growCats.join(", "),
                    ignoreFieldChange: true
                });
                newBA.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: true
                });
                //log.debug("data", JSON.stringify(salesData));
                //log.debug("cats", JSON.stringify(catData));
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
    function abort() {
        if (isAbort) {
            return isAbort;
        }
        var abort = runtime.getCurrentScript().getParameter({
            name: 'custscript_bb1_ba_abort'
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
        summarize: summarize
    };
});
