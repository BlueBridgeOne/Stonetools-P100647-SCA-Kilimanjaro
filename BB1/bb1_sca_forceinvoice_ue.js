/**
 * Project : P100647
 * 
 * Description : Sometimes SCA sets the payment method but not the payment details. So clear that payment method and force invoices.
 * 
 * When creating a new SO, make sure the terms are copied through from the customer. If invoice then remove payment.
 * 
 * @Author : Gordon Truslove
 * @Date   : 10/24/2018, 10:18:28 PM
 * 
 * Copyright (c) 2017 BlueBridge One Business Solutions, All Rights Reserved
 * support@bluebridgeone.com, +44 (0)1932 300007
 * 
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search'],

    function (record, search) {

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

            // var currentRecord = scriptContext.newRecord;

            // if (scriptContext.type == "create") {
            //     try {
            //         log.debug("Before", "test " + currentRecord);

            //         var entity = currentRecord.getValue({
            //             fieldId: 'entity'
            //         });
            //         var terms = currentRecord.getValue({
            //             fieldId: 'terms'
            //         });
            //         if (terms) {
            //             log.debug("Before", "entity " + entity+" "+terms);
            //             currentRecord.setValue({
            //                 fieldId: 'paymentmethod',
            //                 value: null,
            //                 ignoreFieldChange: true
            //             });
            //             scriptContext.form 
            //             // var fieldLookUp = search.lookupFields({
            //             //     type: search.Type.ENTITY,
            //             //     id: entity,
            //             //     columns: ['terms']
            //             // });
            //             // log.debug("Before", "terms " + terms+" "+JSON.stringify(fieldLookUp));
            //         }
            //     } catch (err) {
            //         log.error("Failed", err);
            //     }
            // }
        }

        function beforeSubmit(scriptContext) {

            if (scriptContext.type == scriptContext.UserEventType.DELETE) return;
            try {
                var currentRecord = scriptContext.newRecord;
                var paymentmethod = currentRecord.getValue({
                    fieldId: 'paymentmethod'
                });
                var ccnumber = currentRecord.getValue({
                    fieldId: 'ccnumber'
                });
                //log.debug("Check","paymentmethod="+paymentmethod+" ccnumber="+ccnumber);
                if ((paymentmethod > 0 && paymentmethod < 12) && !ccnumber) {
                    log.debug("Fix", "Payment method but no cc number.");

                    currentRecord.setValue({
                        fieldId: 'paymentmethod',
                        value: null,
                        ignoreFieldChange: true
                    });

                }
            } catch (err) {
                log.error("Failed", err);
            }

        }

        return {
            beforeSubmit: beforeSubmit,
            beforeLoad: beforeLoad
        };

    });