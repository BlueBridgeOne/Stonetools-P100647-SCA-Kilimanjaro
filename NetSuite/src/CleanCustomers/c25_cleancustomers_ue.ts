/**
 * Description : Don't allow spam customer records to save.
 * 
 * @Author : Gordon Truslove - code25.com
 * @Date   : 2/9/2022, 7:15:11 PM
 * 
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
/// <reference path="../suitescript.ts" />

define(['N/record', 'N/search'],

function(record:iRecord, search:iSearch) {

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function beforeSubmit(scriptContext:iContext) {
    
       	if (scriptContext.type == "delete") return;
    	
    	let currentRecord:iDataRecord = scriptContext.newRecord;
    	let billaddr1:string = currentRecord.getValue('billaddr1');
        if(billaddr1=="506 Boulevard Apt A"){
            throw(new Error("This record looks like spam and cannot be saved."));
        }

    }

    return {
        beforeSubmit: beforeSubmit
    };
    
});

