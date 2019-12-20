/*
	BB1 G Truslove - Aug 2018
	NS Analytics Tracker
*/

function service(request) {
	'use strict';
	try {

		var method = request.getMethod(),
			data = request.getParameter('data');


		//nlapiLogExecution("AUDIT", "Analytics", data + " -- " + method);

		var customer = nlapiGetWebContainer().getShoppingSession().getCustomer();

		var customer = nlapiGetUser();
		var ctx = nlapiGetContext();
		var contact, customer_ana = 0,
			contact_ana = 0,
			contact_rec, customer_rec;
		try {
			contact = ctx.getContact();
		} catch (err) {}
		//Try to us the contact if possible.
		if (contact > 0) {
			contact_ana = nlapiLookupField('contact', contact, 'custentity_bb1_scaa_custanalytics');
			if (!contact_ana) {
				entityid = nlapiLookupField('contact', contact, 'entityid');
				contact_rec = nlapiCreateRecord("customrecord_bb1_scaa_custana");
				contact_rec.setFieldValue("name", "Contact " + entityid);
				contact_ana = nlapiSubmitRecord(contact_rec, false, true);
				nlapiSubmitField('contact', contact, 'custentity_bb1_scaa_custanalytics', contact_ana);
			}
		}
		//If no contact then use the customer.
		if (contact_ana == 0 && customer > 0) {
			var type = "customer",
				entityid;
			try {
				customer_ana = nlapiLookupField(type, customer, 'custentity_bb1_scaa_custanalytics');
			} catch (ce) {
				type = "lead";
				customer_ana = nlapiLookupField(type, customer, 'custentity_bb1_scaa_custanalytics');
			}
			if (!customer_ana) {
				entityid = nlapiLookupField(type, customer, 'entityid');
				customer_rec = nlapiCreateRecord("customrecord_bb1_scaa_custana");
				customer_rec.setFieldValue("name", "Customer " + entityid);
				customer_ana = nlapiSubmitRecord(customer_rec, false, true);
				nlapiSubmitField(type, customer, 'custentity_bb1_scaa_custanalytics', customer_ana);
			}
		}


		//nlapiLogExecution("AUDIT","guest_data",JSON.stringify(guest_data));
		response.write("ok " + customer + " " + contact + " - " + customer_ana + " " + contact_ana);

		if (contact_ana > 0) {
			updateAnalytics(response, contact_ana, data);
		} else if (customer_ana > 0) {
			updateAnalytics(response, customer_ana, data);
		}

	} catch (e) {
		nlapiLogExecution("ERROR", "SCA Analytics Service Error", e);
		response.write(e.toString());
	}
}
//update an analytics record.
function updateAnalytics(response, recid, data) {

	if (data && data.length > 0) {
		data = JSON.parse(data);
		nlapiLogExecution("ERROR", "SCA Analytics Service", "Update "+recid);
	}else{
		nlapiLogExecution("ERROR", "SCA Analytics Service Error", "data is not found.");
	}

	var rec = nlapiLoadRecord("customrecord_bb1_scaa_custana", recid);

	var prefix = "custrecord_bb1_scaa_custana_";

	var now = new Date();
	var year = now.getFullYear().toString();
	var month = now.getMonth();
	var track, value;

	var totalvisits = parseInt(rec.getFieldValue(prefix + "totalvisits"));
	if (!(totalvisits > 0)) {
		totalvisits = 0;
	}
	var totalpages = parseInt(rec.getFieldValue(prefix + "totalpages"));
	if (!(totalpages > 0)) {
		totalpages = 0;
	}
	var lastvisitdate=rec.getFieldValue(prefix + "lastvisitdat");
	
	if(lastvisitdate){
		lastvisitdate=nlapiStringToDate(lastvisitdate,"datetimetz");
	
	}else{
		lastvisitdate=new Date(0);
	}

	var pagedata = rec.getFieldValue(prefix + "pagedata");
	if (pagedata && pagedata.length > 0) {
		try {
			pagedata = JSON.parse(pagedata);
		} catch (e) {
			pagedata = {};
		}
	} else {
		pagedata = {};
	}
	var visitdata = rec.getFieldValue(prefix + "visitdata");
	if (visitdata && visitdata.length > 0) {
		try {
			visitdata = JSON.parse(visitdata);
		} catch (e) {
			visitdata = {};
		}
	} else {
		visitdata = {};
	}
	
	var viewdata = rec.getFieldValue(prefix + "viewdata");
	if (viewdata && viewdata.length > 0) {
		try {
			viewdata = JSON.parse(viewdata);
			if(typeof viewdata=="string"){
				viewdata = JSON.parse(viewdata);
			}
		} catch (e) {
			viewdata = {};
		}
	} else {
		viewdata = {};
	}
	
	var catdata = rec.getFieldValue(prefix + "catdata");
	if (catdata && catdata.length > 0) {
		try {
			catdata = JSON.parse(catdata);
			if(typeof catdata=="string"){
				catdata = JSON.parse(catdata);
			}
		} catch (e) {
			catdata = {};
		}
	} else {
		catdata = {};
	}
	var artdata = rec.getFieldValue(prefix + "artdata");
	if (artdata && artdata.length > 0) {
		try {
			artdata = JSON.parse(artdata);
		} catch (e) {
			artdata = {};
		}
	} else {
		artdata = {};
	}
	var itemdata = rec.getFieldValue(prefix + "itemdata");
	if (itemdata && itemdata.length > 0) {
		try {
			itemdata = JSON.parse(itemdata);
		} catch (e) {
			itemdata = {};
		}
	} else {
		itemdata = {};
	}
	if(data){
	rec.setFieldValue(prefix + "lastsite", data.site);
	rec.setFieldValue(prefix + "lastos", data.OS);
	rec.setFieldValue(prefix + "lastagent", data.userAgent);
	rec.setFieldValue(prefix + "lastbrowser", data.browser);
	rec.setFieldValue(prefix + "lastscreen", data.screenSize);
	rec.setFieldValue(prefix + "lastlang", data.language);
	}

	var pageschanged = false,
		visitschanged = false,
		catschanged = false,
		artschanged = false,
		itemschanged = false;

	var diff, hours;

		diff = now.getTime() - lastvisitdate.getTime();
		hours = ((diff / 1000) / 60) / 60;
		//nlapiLogExecution("DEBUG","Hours Since Modified",now+" - "+lastvisitdate+" = "+hours+" ? "+nlapiDateToString(now,"datetimetz"));
	
		rec.setFieldValue(prefix + "lastvisitdat", nlapiDateToString(now,"datetimetz"));

	if (hours > 3||hours<0) { //3 hours have passed so assume this is a new visit.

		totalvisits++;
		if (!visitdata[year]) {
			visitdata[year] = [];
		}
		value = visitdata[year][month] || 0;
		visitdata[year][month] = value + 1;
		visitschanged = true;
	}

	if (data&&data.tracking) {
		for (var i = 0; i < data.tracking.length; i++) {
			track = data.tracking[i];

			switch (track.name) {
				case "page":
					totalpages++;
					if (!pagedata[year]) {
						pagedata[year] = [];
					}
					value = pagedata[year][month] || 0;
					pagedata[year][month] = value + 1;

					if (viewdata[track.value]) {
						viewdata[track.value]++;
					} else {
						viewdata[track.value] = 1;
					}
					pageschanged = true;
					break;
				case "category":
					if (catdata[track.value]) {
						catdata[track.value]++;
					} else {
						catdata[track.value] = 1;
					}
					catschanged = true;
					break;
				case "article":
					if (artdata[track.value]) {
						artdata[track.value]++;
					} else {
						artdata[track.value] = 1;
					}
					artschanged = true;
					break;
				case "item":
					if (itemdata[track.value]) {
						itemdata[track.value]++;
					} else {
						itemdata[track.value] = 1;
					}
					itemschanged = true;
					break;
				case "transaction":
					break;
				case "search":
					break;
				default:
					break;
			}
		}
	}

	rec.setFieldValue(prefix + "totalpages", totalpages);
	if (pageschanged) {
		rec.setFieldValue(prefix + "pagedata", JSON.stringify(pagedata));
		rec.setFieldValue(prefix + "viewdata", JSON.stringify(viewdata));
	}
	if (visitschanged) {
		rec.setFieldValue(prefix + "totalvisits", totalvisits);
		rec.setFieldValue(prefix + "visitdata", JSON.stringify(visitdata));
	}
	if (catschanged) {
		rec.setFieldValue(prefix + "catdata", JSON.stringify(catdata));
	}
	if (artschanged) {
		rec.setFieldValue(prefix + "artdata", JSON.stringify(artdata));
	}
	if (itemschanged) {
		rec.setFieldValue(prefix + "itemdata", JSON.stringify(itemdata));
	}
	nlapiSubmitRecord(rec);
}