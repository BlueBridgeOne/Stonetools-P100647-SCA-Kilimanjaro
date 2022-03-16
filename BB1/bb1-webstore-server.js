//////////////////////////////////////////////////////////
// Globals
//////////////////////////////////////////////////////////

if (typeof SC.Configuration === 'undefined')
 SC.Configuration = {};

_.extend(SC.Configuration, {
 
 results_per_page: 20
 
});

//////////////////////////////////////////////////////////
// AJAX Server Pages
//////////////////////////////////////////////////////////

function BB1_SU_ProcessRestRequest(request, response) {

 try
	{
  var method = request.getMethod(),
      action = request.getParameter("action");

  switch (action) {
   
   case "contacts":
    var ContactManagement = Application.getModel('ContactManagement'),
        contact_id = request.getParameter('contact_id') || request.getParameter('internalid');
    
    switch (method)
    {
     case 'GET':
      Application.sendContent(ContactManagement.get(contact_id));
      break;
     case 'DELETE':
      Application.sendContent(ContactManagement.deleteUser(contact_id));
      break;
     case 'PUT':
     case 'POST':
      var data = JSON.parse(request.getBody() || '{}');
      
      if (data.internalid)
       Application.sendContent(ContactManagement.update(data));
      else
       Application.sendContent(ContactManagement.create(data));
      break;
     default: 
      Application.sendError(methodNotAllowedError);
    }
    break;
    
   case "primary-contact-status":
    var ContactManagement = Application.getModel('ContactManagement');
    
    switch (method)
    {
     case 'GET':
      Application.sendContent(ContactManagement.getPrimaryContactStatus());
      break;
     default: 
      Application.sendError(methodNotAllowedError);
    }
    break;
    
  }
	}
	catch (e)
	{
		Application.sendError(e);
	}
 
}

/**
 * Handles fetching and updating of customer contacts
 *
 */
