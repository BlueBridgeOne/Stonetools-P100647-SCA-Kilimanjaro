/**
 * bb1_sca_article_approve_cl
 * @NApiVersion 2.x
 * 
 * Project: P100647
 *
 * Date			Author			Purpose		
 * 27 Nov 2017	Gordon Truslove	Initial release
 *
 * Copyright (c) 2017 BlueBridge One Business Solutions, All Rights Reserved
 * support@bluebridgeone.com, +44 (0)1932 300007
 */
define([ 'N/url', 'N/currentRecord', 'N/runtime', 'N/record' ],

function(url, currentRecord, runtime, record) {

	function bb1_approve_article() { //Approve an article
		var R = currentRecord.get();

		var href = url.resolveRecord({
			recordType : 'customrecord_bb1_sca_article',
			recordId : R.id,
			isEditMode : false
		});
		var user = runtime.getCurrentUser();
		//		alert("approve " + R.id + " " + href + " " + user.id);

		var id = record.submitFields({
			type : 'customrecord_bb1_sca_article',
			id : R.id,
			values : {
				custrecord_bb1_sca_a_approvedby : user.id,
				custrecord_bb1_sca_a_approved : 'T'
			},
			options : {
				enableSourcing : false,
				ignoreMandatoryFields : true
			}
		});

		document.location = href;
	}

	return {
		bb1_approve_article : bb1_approve_article
	};

});
