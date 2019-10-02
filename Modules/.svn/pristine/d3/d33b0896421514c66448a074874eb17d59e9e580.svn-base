/*===========================================

  BB1 - G Truslove

  Date: Jun 2019

  ===========================================*/

define('GDPRNewsletter.Model', [
    'Models.Init', 'SC.Model', 'Utils', 'Tools'
], function (
    CommerceAPI, SCModel, Utils, Tools
) {

    'use strict';

    return SCModel.extend({

        name: 'GDPRNewsletter'

            ,
        validation: {
            email: [{
                required: true,
                msg: 'Please enter an email address'
            }]
        }

        ,
        create: function (data) {
            try {
                nlapiLogExecution("DEBUG", "SCA Testing", "Newsletter=" + JSON.stringify(data));

                // Validate! Validate! Validate!
                this.validate(data);

                // Create a bunch of useful variables
                var configuration, currentDomain, request, url;

                // Get the config options for the functionality
                configuration = SC.Configuration && SC.Configuration.GDPRNewsletter;

                currentDomain = data.host;

                var notify = configuration.notify ;

                nlapiLogExecution("DEBUG", "SCA Testing", "LINE 47");

                // Include subsidiary data, if relevant
                if (CommerceAPI.context.getFeature('SUBSIDIARIES')) {
                    data.subsidiary = CommerceAPI.session.getShopperSubsidiary();
                }
                data.email = data.email.toLowerCase();

                var contactID;
                var leadID, globalsubscriptionstatus;

                nlapiLogExecution("DEBUG", "SCA Testing", "LINE 58");

                if (configuration.usecompanies && data.company && data.company.length > 0) {

                    //Company and contact

                    nlapiLogExecution("DEBUG", "SCA Testing", "LINE 64");

                    var customerSearch = nlapiSearchRecord("entity", null, [
                        ["entityid", "is", data.company], 'OR', ["email", "is", data.email]
                    ], [
                        new nlobjSearchColumn("entityid", null, null),
                        new nlobjSearchColumn("email", null, null),
                        new nlobjSearchColumn("globalsubscriptionstatus", null, null)
                    ]);

                    for (var i = 0; customerSearch != null && i < customerSearch.length; i++) {
                        var res = customerSearch[i];
                        leadID = res.getId();
                        break;
                    }

                    nlapiLogExecution("DEBUG", "SCA Testing", "LINE 80");

                    if (!leadID) { //Create new company
                        var lead = nlapiCreateRecord('lead');
                        var emailSurvey = lead.getLineItemCount("subscriptions");
                        var emailInformation = lead.getLineItemCount("subscriptions") - 1;

                        lead.setFieldValue("email", data.email);
                        lead.setFieldValue("companyname", data.company);
                        //lead.setFieldValue('globalsubscriptionstatus', 1);

                        if (data.email_survey == 'true') {
                            lead.setLineItemValue("subscriptions", "subscribed", emailSurvey, "T");
                        }else{
                            lead.setLineItemValue("subscriptions", "subscribed", emailSurvey, "F");
                        }

                        if (data.email_information == 'true') {
                            lead.setLineItemValue("subscriptions", "subscribed", emailInformation, "T");
                        }else{
                            lead.setLineItemValue("subscriptions", "subscribed", emailInformation, "F");
                        }

                        if(data.email_survey == 'true' || data.email_information == 'true'){
                            lead.setFieldValue('globalsubscriptionstatus', 1);
                        }else{
                            lead.setFieldValue('globalsubscriptionstatus', 2);
                        }


                        leadID = nlapiSubmitRecord(lead, true,true);

                        nlapiLogExecution("DEBUG", "SCA Testing", "LINE 90");
                    }

                    nlapiLogExecution("DEBUG", "SCA Testing", "LINE 94");

                    var contactSearch = nlapiSearchRecord("contact", null, [
                        ["company", "is", leadID], 'AND', ["email", "is", data.email]
                    ], [
                        new nlobjSearchColumn("entityid", null, null),
                        new nlobjSearchColumn("email", null, null),
                        new nlobjSearchColumn("globalsubscriptionstatus", null, null)
                    ]);

                    for (var i = 0; contactSearch != null && i < contactSearch.length; i++) {
                        var res = contactSearch[i];
                        contactID = res.getId();
                        globalsubscriptionstatus = res.getValue("globalsubscriptionstatus");
                        break;
                    }

                    nlapiLogExecution("DEBUG", "SCA Testing", "LINE 110");


                    if (!contactID) { //create a new contact
                        var contact = nlapiCreateRecord('contact');
                        contact.setFieldValue("email", data.email);
                        contact.setFieldValue("firstname", data.firstname);
                        contact.setFieldValue("lastname", data.lastname);
                        contact.setFieldValue("company", leadID);
                        contact.setFieldValue('globalsubscriptionstatus', 1);

                        if (data.email_information == 'true') {
                            subs = lead.getLineItemCount("subscriptions");
                            nlapiLogExecution('DEBUG', "SUBSCRIPTION ", subs);
                            //lead.setLineItemValue("subscriptions", "defaultbilling", subs, "T");
                        }


                        contactID = nlapiSubmitRecord(contact, true,true);

                        nlapiLogExecution("DEBUG", "SCA Testing", "LINE 121");

                    } else if (globalsubscriptionstatus == 2) {
                        nlapiSubmitField('contact', contactID, 'globalsubscriptionstatus', 1);

                        nlapiLogExecution("DEBUG", "SCA Testing", "LINE 126");
                    }

                } else {

                    nlapiLogExecution("DEBUG", "SCA Testing", "LINE 139");

                    //Individual

                    var customerSearch = nlapiSearchRecord("entity", null, [
                        ["email", "is", data.email]
                    ], [
                        new nlobjSearchColumn("entityid", null, null),
                        new nlobjSearchColumn("email", null, null),
                        new nlobjSearchColumn("globalsubscriptionstatus", null, null)
                    ]);

                    for (var i = 0; customerSearch != null && i < customerSearch.length; i++) {
                        var res = customerSearch[i];
                        leadID = res.getId();
                        globalsubscriptionstatus = res.getValue("globalsubscriptionstatus");
                        break;
                    }

                    nlapiLogExecution("DEBUG", "SCA Testing", "LINE 150");

                    if (!leadID) { //Create new lead
                        nlapiLogExecution("DEBUG", "SCA Testing", "LINE 156");

                        var lead = nlapiCreateRecord('lead');
                        var emailSurvey = lead.getLineItemCount("subscriptions");
                        var emailInformation = lead.getLineItemCount("subscriptions") - 1;

                        lead.setFieldValue("email", data.email);
                        lead.setFieldValue("firstname", data.firstname);
                        lead.setFieldValue("lastname", data.lastname);
                        lead.setFieldValue("isperson", "T");
                        //lead.setFieldValue('globalsubscriptionstatus', 1);

                        if (data.email_survey == 'true') {
                            lead.setLineItemValue("subscriptions", "subscribed", emailSurvey, "T");
                        }else{
                            lead.setLineItemValue("subscriptions", "subscribed", emailSurvey, "F");
                        }

                        if (data.email_information == 'true') {
                            lead.setLineItemValue("subscriptions", "subscribed", emailInformation, "T");
                        }else{
                            lead.setLineItemValue("subscriptions", "subscribed", emailInformation, "F");
                        }

                        if(data.email_survey == 'true' || data.email_information == 'true'){
                            lead.setFieldValue('globalsubscriptionstatus', 1);
                        }else{
                            lead.setFieldValue('globalsubscriptionstatus', 2);
                        }

                        nlapiLogExecution("DEBUG", "SCA Testing", "LINE 166");

                        if (data.company) {
                            lead.setFieldValue("companyname", data.company);

                            nlapiLogExecution("DEBUG", "SCA Testing", "LINE 171");
                        } else {
                            lead.setFieldValue("companyname", "unknown");

                            nlapiLogExecution("DEBUG", "SCA Testing", "LINE 175");
                        }
                        var autonumbering = false; //Customer autonumbering is on in account.

                        if (autonumbering) {

                            nlapiLogExecution("DEBUG", "SCA Testing", "LINE 181");

                            leadID = nlapiSubmitRecord(lead, true,true);
                        } else {
                            lead.setFieldValue("entityid", data.firstname + " " + data.lastname);

                            nlapiLogExecution("DEBUG", "SCA Testing", "LINE 187");

                            var number = 1;
                            do { //Find a unique ID using trial and error
                                try {
                                    leadID = nlapiSubmitRecord(lead, true,true);

                                    nlapiLogExecution("DEBUG", "SCA Testing", "LINE 194");

                                } catch (err2) {
                                    if (err2.code == "UNIQUE_CUST_ID_REQD") {
                                        number++;
                                        lead.setFieldValue("entityid", data.firstname + " " + data.lastname + " " + number);

                                        nlapiLogExecution("DEBUG", "SCA Testing", "LINE 202");
                                    } else {
                                        throw (err2);

                                        nlapiLogExecution("DEBUG", "SCA Testing", "LINE 205");
                                    }

                                }

                            } while (!leadID);
                        }
                    } else if (globalsubscriptionstatus == 2) {
                        nlapiSubmitField('lead', leadID, 'globalsubscriptionstatus', 1);

                        nlapiLogExecution("DEBUG", "SCA Testing", "LINE 215");
                    }
                }



                nlapiLogExecution("DEBUG", "SCA Testing", "LINE 229");


                var params = [{
                    name: "Name",
                    value: data.firstname + " " + data.lastname
                }, {
                    name: "Company",
                    value: data.company
                }, {
                    name: "E-Mail",
                    value: data.email,
                    href: "mailto:" + data.email + "?subject=re: " + data.title
                }, {
                    name: "Host",
                    value: data.host,
                    href: "https://" + data.host
                }];


                

                var reply;
                if (leadID) {

                    params.push({
                        name: "Customer",
                        value: "View in NetSuite",
                        href: "https://system.eu2.netsuite.com" + nlapiResolveURL('RECORD', 'customer', leadID)
                    });

                    nlapiLogExecution("DEBUG", "SCA Testing", "LINE 260");
                }
                if (contactID) {
                    params.push({
                        name: "Contact",
                        value: "View in NetSuite",
                        href: "https://system.eu2.netsuite.com" + nlapiResolveURL('RECORD', 'contact', contactID)
                    });

                    nlapiLogExecution("DEBUG", "SCA Testing", "LINE 269");
                }

                //emailAlert(from, to, title, subject, message, params, reply,attachments)
                Tools.emailAlert(69397, notify, "Newsletter", data.title, data.incomingmessage, params, reply);

                return {
                    successMessage: 'Thank you for subscribing to our newsletter.'
                };


            } catch (e) {

                nlapiLogExecution("DEBUG", "SCA Testing", "LINE 280");

                nlapiLogExecution("ERROR", "Newsletter Error", JSON.stringify(e));
                // Finally, let's catch any other error that may come
                return {
                    status: 500,
                    code: 'ERR_FORM',
                    message: 'There was an error submitting the form, please try again later.',
                    stack: e.details || e.message || e
                }
            }
        }
    });
});