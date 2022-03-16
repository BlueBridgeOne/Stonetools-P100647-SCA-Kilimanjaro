/**
 * Export customers ordered items to product lists
 *
 */
function BB1_SC_ExportOrderedItemsToProductLists() {
 
 var startIndex = 0;
 //var customerOrderedItemsSearch = nlapiCreateSearch("transaction", customerOrderedItemsFilters, customerOrderedItemsColumns); // 10 units
 var customerOrderedItemsSearch = nlapiLoadSearch("transaction", "customsearch_bb1_productlistexport"); // 10 units
 var customerOrderedItemsSearchResultSet = customerOrderedItemsSearch.runSearch();
 var customerOrderedItemsSearchResults = customerOrderedItemsSearchResultSet.getResults(startIndex, startIndex + 1000) || []; // 10 units
 
 var customerId = "",
     itemId = "",
     chapterId = "",
     productListRecId = "",
     productListsCreated = 0,
     productListItemsCreated = 0;
     
 while (customerOrderedItemsSearchResults.length) {
  for (var i=0; i < customerOrderedItemsSearchResults.length; i++) {
   
   //if (i < 20) continue;
   
   /*if (productListsCreated >= 1) {
    nlapiLogExecution("DEBUG", "Index is:", i);
    break;
   }*/
   
   checkGovernance(27);
   
   var customerOrderedItemsSearchResult = customerOrderedItemsSearchResults[i]; 
   var nextCustomerId = customerOrderedItemsSearchResult.getValue("name", null, "group");
   var nextItemId = customerOrderedItemsSearchResult.getValue("item", null, "group");
   var nextChapterId = customerOrderedItemsSearchResult.getValue("class", "item", "group");
   var chapterName = customerOrderedItemsSearchResult.getText("class", "item", "group");
   
   if (customerId == nextCustomerId && itemId == nextItemId) {
    nlapiLogExecution("DEBUG", "Item already added so skipping:", nextItemId);
    continue;
   }
   
   if (customerId != nextCustomerId || chapterId != nextChapterId) {
    customerId = nextCustomerId;
    chapterId = nextChapterId;
   
    var productListRec = nlapiCreateRecord("customrecord_ns_pl_productlist"); // 2 units
    productListRec.setFieldValue("name", chapterName);
    productListRec.setFieldValue("custrecord_ns_pl_pl_description", "This product lists contains the " + chapterName + " products you have ordered recently.");
    productListRec.setFieldValue("custrecord_ns_pl_pl_owner", customerId);
    productListRec.setFieldValue("custrecord_ns_pl_pl_scope", "2"); // private
    productListRec.setFieldValue("custrecord_ns_pl_pl_type", "1"); // default
    productListRecId = nlapiSubmitRecord(productListRec, "true", "true"); // 4 units
    productListsCreated++;
   }
   
   itemId = nextItemId;
   
   var productListItemRec = nlapiCreateRecord("customrecord_ns_pl_productlistitem"); // 2 units
   var itemQuantity = "1"; //customerOrderedItemsSearchResult.getValue("quantity");
   var itemOptions = {}; //(customerOrderedItemsSearchResult.getValue("options") || '').split(/\u0004/);
   var itemOptionsObject = {};
   
   for (var j=0; j < itemOptions.length; j++) {
    var values = itemOptions[j].split(/\u0003/);
    var fieldId = values[0].toLowerCase();
    var fieldValue = values[3];
    nlapiLogExecution("DEBUG", "Item options: fieldId/fieldValue", fieldId + "/" + fieldValue);
    if (!fieldValue) continue;
    itemOptionsObject[fieldId] = {
     "type": "select",
     "itemOptionId": fieldId.replace(/^custcol/, "custitem"),
     "label": values[2],
     "value": fieldValue,
     "displayvalue": values.length >= 5 ? values[4] : ""
    };
   }
   
   itemOptionsObject = BB1_SC_GetItemOptionsObject(itemId, itemOptionsObject); // 5 units
   
   productListItemRec.setFieldValue("custrecord_ns_pl_pli_productlist", productListRecId);
   productListItemRec.setFieldValue("custrecord_ns_pl_pli_item", itemId);
   //productListItemRec.setFieldValue("custrecord_ns_pl_pli_description", itemId);
   productListItemRec.setFieldValue("custrecord_ns_pl_pli_options", JSON.stringify(itemOptionsObject));
   productListItemRec.setFieldValue("custrecord_ns_pl_pli_quantity", itemQuantity);
   productListItemRec.setFieldValue("custrecord_ns_pl_pli_priority", "2"); // medium
   var productListItemRecId = nlapiSubmitRecord(productListItemRec, "true", "true"); // 4 units
   
   productListItemsCreated++;
   
  }
  
  //if (productListsCreated >= 1) break;
   
  if (customerOrderedItemsSearchResults.length == 1000) {
   startIndex += 1000;
   customerOrderedItemsSearchResults = customerOrderedItemsSearchResultSet.getResults(startIndex, startIndex + 1000) || []; // 10 units
  }
  else {
   customerOrderedItemsSearchResults = [];
  }
 }
 
 nlapiLogExecution("DEBUG", "Product lists created:", productListsCreated);
 nlapiLogExecution("DEBUG", "Product list items created:", productListItemsCreated);
 
}

