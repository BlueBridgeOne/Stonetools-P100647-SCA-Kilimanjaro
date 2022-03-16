/**
 * Description : Extend the analytics data record form to include cool graphs and sorted lists.
 * 
 * @Author : Gordon Truslove
 * @Date   : 8/20/2018, 10:05:34 PM
 * 
 * Copyright (c) 2017 BlueBridge One Business Solutions, All Rights Reserved
 * support@bluebridgeone.com, +44 (0)1932 300007
 * 
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/ui/serverWidget', 'N/record', 'N/search','N/runtime'],

    function (serverWidget, record, search,runtime) {

        /**
         * Function definition to be triggered before record is loaded.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type
         * @param {Form} scriptContext.form - Current form
         * @Since 2015.2
         */
        function beforeLoad(scriptContext) {

            if (scriptContext.type == scriptContext.UserEventType.DELETE) return;

            var rec = scriptContext.newRecord;
            var prefix = "custrecord_bb1_scaa_custana_";
            var now = new Date();
            var year = now.getFullYear().toString();
            var form = scriptContext.form;

            // form.clientScriptModulePath = "./bb1_scaa_extend_form_cl.js";

            // var scriptObj = runtime.getCurrentScript();

            // form.addButton({
            //     id : 'custpage_lastyear',
            //     label : "< "+(year-1).toString()+" "+scriptObj.getParameter("year"),
            //     functionName:"bb1_previousYear"
            // });
            // if(year<currentyear){
            //     form.addButton({
            //         id : 'custpage_lastyear',
            //         label : (year+1).toString()+" >",
            //         functionName:"bb1_nextYear"
            //     }); 
            // }

            var name = rec.getValue({
                fieldId: 'name'
            });

            var pagedata = rec.getValue(prefix + "pagedata");
            if (pagedata && pagedata.length > 0) {
                try {
                    pagedata = JSON.parse(pagedata);
                } catch (e) {
                    pagedata = {};
                }
            } else {
                pagedata = {};
            }
            var visitdata = rec.getValue(prefix + "visitdata");
            if (visitdata && visitdata.length > 0) {
                try {
                    visitdata = JSON.parse(visitdata);
                } catch (e) {
                    visitdata = {};
                }
            } else {
                visitdata = {};
            }
            var viewdata = rec.getValue(prefix + "viewdata");
            if (viewdata && viewdata.length > 0) {
                try {
                    viewdata = JSON.parse(viewdata);
                } catch (e) {
                    viewdata = {};
                }
            } else {
                viewdata = {};
            }
            var catdata = rec.getValue(prefix + "catdata");
            if (catdata && catdata.length > 0) {
                try {
                    catdata = JSON.parse(catdata);
                } catch (e) {
                    catdata = {};
                }
            } else {
                catdata = {};
            }
            var artdata = rec.getValue(prefix + "artdata");
            if (artdata && artdata.length > 0) {
                try {
                    artdata = JSON.parse(artdata);
                } catch (e) {
                    artdata = {};
                }
            } else {
                artdata = {};
            }
            var itemdata = rec.getValue(prefix + "itemdata");
            if (itemdata && itemdata.length > 0) {
                try {
                    itemdata = JSON.parse(itemdata);
                } catch (e) {
                    itemdata = {};
                }
            } else {
                itemdata = {};
            }


            var chartfield = form.addField({
                id: 'custpage_chartjs',
                type: serverWidget.FieldType.INLINEHTML,
                label: "ChartJS"
            });
            chartfield.updateLayoutType({
                layoutType: serverWidget.FieldLayoutType.OUTSIDE
            });
            chartfield.defaultValue = "<script src=\"https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.min.js\" ></script>";


            barChart(form, 'Site Visits', 'visitchart', visitdata);
            barChart(form, 'Page Views', 'pagechart', pagedata);
            catList(form, "View Trends","Url", "views", viewdata);
            catList(form, "Item Trends","Item|Description", "items", itemdata);
            catList(form, "Category Trends","Category", "categories", catdata);
            catList(form, "Article Trends","Article|Title", "article", artdata);
        }

        function catList(form, title,element, chartid, values) {
            if (typeof values == "string") {
                try{
                values = JSON.parse(values);
                }catch(err){
                    log.error("Bad JSON",title+" "+values);
                }
            }
            var fieldgroup = form.addTab({
                id: 'custpage_tab_' + chartid,
                label: title
            });

            var sublist = form.addSublist({
                id: 'custpage_sublist_' + chartid,
                type: serverWidget.SublistType.STATICLIST,
                label: title,
                tab: 'custpage_tab_' + chartid
            });

            sublist.addField({
                id: 'custpage_cat_rank',
                type: serverWidget.FieldType.TEXT,
                label: 'Rank'
            });
            if(element.indexOf("|")>-1){
var parts=element.split("|");
                sublist.addField({
                    id: 'custpage_cat_id',
                    type: serverWidget.FieldType.TEXT,
                    label: parts[0]
                });
                sublist.addField({
                    id: 'custpage_cat_url',
                    type: serverWidget.FieldType.TEXT,
                    label: parts[1]
                });

            }else{
            sublist.addField({
                id: 'custpage_cat_url',
                type: serverWidget.FieldType.TEXT,
                label: element
            });
        }

            sublist.addField({
                id: 'custpage_cat_score',
                type: serverWidget.FieldType.TEXT,
                label: 'Score'
            });
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
            //log.debug("List",(typeof values)+" "+JSON.stringify(values)+" "+JSON.stringify(list));
            for (var i = 0; i < list.length; i++) {
                sublist.setSublistValue({
                    id: 'custpage_cat_rank',
                    line: i,
                    value: (i + 1).toString()
                });
                if(element.indexOf("|")>-1){
                    var parts=list[i].name.split('|');
                    if(parts.length==1){
                        if(parts[0]==parseInt(parts[0]).toString()){
                            sublist.setSublistValue({
                                id: 'custpage_cat_id',
                                line: i,
                                value: parts[0]
                            });
                        }else{
                        sublist.setSublistValue({
                            id: 'custpage_cat_url',
                            line: i,
                            value: parts[0]
                        });
                    }
                    }else{
                    sublist.setSublistValue({
                        id: 'custpage_cat_id',
                        line: i,
                        value: parts[0]
                    });
                    sublist.setSublistValue({
                        id: 'custpage_cat_url',
                        line: i,
                        value: parts[1]
                    });
                }
                }else{
                sublist.setSublistValue({
                    id: 'custpage_cat_url',
                    line: i,
                    value: list[i].name
                });
            }
                sublist.setSublistValue({
                    id: 'custpage_cat_score',
                    line: i,
                    value: list[i].value.toFixed(1).replace(".0","").toString()
                });
            }
        }

        function barChart(form, title, chartid, values) {
            if (values) {
                var now = new Date();
                var year = now.getFullYear().toString();

                var fieldgroup = form.addFieldGroup({
                    id: 'fieldgroup' + chartid,
                    label: title
                });

                var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


                var chartfield = form.addField({
                    id: 'custpage_' + chartid,
                    type: serverWidget.FieldType.INLINEHTML,
                    label: title,
                    container: 'fieldgroup' + chartid
                });


                var chart = "";
                chart += "<div style='display:block;width:100%!important;height:300px!important;'><canvas id='" + chartid + "'></canvas></div>";
                chart += "<script>";
                chart += "var ctx = document.getElementById(\"" + chartid + "\").getContext('2d');";

                var chartdata = {
                    type: 'bar',

                    data: {
                        labels: months,
                        datasets: []
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }
                };
                var colors=['207,140,96','140,96, 207','96, 207, 140'];
var y;
                for(var i=0;i<3;i++){
                    y=year-2+i;
                    if(values[y]){
                chartdata.data.datasets.push({
                    label: title+" "+y,
                    data: values[y],
                    backgroundColor: 'rgba('+colors[i]+', 0.5)',
                    borderColor: 'rgba('+colors[i]+', 1)',
                    borderWidth: 1
                });
            }
            }
                chart += "var myChart = new Chart(ctx, " + JSON.stringify(chartdata) + ");";
                chart += "</script>";


                chartfield.defaultValue = chart;
                chartfield.updateBreakType({
                    breakType: serverWidget.FieldBreakType.STARTROW
                });
            }
        }

        return {
            beforeLoad: beforeLoad
        };

    });