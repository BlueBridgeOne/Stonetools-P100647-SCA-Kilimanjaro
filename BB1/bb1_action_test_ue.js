/**
 * Project :
 * 
 * Description : Testing actions.
 * 
 * @Author : Gordon Truslove
 * @Date   : 6/12/2019, 12:45:28 PM
 * 
 * Copyright (c) 2017 BlueBridge One Business Solutions, All Rights Reserved
 * support@bluebridgeone.com, +44 (0)1932 300007
 * 
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/action'],

    function (record, search, action) {

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

            var currentRecord = scriptContext.newRecord;


            var actions = action.find({
                recordType: currentRecord.type,
                recordId: currentRecord.id
            });

            log.debug("actions", currentRecord.type + " " + currentRecord.id + " " + JSON.stringify(actions));

            var recordObj = record.load({
                type: currentRecord.type,
                id: currentRecord.id,
                isDynamic: true
            });

            var macros = recordObj.getMacros();
            log.debug("macros", currentRecord.type + " " + currentRecord.id + " " + JSON.stringify(macros));

        }


        return {
            beforeLoad: beforeLoad
        };

    });