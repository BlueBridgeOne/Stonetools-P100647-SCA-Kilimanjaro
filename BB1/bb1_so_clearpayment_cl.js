/**
 * Description : Setting the terms in the UI should clear the payment method.
 * Also if entity is set then pull the terms in.
 * 
 * @Author : Gordon Truslove
 * @Date   : 6/24/2019, 11:30:20 AM
 * 
 * Copyright (c) 2017 BlueBridge One Business Solutions, All Rights Reserved
 * support@bluebridgeone.com, +44 (0)1932 300007
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

define(['N/record', 'N/search'],
    /**
     * @param {record} record
     */
    function (record, search) {

        /**
         * Function to be executed after page is initialized.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
         *
         * @since 2015.2
         */
        function pageInit(scriptContext) { //Set an initial value for the swatch.
            checkTerms(scriptContext);
            checkPaymentMethod(scriptContext);
            checkTerms(scriptContext);
        }

        /**
         * Function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @since 2015.2
         */
        function fieldChanged(scriptContext) {

            if (scriptContext.fieldId == "terms" || scriptContext.fieldId == "paymentmethod") {
                checkPaymentMethod(scriptContext);
            }
            else if (scriptContext.fieldId == "entity") {
                checkTerms(scriptContext);

            }

        }

        function checkPaymentMethod(scriptContext){
            var terms = parseInt(scriptContext.currentRecord.getValue("terms"));
            var paymentmethod = parseInt(scriptContext.currentRecord.getValue("paymentmethod"));

            if (terms > 0 && paymentmethod > 0) {
                scriptContext.currentRecord.setValue({
                    fieldId: 'paymentmethod',
                    value: "",
                    ignoreFieldChange: true
                });
            }
        }
        function checkTerms(scriptContext){
            var entity = parseInt(scriptContext.currentRecord.getValue("entity"));
                if (entity) {
                    var fieldLookUp;
                    try {
                        fieldLookUp = search.lookupFields({
                            type: 'customer',
                            id: entity,
                            columns: ['terms']
                        });
                    } catch (err) {
                        fieldLookUp = search.lookupFields({
                            type: 'lead',
                            id: entity,
                            columns: ['terms']
                        });
                    }
                    //log.debug("fieldLookUp", "fieldLookUp=" + JSON.stringify(fieldLookUp));
                    if (fieldLookUp && fieldLookUp.terms.length > 0) {
                        scriptContext.currentRecord.setValue({
                            fieldId: 'terms',
                            value: fieldLookUp.terms[0].value,
                            ignoreFieldChange: true
                        });
                    }
                }
        }

        return {
            fieldChanged: fieldChanged,
            pageInit: pageInit
        };

    });