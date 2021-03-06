/*
	BB1 G Truslove - Mar 2018
	ToolLists
*/

function service(request, response) {
	'use strict';

	var Application = require('Application');

	try {

		var method = request.getMethod();
var system = request.getParameter('system')=="T";
		var task = request.getParameter('task');
		var send = request.getParameter('send');
		var id = request.getParameter('productListId');
		nlapiLogExecution("DEBUG", "Share ToolList", "Task=" + task + " ToolList=" + id);
		var list = getList(id,system);
		switch (task) {
			case "email-csv":
				var email = request.getParameter('email');
				var attachment=nlapiCreateFile(list.name + " - " + list.owner+".csv", "CSV", listToCSV(list));

				require('Tools').emailAlert(69397, email, list.name, list.name + " - " + list.owner, listToHTML(list,send), {"Owner":list.owner},null,attachment);
				Application.sendContent({message:"An email has been sent."});
				break;
			case "download-csv":

				var body = "";



				if (list) {

					body = listToCSV(list);

					response.setContentType("CSV", list.name + " - " + list.owner + ".csv", "attachment");

				} else {
					body += "Unable to download tool list. Does it exist? Are you logged in?\r\n";
					response.setContentType("CSV", "ToolList" + id + ".csv", "attachment");
				}

				response.write(body);

				break;
		}


	} catch (e) {
		nlapiLogExecution("ERROR", "SCA ToolLists Service Error", e.toString());
		Application.sendError(e);
	}
}

function listToCSV(list) { //Convert list to CSV
	var body = "";
	var hoptions = {},
		options = [],
		op;
	for (var i = 0; i < list.items.length; i++) { //Get a list of all known options.

		op = list.items[i].options;
		for (var p in op) {
			if (!hoptions[p]) {
				hoptions[p] = op[p].label;
				options.push(p);
			}
		}
	}

	body += "\"Item Code\",\"Item Name\"";
	for (var j = 0; j < options.length; j++) {
		p = op[options[j]];
		body += "," + CSVEncode(getCode(hoptions[options[j]]));
	}
	body += ",\"Quantity\",\"Priority\"\r\n";
	for (var i = 0; i < list.items.length; i++) {
		body += CSVEncode(list.items[i].item);
		body += "," + CSVEncode(list.items[i].displayname);

		op = list.items[i].options;
		for (var j = 0; j < options.length; j++) {
			p = op[options[j]];
			body += ",";
			if (p) {
				body += CSVEncode(p.displayvalue);
			}
		}
		body += "," + list.items[i].quantity;
		body += "," + CSVEncode(list.items[i].priority);
		body += "\r\n";

	}
	return body;
}

function listToHTML(list,send) { //Convert list to HTML
	var body = "";

switch (send||"") {
					case "week":
						body+="<p style=\"color:#333\">You requested that this list be sent to you every week.</p>";
						break;
					case "2weeks":
						body+="<p style=\"color:#333\">You requested that this list be sent to you every two weeks.</p>";
						break;
					case "month":
						body+="<p style=\"color:#333\">You requested that this list be sent to you every month.</p>";
						break;
					case "2months":
						body+="<p style=\"color:#333\">You requested that this list be sent to you every two months.</p>";
						break;
					case "3months":
						body+="<p style=\"color:#333\">You requested that this list be sent to you every three months.</p>";
						break;
					case "6months":
						body+="<p style=\"color:#333\">You requested that this list be sent to you every six months.</p>";
						break;
					case "year":
						body+="<p style=\"color:#333\">You requested that this list be sent to you every year.</p>";
						break;
}
	var hoptions = {},
		options = [],
		op;
	for (var i = 0; i < list.items.length; i++) { //Get a list of all known options.

		op = list.items[i].options;
		for (var p in op) {
			if (!hoptions[p]) {
				hoptions[p] = op[p].label;
				options.push(p);
			}
		}
	}
var thstyle=" style=\"border-bottom:1px solid #EEE;font-weight:bold;text-align:left;color:#333;padding:4px;\"";
var tdstyle=" style=\"border-bottom:1px solid #EEE;text-align:left;color:#333;padding:4px;\"";
var astyle=" style=\"color:#00cf8b;\"";
	body += "<table cellspacing=\"0\"><tr><th"+thstyle+">Item Code</th><th"+thstyle+">Item Name</th>";
	for (var j = 0; j < options.length; j++) {
		p = op[options[j]];
		body += "<th"+thstyle+">" + HTMLEncode(getCode(hoptions[options[j]])) + "</th>";
	}
	body += "<th"+thstyle+">Quantity</th><th"+thstyle+">Priority</th></tr>";
	for (var i = 0; i < list.items.length; i++) {
		body += "<tr>";
		if(list.items[i].urlcomponent){
		body += "<td"+tdstyle+"><a"+astyle+" href=\"http://www.stonetools.co.uk/"+list.items[i].urlcomponent+"\">" + HTMLEncode(list.items[i].item) + "</a></td>";
		}else{
			body += "<td"+tdstyle+">" + HTMLEncode(list.items[i].item) + "</td>";
		}
		body += "<td"+tdstyle+">" + HTMLEncode(list.items[i].displayname) + "</td>";

		op = list.items[i].options;
		for (var j = 0; j < options.length; j++) {
			p = op[options[j]];
			if (p) {
				body += "<td"+tdstyle+">" + HTMLEncode(p.displayvalue) + "</td>";
			}else{
				body += "<td"+tdstyle+"></td>";
			}
		}
		body += "<td"+tdstyle+">" + list.items[i].quantity + "</td>";
		body += "<td"+tdstyle+">" + HTMLEncode(list.items[i].priority) + "</td>";
		body += "</tr>";

	}
	body += "</table>"
	return body;
}

