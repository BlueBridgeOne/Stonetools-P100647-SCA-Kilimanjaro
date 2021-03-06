define('RegisterCAA.Model', [
  'Models.Init',
  'SC.Model',
  'Utils',
  'Tools'
], function (
  CommerceAPI,
  SCModel,
  Utils,
  Tools
) {

  'use strict';

  return SCModel.extend({

    name: 'RegisterCAA',

    createContacts: function(data, leadID){

      nlapiLogExecution("DEBUG", "createContacts", JSON.stringify(data));

      var directorsIDs = [];
      var authorisedPurchasersIDs = [];
      var accountsReceivableContactID = [];
      var tradeReferencesIDs = [];
      var soletradersIDs = [];

      //company directors
      if(data.director_firstname){
        for(var i = 0; i < data.director_firstname.length; i++){
          directorsIDs.push(this.contactDetails(data.director_firstname[i], data.director_lastname[i], data.generalemailaddress, leadID, 'Company Director'));
        }
      }

      //authorised purchasers
      if(data.authorisedpurchasers_firstname){
        for(var i = 0; i < data.authorisedpurchasers_firstname.length; i++){
          var email = Array.isArray(data.authorisedpurchasers_email) ? data.authorisedpurchasers_email[i] : data.authorisedpurchasers_email;
          authorisedPurchasersIDs.push(this.contactDetails(data.authorisedpurchasers_firstname[i], data.authorisedpurchasers_lastname[i], email, leadID, 'Authorised Purchaser'));
        }
      }

      //accounts receivable contacts
      if(data.arcd_firstname){
        accountsReceivableContactID.push(this.contactDetails(data.arcd_firstname, data.arcd_lastname, data.arcd_email, leadID, 'Accounts Receivable Contact', data.arcd_phone, data.arcd_po, data.arcd_billing_address, false));
      }

      //trade references
      if(data.tr_firstname){
        for(var i = 0; i < data.tr_firstname.length; i++){
          tradeReferencesIDs.push(this.contactDetails(data.tr_firstname[i], data.tr_lastname[i], false, leadID, 'Trade Reference', data.tr_phone[i], false, false, data.tr_businessname[i]));
        }
      }

      //sole traders or partners
      if(data.soletrader_firstname){
        for(var i = 0; i < data.soletrader_firstname.length; i++){
          var dob = Array.isArray(data.soletrader_dob) ? data.soletrader_dob[i] : data.soletrader_dob;
          var addr1 = Array.isArray(data.soletraderaddress_addr1) ? data.soletraderaddress_addr1[i] : data.soletraderaddress_addr1;
          var city = Array.isArray(data.soletraderaddress_city) ? data.soletraderaddress_city[i] : data.soletraderaddress_city;
          var countries = Array.isArray(data.soletraderaddress_countries) ? data.soletraderaddress_countries[i] : data.soletraderaddress_countries;
          var state = Array.isArray(data.soletraderaddress_state) ? data.soletraderaddress_state[i] : data.soletraderaddress_state;
          var zip = Array.isArray(data.soletraderaddress_zip) ? data.soletraderaddress_zip[i] : data.soletraderaddress_zip;

          soletradersIDs.push(this.contactDetails(data.soletrader_firstname[i], data.soletrader_lastname[i], false, leadID, 'Sole Trader or Partner', false, false, false, false, dob, addr1, city, countries, state, zip));
        }
      }

      return {
        'directorsIDs' : directorsIDs,
        'authorisedPurchasersIDs' : authorisedPurchasersIDs,
        'accountsReceivableContactID' : accountsReceivableContactID,
        'tradeReferencesIDs' : tradeReferencesIDs,
        'soletradersIDs' : soletradersIDs
      }

    },

    contactDetails: function(firstname, lastname, email, leadID, title, phone, po, ba, businessname, dob, addr1, city, countries, state, zip){

      nlapiLogExecution("DEBUG", "contactDetails", firstname + ' | ' + lastname + ' | ' + email + ' | ' + leadID + ' | ' + 
                                                    title + ' | ' + phone + ' | ' + po + ' | ' + businessname + ' | ' + dob + ' | ' + 
                                                    addr1 + ' | ' + city + ' | ' + countries + ' | ' + state + ' | ' + zip);

      var contactID;
      var contact = nlapiCreateRecord('contact');

      if(firstname){contact.setFieldValue("firstname", firstname)};
      if(lastname){contact.setFieldValue("lastname", lastname)};
      if(email){contact.setFieldValue("email", email)};
      if(leadID){contact.setFieldValue("company", leadID)};
      if(title){contact.setFieldValue("title", title)};
      if(phone){contact.setFieldValue("phone", phone)};
      if(po && po == 'true'){contact.setFieldValue("custentity_bb1_sca_purchaseorderno", 'T')};
      if(ba && ba == 'true'){contact.setFieldValue("custentity_bb1_sca_receivebypost", 'T')};
      if(businessname){contact.setFieldValue("custentity_bb1_sca_businessname", businessname)};

      if(dob){contact.setFieldValue("custentity_bb1_sca_stp_dob", dob)};
      if(addr1){contact.setFieldValue("custentity_bb1_sca_stp_addr1", addr1)};
      if(city){contact.setFieldValue("custentity_bb1_sca_stp_city", city)};
      if(countries){contact.setFieldValue("custentity_bb1_sca_stp_countries", countries)};
      if(state){contact.setFieldValue("custentity_bb1_sca_stp_state", state)};
      if(zip){contact.setFieldValue("custentity_bb1_sca_stp_zip", zip)};

      contactID = nlapiSubmitRecord(contact, true,true);
      return contactID;
    },

    createLead: function (data) {
      var companyaddress, billingaddress, shippingaddress, lead, leadID;

      if(!data.company){
        data.company = data.tradingname;
      }

      //Company and contact
      var customerSearch = nlapiSearchRecord("entity", null, [
        ["entityid", "is", data.company], 'OR', ["email", "is", data.generalemailaddress]
      ], [
        new nlobjSearchColumn("entityid", null, null),
        new nlobjSearchColumn("email", null, null)
      ]);

      for (var i = 0; customerSearch != null && i < customerSearch.length; i++) {
        var res = customerSearch[i];
        if (res.recordType != "contact") {
          leadID = res.getId();
          break;
        }
      }

      if (!leadID) {
        //Create new company
        lead = nlapiCreateRecord('lead');

        if(data.company){
          lead.setFieldValue("companyname", data.company);
        }

        if(data.companytype){
          lead.setFieldValue("custentity_bb1_sca_companytype", data.companytype);
        }
        
        if (data.tradingname) {
          lead.setFieldValue("custentity_bb1_sca_tradingname", data.tradingname);
        }

        //Addresses
        if (data.primaryaddress_addr1) {
          companyaddress = lead.getLineItemCount("addressbook") + 1;
          lead.setLineItemValue("addressbook", "addressee", companyaddress, data.company);
          lead.setLineItemValue("addressbook", "addr1", companyaddress, data.primaryaddress_addr1);
          lead.setLineItemValue("addressbook", "city", companyaddress, data.primaryaddress_city);
          lead.setLineItemValue("addressbook", "state", companyaddress, Array.isArray(data.state) ? data.state[0] : data.state );
          lead.setLineItemValue("addressbook", "country", companyaddress, data.country[0]);
          lead.setLineItemValue("addressbook", "zip", companyaddress, data.primaryaddress_zip);
        }

        if (data.billingaddress_checkbox == 'true') {
          billingaddress = (++companyaddress);
          lead.setLineItemValue("addressbook", "addressee", billingaddress, data.company);
          lead.setLineItemValue("addressbook", "addr1", billingaddress, data.billingaddress_addr1);
          lead.setLineItemValue("addressbook", "city", billingaddress, data.billingaddress_city);
          lead.setLineItemValue("addressbook", "state", billingaddress, data.state[1]);
          lead.setLineItemValue("addressbook", "country", billingaddress, data.country[1]);
          lead.setLineItemValue("addressbook", "zip", billingaddress, data.billingaddress_zip);
          lead.setLineItemValue("addressbook", "defaultbilling", billingaddress, "T");
        }

        if (data.shippingaddress_checkbox == 'true') {
          shippingaddress = (billingaddress) ? (++billingaddress) : (++companyaddress);
          lead.setLineItemValue("addressbook", "addressee", shippingaddress, data.company);
          lead.setLineItemValue("addressbook", "addr1", shippingaddress, data.shippingaddress_addr1);
          lead.setLineItemValue("addressbook", "city", shippingaddress, data.shippingaddress_city);
          lead.setLineItemValue("addressbook", "state", shippingaddress, data.state[2]);
          lead.setLineItemValue("addressbook", "country", shippingaddress, data.country[2]);
          lead.setLineItemValue("addressbook", "zip", shippingaddress, data.shippingaddress_zip);
          lead.setLineItemValue("addressbook", "defaultshipping", shippingaddress, "T");
        }

        lead.setFieldValue("custentity_bb1_sca_registrationnumber", data.registrationnumber);
        lead.setFieldValue("custentity_bb1_comp_reg_no", data.registrationnumber);
        lead.setFieldValue("vatregnumber", data.vatnumber);
        lead.setFieldValue("phone", data.phone);
        lead.setFieldValue("email", data.generalemailaddress);
        lead.setFieldValue("custentity_bb1_gen_email_add", data.generalemailaddress);

        if (data.companywebsite) {
          lead.setFieldValue("custentity_bb1_sca_companywebsite", data.companywebsite);
          lead.setFieldValue("url", data.companywebsite);
        }

        leadID = nlapiSubmitRecord(lead, true,true);

        return leadID;
      }
    },

    sendEmailNotification: function(leadID, data, notify, regionText){

        nlapiLogExecution("DEBUG", "lead ID", leadID);
        nlapiLogExecution("DEBUG", "data", JSON.stringify(data));
        nlapiLogExecution("DEBUG", "notify", JSON.stringify(notify));
        nlapiLogExecution("DEBUG", "regionText", JSON.stringify(regionText));

        var params = [{
          name: "Name",
          value: data.confirmation_firstname + " " + data.confirmation_lastname
        }, {
          name: "Company",
          value: data.company
        }, {
          name: "E-Mail",
          value: data.generalemailaddress,
          href: "mailto:" + data.generalemailaddress + "?subject=re: " + data.title
        }, {
          name: "Sales Region",
          value: regionText
        }, {
          name: "Host",
          value: data.host,
          href: "https://" + data.host
        }];


        if (leadID) {
          params.push({
            name: "Customer",
            value: "View in NetSuite",
            href: "https://system.eu2.netsuite.com" + nlapiResolveURL('RECORD', 'customer', leadID)
          });
        }

        //(from, to, title, subject, message, params, reply, attachments)
        Tools.emailAlert(
          69397, //from
          notify, //to
          "Trade Registration", //title
          "Please create a trade account for " + data.company + ".", //subject
          this.meesageText(data), //message
          params //params
        );
    },

    meesageText: function(data, textOnly){
      var htmlMeesage = 
        "<p><span style=\"color:#888;\">Company:</span> " + data.company + "</p>" + 
        "<p>Credit Account Application Details:</p>" +
        "<span style=\"text-decoration:underline; \">Requested Credit Limit:</span>" +
        "<p>&pound; " + data.requested_credit + "</p>" +
        "<p><span style=\"text-decoration:underline; \">Confirmation Agreement:</span></p>" +
        "<p><span style=\"color:#888;\">Name:</span> " + data.confirmation_firstname + " " + data.confirmation_lastname + "</p>" +
        "<p><span style=\"color:#888;\">Title:</span> " + data.confirmation_title + "</p>" +
        "<p><span style=\"color:#888;\">Email:</span> " + data.confirmation_email + "</p>" +
        "<p><span style=\"color:#888;\">Date:</span> " + data.confirmation_date + "</p>";
      
      var textMeesage = 
        "Please create a Credit Account for: \n\n"+ data.company +". \n\n" + 
        "The requested credit limit is \n\n £"+ data.requested_credit +" \n\n" +
        "Confirmation Agreement Details: \n\n" +
        "Name: "+ data.confirmation_firstname + " " + data.confirmation_lastname +" \n" +
        "Title: "+ data.confirmation_title +" \n" +
        "Email: "+ data.confirmation_email +" \n" +
        "Date: "+ data.confirmation_date +" \n";

      if(textOnly){
        return textMeesage;
      }else{
        return htmlMeesage;
      }
    },

    createCase: function(data, leadID, caseconfiguration){

        nlapiLogExecution("DEBUG", "createCase", JSON.stringify(data));
        nlapiLogExecution("DEBUG", "createCase", leadID);
        nlapiLogExecution("DEBUG", "createCase", JSON.stringify(caseconfiguration));

        //setup new case
        newCaseRecord = nlapiCreateRecord('supportcase');
        newCaseRecord.setFieldValue('title', "Credit Account Application | " + data.host);
        newCaseRecord.setFieldValue('incomingmessage', this.meesageText(data, true));
        newCaseRecord.setFieldValue('generalemailaddress', data.generalemailaddress);
        newCaseRecord.setFieldValue('company', leadID);

        if (data.phone) {
          newCaseRecord.setFieldValue('phone', data.phone);
        }

        newCaseRecord.setFieldValue('status', caseconfiguration.defaultValues.statusStart.id); // Not Started
        newCaseRecord.setFieldValue('origin', caseconfiguration.defaultValues.origin.id); // Web

        //submit / create the case in NS...
        caseID = nlapiSubmitRecord(newCaseRecord,true,true);
    },

    create: function (data) {

      try {

        this.validate(data);

        var configuration, currentDomain, request, url;
        var caseconfiguration;
        var notify = configuration.notify /*'deeps@mailinator.com'*/;
        var region = 1, regionText = "UK"; //CUSTOM REGION custentity_bb1_sales_region: 1 UK, 2 France, 3 Ireland
        var newCaseRecord;
        var caseID;
        var reply;
        
        configuration = SC.Configuration && SC.Configuration.contactUs;
        caseconfiguration = SC.Configuration && SC.Configuration.cases;
        currentDomain = data.host;
        data.generalemailaddress = data.generalemailaddress.toLowerCase();

        if (CommerceAPI.context.getFeature('SUBSIDIARIES')) {
          data.subsidiary = CommerceAPI.session.getShopperSubsidiary();
        }

        switch (data.host) {
          case "stonetools-fr.bluebridgeone.com":
          case "www.stonetools.fr":
          case "stonetools.fr":
            region = 2;
            regionText = "France"
          case "stonetools-ie.bluebridgeone.com":
          case "www.stonetools.ie":
          case "stonetools.ie":
            region = 3;
            regionText = "Ireland"
        }

        if (configuration.usecompanies && data.company || data.companytype ) {
     
          var leadID = this.createLead(data);

          var contactsIDs = this.createContacts(data, leadID);

          if(leadID){
            this.createCase(data, leadID, caseconfiguration);
            this.sendEmailNotification(leadID, data, notify, regionText);
          }
        } 
        
        return {
          successMessage: 'Thanks for contacting us. Your request for a trade account has been received. We will review your details get back to you shortly.'
        };


      } catch (e) {

        nlapiLogExecution("ERROR", "Register CAA Error", JSON.stringify(e));

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