/**
 * Description : Extend the business analytics data record form to include cool graphs and sorted lists.
 * 
 * @Author : Gordon Truslove
 * @Date   : 1/3/2019, 10:05:34 PM
 * 
 * Copyright (c) 2017 BlueBridge One Business Solutions, All Rights Reserved
 * support@bluebridgeone.com, +44 (0)1932 300007
 * 
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/ui/serverWidget', 'N/record', 'N/search', 'N/runtime'],

    function (serverWidget, record, search, runtime) {

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
            var now = new Date();
            var year = now.getFullYear().toString();
            var form = scriptContext.form;
            var prefix = "custrecord_bb1_ba_busana_";

            var salesdata = rec.getValue(prefix + "salesdata");
            if (salesdata && salesdata.length > 0) {
                try {
                    salesdata = JSON.parse(salesdata);
                } catch (e) {
                    salesdata = {};
                }
            } else {
                salesdata = {};
            }

            var orderdata = rec.getValue(prefix + "orderdata");
            if (orderdata && orderdata.length > 0) {
                try {
                    orderdata = JSON.parse(orderdata);
                } catch (e) {
                    orderdata = {};
                }
            } else {
                orderdata = {};
            }
            var oppdata = rec.getValue(prefix + "oppdata");
            if (oppdata && oppdata.length > 0) {
                try {
                    oppdata = JSON.parse(oppdata);
                } catch (e) {
                    oppdata = {};
                }
            } else {
                oppdata = {};
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

            var chartfield = form.addField({
                id: 'custpage_chartjs',
                type: serverWidget.FieldType.INLINEHTML,
                label: "ChartJS"
            });
            chartfield.updateLayoutType({
                layoutType: serverWidget.FieldLayoutType.OUTSIDE
            });
            var styles = "<style>.bc,.bb{vertical-align:bottom;width:8px;display:inline-block;margin-right:1px;background-color:rgba(96, 207, 140,.75);border-bottom:1px solid #AAA;}.bb{background-color:transparent;}</style>"
            chartfield.defaultValue = styles + "<script src=\"https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.min.js\" ></script>";


            barChart(form, 'Sales', 'saleschart', salesdata);
            barChart(form, 'Orders', 'orderschart', orderdata);
            barChart(form, 'Missed Sales Opportunities', 'oppchart', oppdata);

            catList(form, "Sales by Category", "catchart", catdata);

        }


        function catList(form, title, chartid, values) {
            if (typeof values == "string") {
                try {
                    values = JSON.parse(values);
                } catch (err) {
                    log.error("Bad JSON", title + " " + values);
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
                id: 'custpage_cat_cat',
                type: serverWidget.FieldType.TEXT,
                label: "Category"
            });
            // sublist.addField({
            //     id: 'custpage_cat_data',
            //     type: serverWidget.FieldType.TEXT,
            //     label: "Data"
            // });

            var now = new Date();
            var year = now.getFullYear();

            var list = [],
                firstYear = year,
                m, max = 1;
            for (var value in values) {
                list.push({
                    name: value,
                    value: values[value]
                });
                for (var y in values[value]) {
                    if (parseInt(y) < firstYear) {
                        firstYear = parseInt(y);
                    }
                    for (var j = 0; j < values[value][y].length; j++) {
                        m = values[value][y][j];
                        if (m > max) {
                            max = m;
                        }
                    }
                }
            }
            for (var y = firstYear; y <= year; y++) {
                sublist.addField({
                    id: 'custpage_cat_year' + y,
                    type: serverWidget.FieldType.TEXTAREA,
                    label: y.toString()
                });
            }
            sublist.addField({
                id: 'custpage_cat_status',
                type: serverWidget.FieldType.TEXT,
                label: "Sales Status"
            });
            sublist.addField({
                id: 'custpage_cat_trend',
                type: serverWidget.FieldType.TEXT,
                label: "Trend"
            });

            // sublist.addField({
            //     id: 'custpage_cat_lastthree',
            //     type: serverWidget.FieldType.TEXT,
            //     label: "Last 3 Months"
            // });
            sublist.addField({
                id: 'custpage_cat_monthchange',
                type: serverWidget.FieldType.TEXT,
                label: "Change in 3 Months (%)"
            });
            sublist.addField({
                id: 'custpage_cat_yearchange',
                type: serverWidget.FieldType.TEXT,
                label: "Change in 1 Year (%)"
            });
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
            var prev = 24; //last 2 years
            var CurrentDate, total = 0,
                m = 0,
                l = 0,
                diff = 0,
                lastthree = 0,
                previousthree = 0,
                lastyear = 0,
                previousyear = 0;

            var chart = "",
                mheight = 40,
                yeardata, scale = mheight / max;
            for (var i = 0; i < list.length; i++) {
                sublist.setSublistValue({
                    id: 'custpage_cat_rank',
                    line: i,
                    value: (i + 1).toString()
                });

                sublist.setSublistValue({
                    id: 'custpage_cat_cat',
                    line: i,
                    value: list[i].name
                });
                // sublist.setSublistValue({
                //     id: 'custpage_cat_data',
                //     line: i,
                //     value: JSON.stringify(list[i].value)
                // });



                for (var y = firstYear; y <= year; y++) {

                    if (list[i].value[y]) {
                        yeardata = list[i].value[y];
                    } else {
                        yeardata = [];
                    }
                    chart = "";

                    for (var j = 0; j < 12; j++) {
                        if (j >= yeardata.length || yeardata[j] == 0) {
                            chart += "<div class='bb' style='height:" + mheight + "px;'></div>";
                        } else {
                            chart += "<div class='bc' style='height:" + parseInt(yeardata[j] * scale) + "px;'></div>";
                        }
                    }
                    sublist.setSublistValue({
                        id: 'custpage_cat_year' + y,
                        line: i,
                        value: chart
                    });


                }

                //Category trends

                CurrentDate = new Date();
					CurrentDate.setMonth(CurrentDate.getMonth() - prev);
					for (var j = 0; j < prev; j++) {

						m = list[i].value[CurrentDate.getFullYear()];
                    if (m) {
                        m = m[CurrentDate.getMonth()];
                    }
                    if (!m) {
                        m = 0;
                    }
						if(m>max){max=m;}
						CurrentDate.setMonth(CurrentDate.getMonth() + 1);
                    }
                    

                CurrentDate = new Date();
                CurrentDate.setMonth(CurrentDate.getMonth() - prev);
                total = 0;
                lastthree = 0;
                previousthree = 0;
                lastyear = 0;
                previousyear = 0;
                l = 0;
                var debug = "";
                
                for (var j = 0; j < prev; j++) {
                    total *= .95;
                    m = list[i].value[CurrentDate.getFullYear()];
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
                    }else{
                        total*=.8;
                    }

                    if (j >= prev - 3) {
                        lastthree += m;
                    } else if (j >= prev - 6) {
                        previousthree += m;
                    }
                    if (j >= prev - 12) {
                        lastyear += m;
                    } else if (j >= prev - 24) {
                        previousyear += m;
                    }
                    //log.error("diff", i+" "+diff+" "+total);
                    l = m;
                    CurrentDate.setMonth(CurrentDate.getMonth() + 1);
                }
                var monthlyp;
                if (previousthree == 0) {
                    monthlyp = 0;
                } else {
                    monthlyp = Math.round(((lastthree - previousthree) / previousthree) * 100 * 100) / 100;
                }
                var yearlyp;
                if (previousyear == 0) {
                    yearlyp = 0;
                } else {
                    yearlyp = Math.round(((lastyear - previousyear) / previousyear) * 100 * 100) / 100
                }

                //var statusp = (monthlyp + yearlyp) / 2;
                if (lastyear == 0) {
                    sublist.setSublistValue({
                        id: 'custpage_cat_status',
                        line: i,
                        value: "Declined"
                    });
                } else if (lastthree > 0 && lastthree == lastyear) {
                    sublist.setSublistValue({
                        id: 'custpage_cat_status',
                        line: i,
                        value: "New"
                    });
                } else if (total < -30) {
                    sublist.setSublistValue({
                        id: 'custpage_cat_status',
                        line: i,
                        value: "Declining"
                    });
                } else if (total > 30) {
                    sublist.setSublistValue({
                        id: 'custpage_cat_status',
                        line: i,
                        value: "Growing"
                    });
                } else {
                    sublist.setSublistValue({
                        id: 'custpage_cat_status',
                        line: i,
                        value: "Stable"
                    });
                }


                sublist.setSublistValue({
                    id: 'custpage_cat_trend',
                    line: i,
                    value: total.toFixed(2)
                });
                sublist.setSublistValue({
                    id: 'custpage_cat_monthchange',
                    line: i,
                    value: (((lastthree - previousthree) / previousthree) * 100).toFixed(2).replace("NaN", "0") + "%"
                });
                sublist.setSublistValue({
                    id: 'custpage_cat_yearchange',
                    line: i,
                    value: (((lastyear - previousyear) / previousyear) * 100).toFixed(2).replace("NaN", "0") + "%"
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
                var colors = ['207,140,96', '140,96, 207', '96, 207, 140'];
                var y;
                for (var i = 0; i < 3; i++) {
                    y = year - 2 + i;
                    if (values[y]) {
                        chartdata.data.datasets.push({
                            label: title + " " + y,
                            data: values[y],
                            backgroundColor: 'rgba(' + colors[i] + ', 0.5)',
                            borderColor: 'rgba(' + colors[i] + ', 1)',
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