function getList(id,system) { //Get a product list as an object
	var role = require('SC.Models.Init').context.getRoleId(),
		user = nlapiGetUser();

	// This is to ensure customers can't query other customer's product lists.
	if (role !== 'shopper' && role !== 'customer_center') {
		user = parseInt(this.request.getParameter('user') || user, 10);
	}

	var list = { name: "Unknown", owner: "", items: [] };
	var columns = [
		new nlobjSearchColumn('name'),
		new nlobjSearchColumn('custrecord_ns_pl_pl_owner')
	];

	var filters = [
		new nlobjSearchFilter('internalid', null, 'is', id), new nlobjSearchFilter('isinactive', null, 'is', 'F')
	];
if(!system){
	filters.push(new nlobjSearchFilter('custrecord_ns_pl_pl_owner', null, 'is', user));
}

	var searchresults = nlapiSearchRecord('customrecord_ns_pl_productlist', null, filters, columns);


	if (searchresults && searchresults.length >= 1) {
		var res = searchresults[0];

		list.name = res.getValue("name");
		list.owner = res.getText("custrecord_ns_pl_pl_owner");

		columns = [
			new nlobjSearchColumn('custrecord_ns_pl_pli_item'),
			new nlobjSearchColumn('displayname', 'custrecord_ns_pl_pli_item'),
			new nlobjSearchColumn('custrecord_ns_pl_pli_priority'),
			new nlobjSearchColumn('custrecord_ns_pl_pli_quantity'),
			new nlobjSearchColumn('custrecord_ns_pl_pli_options')
		];



		filters = [
			new nlobjSearchFilter('custrecord_ns_pl_pli_productlist', null, 'is', id)
		];

		var ires, itemresults = nlapiSearchRecord('customrecord_ns_pl_productlistitem', null, filters, columns);

		for (var i = 0; i < itemresults.length; i++) {
			ires = itemresults[i];
			list.items.push({
				item: ires.getText("custrecord_ns_pl_pli_item"),
				displayname: ires.getValue('displayname', 'custrecord_ns_pl_pli_item'),
				priority: ires.getText("custrecord_ns_pl_pli_priority"),
				quantity: ires.getValue("custrecord_ns_pl_pli_quantity"),
				options: JSON.parse(ires.getValue("custrecord_ns_pl_pli_options")),
				urlcomponent:ires.getValue('urlcomponent', 'custrecord_ns_pl_pli_item')
			});
		}
	} else {
		return;
	}
	return list;
}

function getCode(text) { //Strip out the parent code.
	if (text) {
		var index=text.indexOf(" : ");
		if(index>-1){
			text=text.substring(index+3);
		}
	}
	return text;
}

function CSVEncode(text) {
	if (text) {
		return "\"" + text.split("\"").join("\"\"") + "\"";
	}
	return "";
}

function HTMLEncode(text) {
	if (text) {
		text = text.split("&").join("&amp;");
		text = text.split("<").join("&lt;");
		text = text.split(">").join("&gt;");
		return text;
	}
	return "";
}