/**
 * Get Item options
 *
 */
function BB1_SC_GetItemOptionsObject(itemId, productListItemOptions) {
 
 productListItemOptions = productListItemOptions || {};
 
 var itemType = 'inventoryitem'; //productListItemsSearchResult.getValue('type', 'custrecord_ns_pl_pli_item'); // All InvtPart
 var itemRec = nlapiLoadRecord(itemType, itemId); // 5 units
 var itemOptionIds = itemRec.getFieldValues('itemoptions') || [];
 var itemOptionLabels = itemRec.getFieldTexts('itemoptions');
 
 //nlapiLogExecution('DEBUG', 'Existing Product list item ' + productListItemId + ' options set as:', JSON.stringify(productListItemOptions));
 //nlapiLogExecution('DEBUG', 'itemOptionIds:', JSON.stringify(itemOptionIds));
 //nlapiLogExecution('DEBUG', 'itemOptionLabels:', JSON.stringify(itemOptionLabels));
 
 if (itemOptionIds.length) {
  for (var j=0; j < itemOptionIds.length; j++) {
   var customColumnId = itemOptionIds[j].toLowerCase();
   var itemOptionId = customColumnId.replace(/^custcol/, "custitem");
   var itemOptionValue = itemRec.getFieldValue(itemOptionId);
   
   if (!itemOptionValue) continue;
   
   //var itemOptionLabel = itemOptionLabels[j];
   var itemOptionLabel = itemRec.getField(itemOptionId).getLabel();
   var itemOptionDisplayValue = itemRec.getFieldText(itemOptionId);
   
   productListItemOptions[customColumnId] = {
    'type': 'select',
    'itemOptionId': itemOptionId,
    'label': itemOptionLabel,
    'value': itemOptionValue,
    'displayvalue': itemOptionDisplayValue
   };
  }
   
  //nlapiSubmitField('customrecord_ns_pl_productlistitem', productListItemId, 'custrecord_ns_pl_pli_options', JSON.stringify(productListItemOptions)); // 4 units
  
  //nlapiLogExecution('DEBUG', 'Set Product list item ' + productListItemId + ' options to:', JSON.stringify(productListItemOptions));
 }
 
 return productListItemOptions;
 
}

/**
 * Fixes the item options JSON on product list items
 *
 */
function BB1_SC_UpdateItemOptionsOnProductLists() {
 
 var startIndex = 0;
 var productListItemsFilters = [new nlobjSearchFilter('internalidnumber', 'custrecord_ns_pl_pli_productlist', 'between' ,'453', '13128'),
                                new nlobjSearchFilter('matrixchild', 'custrecord_ns_pl_pli_item', 'is', 'T')];
 var productListItemsColumns = [new nlobjSearchColumn('internalid').setSort(),
                                new nlobjSearchColumn('custrecord_ns_pl_pli_item'),
                                new nlobjSearchColumn('type', 'custrecord_ns_pl_pli_item'),
                                new nlobjSearchColumn('custrecord_ns_pl_pli_options')];
 var productListItemsSearch = nlapiCreateSearch("customrecord_ns_pl_productlistitem", productListItemsFilters, productListItemsColumns); // 10 units
 var productListItemsSearchResultSet = productListItemsSearch.runSearch();
 var productListItemsSearchResults = productListItemsSearchResultSet.getResults(startIndex, startIndex + 1000) || []; // 10 units
     
 while (productListItemsSearchResults.length) {
  for (var i=0; i < productListItemsSearchResults.length; i++) {
   
   checkGovernance(19);
   
   var productListItemsSearchResult = productListItemsSearchResults[i]; 
   var productListItemId = productListItemsSearchResult.getId();
   var itemId = productListItemsSearchResult.getValue('custrecord_ns_pl_pli_item');
   var productListItemOptions = JSON.parse(productListItemsSearchResult.getValue('custrecord_ns_pl_pli_options') || '{}');
   productListItemOptions = BB1_SC_GetItemOptionsObject(itemId, productListItemOptions);
   
   if (Object.keys(productListItemOptions).length) {
    
    nlapiSubmitField('customrecord_ns_pl_productlistitem', productListItemId, 'custrecord_ns_pl_pli_options', JSON.stringify(productListItemOptions)); // 4 units
    
    nlapiLogExecution('DEBUG', 'Set Product list item ' + productListItemId + ' options to:', JSON.stringify(productListItemOptions));
   }
  }
  
  if (productListItemsSearchResults.length == 1000) {
   startIndex += 1000;
   productListItemsSearchResults = productListItemsSearchResultSet.getResults(startIndex, startIndex + 1000) || []; // 10 units
  }
  else {
   productListItemsSearchResults = [];
  }
 }
}

