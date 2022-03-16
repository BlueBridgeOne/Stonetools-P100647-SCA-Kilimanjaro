/*
*	Author: Viktor Schumann / wiksch@gmail.com
*	Date: 09/07/2019
*   BB1_VS_addr_county_chk_ss20.js
* 	Check city - state pairs in addresses
	
*	
*/

/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
**/

define(['N/record', 'N/search', 'N/email', 'N/render', 'N/format', 'N/runtime', 'N/task'],
    /**
     * @param {record} record
     * @param {search} search
     */

    function (record, search, email, render, format, runtime, task) {

        /**
          * @param {Object} scriptContext
          * @param {string} scriptContext.type
          * @Since 2018.2
          */

        // #region CHECK ENTITY STATE FIELD VARIABLES

        var entityResultSet;
        var entityResult;
        var city;
        var state;
        var validState;
        var processedRecords;

        // #endregion

        //**************** Execute **************

        function execute(scriptContext) {
            try {
                log.debug("BB1_VS_addr_county_chk::execute", "Started");

                entityStateValidation();

                logGovernanceMonitoring("EndProcess");
            }
            catch (e) {
                log.debug("Error", 'Message: ' + e);
            }
            finally {
            }

        }
        
        // #region CHECK STATE

        function entityStateValidation() {

            processedRecords = runtime.getCurrentScript().getParameter({ name: "custscript_state_valid_processed_records" });

            //Get all the entities we have to check
            findEntitesToCheck();

            //Foreach on every single entity
            for (var rs in entityResultSet) {

                processedRecords++;

                entityResult = rs;
                city = entityResultSet[entityResult].getValue({ name: "city", join: "Address" });
                state = entityResultSet[entityResult].getValue({ name: "state", join: "Address" });

                //Try to find a valid state for the entity's city
                findValidState();

                updateAddress();

                if (runtime.getCurrentScript().getRemainingUsage() < 100) {
                    break;
                }

                //Reschedule if neccessary
                //if (reschedule(150)) {
                //    break;
                //}
            }  
        }

        function findEntitesToCheck() {

            var entitySearchObj = search.create({
                type: "entity",
                filters: [
                    ["address.custrecord_bb1_address_county_checked", "is", "F"],
                    "AND",
                    ["type", "anyof", "Contact", "CustJob"],
                    "AND",
                    ["address.country", "anyof", "GB"],  //["address.country", "anyof", "US"],
                    "AND",
                    ["email","isnotempty",""] // see also #row166
                  	//"AND",
                    //[
                        //["address.city", "is", "London"],
                        //"OR",
                        //["address.city", "is", "Manchester"]
                    //]
                ],
                columns:
                    [
                        search.createColumn({ name: "entityid", sort: search.Sort.ASC, label: "Name" }),
                        search.createColumn({ name: "type", label: "Primary Type (Deprecated)" }),
                        search.createColumn({ name: "city", join: "Address", label: "City" }),
                        search.createColumn({ name: "state", join: "Address", label: "State/Province" }),
                        search.createColumn({ name: "statedisplayname", join: "Address", label: "State/Province Display Name" }),
                        search.createColumn({ name: "internalid", label: "Internal ID" }),
                        search.createColumn({ name: "internalid", join: "Address", label: "Address ID" })
                    ]
            });
            entityResultSet = entitySearchObj.run().getRange(0, 900);
        }

        function findValidState() {

            validState = "";

            if (!city || city.length == 0) {
                return;
            }

            var validCityStatePairsObj = search.create({
                type: "customrecord_bb1_vs_valid_city_st_pairs",
                filters:
                    [
                        //Name is contains city also. This is a primary key columnn, so search is faster on it (it gives back only one record automatically).
                        ["name", "is", city] 
                    ],
                columns:
                    [
                        search.createColumn({ name: "custrecord_bb1_vs_vcsp_city", label: "City" }),
                        search.createColumn({ name: "custrecord_bb1_vs_vcsp_state", label: "State" })
                    ]
            });

            //Get state from the first record
            validCityStatePairsObj.run().each(function (referenceResult) {

                validState = referenceResult.getValue({ name: "custrecord_bb1_vs_vcsp_state" });
                return;
            });
        }

        function updateAddress() {

            var entityType = String(entityResultSet[entityResult].getText({ name: "type" }));
            var id = entityResultSet[entityResult].getText({ name: "internalid" });
            var addressId = entityResultSet[entityResult].getText({ name: "internalid", join: "Address" });
          
            var entityToUpdate = record.load({ type: entityType, id: id, isDynamic: false }); // ***** Load Entity ******
          	var email = entityToUpdate.getValue({fieldId: 'email'});
          	log.debug("",JSON.stringify(entityToUpdate));
          
      		if(!email){ // #row166, filtered in saved search too. But this created earlier and left for safety if anybody killed the SS criteria.
              log.debug(""," Email is empty. Update skipped.");
              return true;
            }
          
            var numLines = entityToUpdate.getLineCount({ sublistId: 'addressbook' });
            var i;

            for (i = 0; i < numLines; i++) {

                var subrec = entityToUpdate.getSublistSubrecord({ sublistId: 'addressbook', fieldId: 'addressbookaddress', line: i });
                var internalId = subrec.getValue({ fieldId: 'id' });

                if (addressId == internalId) {

                    //Set this record to checked state
                    subrec.setValue({ fieldId: "custrecord_bb1_address_county_checked", value: true });

                    if (validState.length > 0) {

                        //Set valid state value if it was an incorrect (temporarily in a disctinct field while testing...)
                        if (state != validState) {
                            //log.debug("BB1_VS_addr_county_chk::updateAddress", "#" + processedRecords + " State mismatch! City= " + city + "; State= " + state + "; Reference State= " + validState + " AddressId: " + addressId + " EntityType: " + entityType + " Internalid: " + JSON.stringify(entityResultSet[entityResult].getValue({ name: "internalid" })));
                            subrec.setValue({ fieldId: "custrecord_bb1_address_corrected_state", value: validState });
                        }
                    }
                    else {
                        //If entity's address's city was not recognized as a valid Netsuite state lets sign it in Address.Error field
                        //log.debug("BB1_VS_addr_county_chk::updateAddress", "#" + processedRecords + " Unidentified town or city! City= " + city + "; State= " + state + "; Reference State= " + validState + " AddressId: " + addressId + " EntityType: " + entityType + " Internalid: " + JSON.stringify(entityResultSet[entityResult].getValue({ name: "internalid" })));
                        subrec.setValue({ fieldId: "custrecord_bb1_address_error", value: "Unidentified town or city" });
                    }

                    entityToUpdate.save({ enableSourcing: false, ignoreMandatoryFields: true });

                    break;
                }
            }

            return false;
        }     

        // #endregion

        // #region GOVERNANCE MONITORING

        function logGovernanceMonitoring(caller) {
            var script = runtime.getCurrentScript();
            log.debug("BB1_VS_addr_county_chk::logGovernanceMonitoring", caller + " - Remaining Usage = " + script.getRemainingUsage());
        }

        // #endregion
                
        // #region RESCHEDULE SCRIPT

        function reschedule(rescheduleGovernanceUsageLimit) {

            if (runtime.getCurrentScript().getRemainingUsage() > rescheduleGovernanceUsageLimit) {
                return false;
            }

            log.debug("BB1_VS_addr_county_chk::reschedule", "BB1_VS_addr_county_chk must be rescheduled!");

            var scheduledScriptTask = task.create({
                taskType: task.TaskType.SCHEDULED_SCRIPT,
                params: { custscript_state_valid_processed_records: processedRecords }
            });
            scheduledScriptTask.scriptId = "customscript_bb1_vs_addr_county_chk_ss20";
            scheduledScriptTask.deploymentId = "customdeploy_bb1_vs_addr_county_chk_ss20";
            scheduledScriptTask.submit();

            return true;
        }

        // #endregion

        return {
            execute: execute
        };

    });