/*
    © 2017 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/

// @module ProductLine
define(
    'ProductLine.Stock.View', [
        'product_line_stock.tpl'

        , 'Backbone'
    ],
    function(
        product_line_stock_tpl

        , Backbone
    ) {
        'use strict';

        // @class ProductLine.Stock.View @extends Backbone.View
        return Backbone.View.extend({

            template: product_line_stock_tpl

                //@method initialize Override default method to attach model's change event to re-render
                //@param {ProductLine.Stock.View.Initialize.options} options
                //@return {Void}
                ,
            initialize: function() {
                    this.model.on('change', this.render, this);
                }

                //@method destroy Override default method to detach from model's change event
                //@return {Void}
                ,
            destroy: function destroy() {
                    Backbone.View.prototype.destroy.apply(this, arguments);
                    this.model.off('change', this.render, this);
                }

                //@method getContext
                //@return {ProductLine.Stock.View.Context}
                ,
            getContext: function() {
                this.stock_info = this.model.getStockInfo();
                
                //console.log(this.model);
                var sku = this.model.getSku();


                var quantityavailable = -1,found=false,childDetail,
                    outofstockmessage, quantity, nextdeliverydates, itemid, leadtime, orderdate;

                var today = new Date();
                today = new Date(today.getFullYear(), today.getMonth(), today.getDate());

                quantity = this.model.get("quantity");
                var matrix_parent = this.model.get("item");

                if (matrix_parent) {
                childDetail=matrix_parent.get("matrixchilditems_detail");
                    if (childDetail && childDetail.length > 0) {

                        nextdeliverydates = JSON.parse(matrix_parent.get("custitem_bb1_sca_childrennextdelivery") || "{}");
                        for (var i = 0; i < childDetail.length; i++) {
                            
                            if (childDetail[i].itemid == sku) {
                                console.log("Found "+childDetail[i].internalid);
                                itemid = childDetail[i].internalid;
                                quantityavailable = childDetail[i].quantityavailable;
                                found=true;
                                break;
                            }

                        }



                        if(found){
                        if (quantityavailable > 0) { //In stock
                            outofstockmessage = _("Available to Ship").translate();
                            if (quantityavailable < quantity) {
                                outofstockmessage += "<div class='stock-notes' style='display:block'>" + _("Note: Only $(0) in Stock.").translate(quantityavailable) + "<br />";

                                //not enough stock messages
                                var remaindermessage;
                                if (nextdeliverydates[itemid] && nextdeliverydates[itemid].onorder) {
                                    orderdate = new Date(nextdeliverydates[itemid].onorder);

                                    if (orderdate >= today) {

                                        remaindermessage = _('Remainder Available to Ship').translate() + " " + SC.Tools.findWeekDay(orderdate).toDateString();
                                    }
                                }
                                console.log(nextdeliverydates);
                                if (!remaindermessage && nextdeliverydates[itemid] && nextdeliverydates[itemid].leadtime) {
                                    leadtime = nextdeliverydates[itemid].leadtime;
                                    if (leadtime == 1) {
                                        remaindermessage = _('Remainder Available to Ship 1 Day After Order').translate();
                                    } else if (leadtime > 1) {
                                        remaindermessage = _('Remainder Available to Ship $(0) Days After Order').translate(leadtime);
                                    }

                                }
                                outofstockmessage += (remaindermessage || "") + "</div>";
                            }

                        } else { //Out of stock

                            if (!outofstockmessage && nextdeliverydates[itemid] && nextdeliverydates[itemid].onorder) {
                                orderdate = new Date(nextdeliverydates[itemid].onorder);

                                if (orderdate >= today) {

                                    outofstockmessage = _('Available to Ship').translate() + " " + SC.Tools.findWeekDay(orderdate).toDateString();
                                }
                            }
                            if (!outofstockmessage && nextdeliverydates[itemid] && nextdeliverydates[itemid].leadtime) {
                                leadtime = nextdeliverydates[itemid].leadtime;
                                if (leadtime == 1) {
                                    outofstockmessage = _('Available to Ship 1 Day After Order').translate();
                                } else if (leadtime > 1) {
                                    outofstockmessage = _('Available to Ship $(0) Days After Order').translate(leadtime);
                                }

                            }
                            outofstockmessage = outofstockmessage || _("Available to Order").translate();

                        }
}

                    }

                }



                //@class ProductLine.Stock.View.Context
                return {
                    outofstockmessage: outofstockmessage
                };
                //@class ProductLine.Stock.View
            }
        });
    });

//@class ProductLine.Stock.View.Initialize.options
//@property {Transaction.Line.Model|Item.Model|Product.Model} model