/**
 * Mass delete product lists
 *
 */
function BB1_SC_DeleteProductLists() {
 
 var startIndex = 0;
 var productListItemsFilters = [new nlobjSearchFilter('internalidnumber', 'custrecord_ns_pl_pli_productlist', 'between' ,'453', '13128')];
 var productListItemsSearch = nlapiCreateSearch("customrecord_ns_pl_productlistitem", productListItemsFilters); // 10 units
 var productListItemsSearchResultSet = productListItemsSearch.runSearch();
 var productListItemsSearchResults = productListItemsSearchResultSet.getResults(startIndex, startIndex + 1000) || []; // 10 units
     
 while (productListItemsSearchResults.length) {
  for (var i=0; i < productListItemsSearchResults.length; i++) {
   
   checkGovernance(14);
   
   var productListItemsSearchResult = productListItemsSearchResults[i]; 
   var productListItemId = productListItemsSearchResult.getId();
   nlapiDeleteRecord("customrecord_ns_pl_productlistitem", productListItemId);
   
  }
  
  if (productListItemsSearchResults.length == 1000) {
   startIndex += 1000;
   productListItemsSearchResults = productListItemsSearchResultSet.getResults(startIndex, startIndex + 1000) || []; // 10 units
  }
  else {
   productListItemsSearchResults = [];
  }
 }
 
 var startIndex = 0;
 var productListFilters = [new nlobjSearchFilter('internalidnumber', null, 'between' ,'453', '13128')];
 var productListSearch = nlapiCreateSearch("customrecord_ns_pl_productlist", productListFilters); // 10 units
 var productListSearchResultSet = productListSearch.runSearch();
 var productListSearchResults = productListSearchResultSet.getResults(startIndex, startIndex + 1000) || []; // 10 units
     
 while (productListSearchResults.length) {
  for (var i=0; i < productListSearchResults.length; i++) {
   
   checkGovernance(4);
   
   var productListSearchResult = productListSearchResults[i]; 
   var productListId = productListSearchResult.getId();
   nlapiDeleteRecord("customrecord_ns_pl_productlist", productListId);
   
  }
  
  if (productListSearchResults.length == 1000) {
   startIndex += 1000;
   productListSearchResults = productListSearchResultSet.getResults(startIndex, startIndex + 1000) || []; // 10 units
  }
  else {
   productListSearchResults = [];
  }
 }
}

var startTime = new Date();
/**
 * Checks whether this script needs to be rescheduled.
 *
 * @param {number} requiredUsage The required governance points to continue
 */
function checkGovernance(requiredUsage)
{
 var context = nlapiGetContext(),
     currentTime = new Date(),
     timeLimit = 50 * 60 * 1000; // 50 minutes in ms
     
 if (context.getRemainingUsage() < requiredUsage || currentTime.getTime() - startTime.getTime() >= timeLimit)
 {
  var state = nlapiYieldScript();
  startTime = new Date();
  if (state.status == 'FAILURE')
  {
   nlapiLogExecution("ERROR","Failed to yield script, exiting: Reason = "+state.reason + " / Size = "+ state.size);
   throw "Failed to yield script";
  } 
  else if (state.status == 'RESUME')
  {
   nlapiLogExecution("AUDIT", "Resuming script because of " + state.reason+".  Size = "+ state.size);
  }
  // state.status will never be SUCCESS because a success would imply a yield has occurred.  The equivalent response would be yield
 }
}