Application.defineModel('ContactManagement', {

 validation: {
  firstname: { required: true, msg: 'First Name is required' },
  lastname: { required: true, msg: 'Last Name is required' },
  email: { required: true, pattern: 'email', msg: 'Email is required' }
 },

 generateRandomPassword: function ()
	{
		'use strict';
  
  var length = 16,
      charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*?><_+-=", //()~`|}{[]\:;,./",
      retVal = "";
      
  for (var i = 0, n = charset.length; i < length; ++i) {
   retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  
  return retVal;
 },
 
 isPrimaryContact: function (customerId, contactId)
	{
  var customer = nlapiLoadRecord("customer", customerId),
      isperson = customer.getFieldValue("isperson") == "T",
      numContacts = customer.getLineItemCount('contactroles'),
      contact = customer.getFieldValue("contact"), 
      isPrimaryContact = numContacts == 1 || (!isperson && contactId == 0) || contact == contactId;
  
  nlapiLogExecution("DEBUG", "customerId/contactId/isperson/numContacts/contact/isPrimaryContact", customerId + "/" + contactId + "/" + isperson + "/" + numContacts + "/" + contact + "/" + isPrimaryContact);
  
  return isPrimaryContact;
 },
 
 getPrimaryContactStatus: function ()
	{
		'use strict';

  var result = {success:true, isPrimaryContact: false};
  
  var context = nlapiGetContext();
  var customerId = nlapiGetUser();
  var contactId = context.getContact();
  var role = context.getRole();

  if (!customerId || customerId == '-4')
   return result;
  
  result.isPrimaryContact = this.isPrimaryContact(customerId, contactId);
  
  return result;
 },
 
 get: function (contact_id)
	{
		'use strict';

  var result = {success:true, users: []};

  var context = nlapiGetContext();
  var customerId = nlapiGetUser();
  var contactId = context.getContact();
  var role = context.getRole();
  
  if (!customerId || customerId == '-4')
   throw unauthorizedError;
   
  var customer = nlapiLoadRecord("customer", customerId),
      isPrimaryContact = this.isPrimaryContact(customerId, contactId);
  
  if (!isPrimaryContact)
   throw nlapiCreateError("NOT_PRIMARY_CONTACT", "You must be logged in as the primary contact to view this page.");
  
  var filters = [new nlobjSearchFilter("company", null, "is", customerId),
                 new nlobjSearchFilter("isinactive", null, "is", "F")];
  var columns = [new nlobjSearchColumn("entityid"),
                 new nlobjSearchColumn("firstname"),
                 new nlobjSearchColumn("lastname"),
                 new nlobjSearchColumn("jobtitle"),
                 new nlobjSearchColumn("email"),
                 new nlobjSearchColumn("phone")];
                 
  if (contact_id)
   filters.push(new nlobjSearchFilter("internalid", null, "anyof", contact_id));
  
  var contacts = nlapiSearchRecord("contact", null, filters, columns);
  
  if (contacts && contacts.length > 0) {
  
   var contactloginaccess_lookup = {},
       contactroles_lookup = {};
   
   for (var i=1, l=customer.getLineItemCount("contactroles"); i <= l; i++) {
    var id = customer.getLineItemValue("contactroles", "contact", i);
    contactloginaccess_lookup[id] = customer.getLineItemValue("contactroles", "giveaccess", i) == "T";
    var role = "";
    if (contactloginaccess_lookup[id]) 
     role = customer.getLineItemText("contactroles", "role", i);
    contactroles_lookup[id] = role;
   }
   
   for (var i=0, l=contacts.length; i < l; i++) {
    var contact = contacts[i];
    var uccontactid = contact.getId();
    var contactname = (contact.getValue("firstname") + " " + contact.getValue("lastname")).trim();
    if (!contactname) contactname = contact.getValue("entityid");
    result.users.push({"internalid": uccontactid,
                       "name": contactname,
                       "firstname": contact.getValue("firstname"),
                       "lastname": contact.getValue("lastname"),
                       "loginaccess": (contactloginaccess_lookup[uccontactid] ? "T" : "F"),
                       "loginaccess_text": (contactloginaccess_lookup[uccontactid] ? "Yes" : "No"),
                       "role": contactroles_lookup[uccontactid],
                       "jobtitle": contact.getValue("jobtitle"),
                       "email": contact.getValue("email"),
                       "phone": contact.getValue("phone")});
   }
   
   if (contact_id && result.users.length == 1) {
    result = result.users[0];
   }
   else {
    result.recordsPerPage = result.totalRecordsFound = contacts.length;
   }
  }
 
  return result;
	},

 deleteUser: function (contact_id)
 {
  'use strict';

  if (!contact_id)
   return {deleted: false};
  
  var customerId = nlapiGetUser()
  var contactId = nlapiGetContext().getContact();
  
  if (!customerId || customerId == '-4')
   throw unauthorizedError;

  var isPrimaryContact = this.isPrimaryContact(customerId, contactId);
  
  if (!isPrimaryContact)
   throw nlapiCreateError("NOT_PRIMARY_CONTACT", "You must be logged in as the primary contact to view this page.");
  
  nlapiSubmitField('contact', contact_id, 'isinactive', 'T');
  
  return {deleted: true};
 },
 
 create: function (data)
 {
  'use strict';

  var customerId = nlapiGetUser()
  var contactId = nlapiGetContext().getContact();
  
  if (!customerId || customerId == '-4')
   throw unauthorizedError;

  var isPrimaryContact = this.isPrimaryContact(customerId, contactId);
  
  if (!isPrimaryContact)
   throw nlapiCreateError("NOT_PRIMARY_CONTACT", "You must be logged in as the primary contact to view this page.");
  
  var customer = nlapiLoadRecord("customer", customerId);
  
  for (var i=1, l=customer.getLineItemCount("contactroles"); i <= l; i++) {
   var email = customer.getLineItemValue("contactroles", "email", i);
   if (email == data.email) {
    throw nlapiCreateError("CONTACT_EMAIL_EXISTS", "The email address you have entered is already registered. Please enter a unique email address and resubmit the form.");
   }
  }
  
  //this.validate(data);
  
  var contact = nlapiCreateRecord("contact");
  contact.setFieldValue("company", customerId);
  contact.setFieldValue("firstname", data.firstname || '');
  contact.setFieldValue("lastname", data.lastname || '');
  contact.setFieldValue("email", data.email || '');
  contact.setFieldValue("phone", data.phone || '');
  contact.setFieldValue("title", data.jobtitle || '');
  data.internalid = nlapiSubmitRecord(contact, true, true);
  
  customer = nlapiLoadRecord("customer", customerId);
  
  for (var i=1, l=customer.getLineItemCount("contactroles"); i <= l; i++) {
   var id = customer.getLineItemValue("contactroles", "contact", i);
   if (id == data.internalid) {
    var randomPassword = this.generateRandomPassword();
    customer.setLineItemValue("contactroles", "giveaccess", i, data.loginaccess == "T" ? "T" : "F");
    customer.setLineItemValue("contactroles", "sendemail", i, data.loginaccess == "T" ? "T" : "F");
    customer.setLineItemValue("contactroles", "password", i, randomPassword);
    customer.setLineItemValue("contactroles", "password2", i, randomPassword);
    nlapiSubmitRecord(customer, false, true);
    break;
   }
  }
  
  return data;
 },

 update: function (data)
 {
  'use strict';

  var customerId = nlapiGetUser();
  var contactId = nlapiGetContext().getContact();
  
  if (!customerId || !contactId || customerId == '-4')
   throw unauthorizedError;

  if (!data.internalid)
   throw notFoundError;
  
  var isPrimaryContact = this.isPrimaryContact(contactId, contactId);
  
  if (!isPrimaryContact)
   throw nlapiCreateError("NOT_PRIMARY_CONTACT", "You must be logged in as the primary contact to view this page.");
  
  //this.validate(data);

  var customer = nlapiLoadRecord("customer", customerId),
      contact = nlapiLoadRecord("contact", data.internalid),
      currentEmail = contact.getFieldValue("email");
  
  if (currentEmail != data.email) {
   for (var i=1, l=customer.getLineItemCount("contactroles"); i <= l; i++) {
    var id = customer.getLineItemValue("contactroles", "contact", i),
        email = customer.getLineItemValue("contactroles", "email", i);
    if (email == data.email && id != data.internalid) {
     throw nlapiCreateError("CONTACT_EMAIL_EXISTS", "The email address you have entered is already registered. Please enter a unique email address and resubmit the form.");
    }
   }
  }
  
  contact.setFieldValue("firstname", data.firstname || '');
  contact.setFieldValue("lastname", data.lastname || '');
  contact.setFieldValue("email", data.email || '');
  contact.setFieldValue("phone", data.phone || '');
  contact.setFieldValue("title", data.jobtitle || '');
  data.internalid = nlapiSubmitRecord(contact, true, true);
  
  customer = nlapiLoadRecord("customer", customerId);
  
  for (var i=1, l=customer.getLineItemCount("contactroles"); i <= l; i++) {
   var id = customer.getLineItemValue("contactroles", "contact", i);
   if (id == data.internalid) {
    var currentAccess = customer.getLineItemValue("contactroles", "giveaccess", i) == "T",
        newAccess = data.loginaccess == "T";
        
    if (currentAccess !== newAccess) {
     var randomPassword = this.generateRandomPassword();
     customer.setLineItemValue("contactroles", "giveaccess", i, newAccess ? "T" : "F");
     customer.setLineItemValue("contactroles", "sendemail", i, newAccess ? "T" : "F");
     customer.setLineItemValue("contactroles", "password", i, randomPassword);
     customer.setLineItemValue("contactroles", "password2", i, randomPassword);
     nlapiSubmitRecord(customer, false, true);
    }
    break;
   }
  }
  
  return data;
  //return this.get(contact_id);
 }

});
