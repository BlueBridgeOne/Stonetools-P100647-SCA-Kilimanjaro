/*
	BB1 G Truslove Jan 2018
*/

// @module ProductDetails
define('ProductOptionsTable.View', [

    'Backbone.CompositeView', 'Backbone.CollectionView', 'ProductViews.Price.View', 'ProductLine.Stock.View', 'ProductLine.StockDescription.View', 'productoptionstable.tpl', 'Utils', 'Backbone', 'SocialSharing.Flyout.View', 'LiveOrder.Line.Model', 'LiveOrder.Model', 'Cart.Confirmation.Helpers', 'ProductDetails.AddToProductList.View', 'ProductDetailToQuote.View'
], function(

    BackboneCompositeView, BackboneCollectionView, ProductViewsPriceView, ProductLineStockView, ProductLineStockDescriptionView, productoptionstable_tpl, Utils, Backbone, SocialSharingFlyoutView, LiveOrderLineModel, LiveOrderModel, CartConfirmationHelpers, ProductDetailsAddToProductListView, ProductDetailToQuoteView
) {
    'use strict';

    //@class ProductOptionsTable.View.initialize
    //@property {Transaction.Line.Model} model

    return Backbone.View.extend({

        //@property {Function} template
        template: productoptionstable_tpl

            //@method initialize Override default method to made current view composite
            //@param {ProductOptionsTable.View.initialize} options
            //@return {Void}
            ,
        initialize: function(options) {
            Backbone.View.prototype.initialize.apply(this, arguments);
            BackboneCompositeView.add(this);
            this.application = options.application;
            this.cart = LiveOrderModel.getInstance();
        },
        events: {
            'click [data-action="updateMatrixQuantity"]': 'setMatrixQuantity',
            'click [data-action="changeMatrixQuantity"]': 'setMatrixFocus',
            'keyup [data-action="changeMatrixQuantity"]': 'disableMatrixFocus',
            'click [data-action="addtocart"]': 'addToCart'
        } //@method showErrorInModal @param  {String} message
        ,
        showErrorInModal: function(title, message) {
            var view = new Backbone.View({ application: this.application });

            view.title = title;
            view.render = function() {
                this.$el.append('<p class="error-message">' + message + '</p>');
            };
            view.showInModal();
        },
        addToCart: function(e) { //Add all selected items to the cart

            e.preventDefault();
            var self = this;

            var matrixquantities = this.model.get("matrixquantities");
            var minimum_quantity = this.model.get('item').get('_minimumQuantity') || 0;

            if (!matrixquantities) {
                matrixquantities = {};
            }
            var totalquantity = 0,
                optionlist = [];
            var item_matrix_children = this.model.get('item').get('_matrixChilds');
            var options = this.model.getVisibleOptions();
            var newOption;
            for (var q in matrixquantities) { //Find the quantities and models and put them in a list.
                if (matrixquantities[q] > 0) {
                    totalquantity += matrixquantities[q];
                    newOption = { itemid: q, quantity: matrixquantities[q] };
                    optionlist.push(newOption);
                    for (var j = 0; j < item_matrix_children.models.length; j++) {
                        if (item_matrix_children.models[j].get("itemid") == q) {
                            console.log("Found " + q);
                            newOption.model = item_matrix_children.models[j];
                        }
                    }

                    if (false) {
                        for (var j = 0; j < options.length; j++) {
                            cartOptionId = options[j].get("cartOptionId");
                            itemOptionId = options[j].get("itemOptionId");
                            values = options[j].get("values");
                            text = newOption.model.get(itemOptionId);


                            for (var k = 0; k < values.length; k++) {
                                if (values[k].label == text) {
                                    newOption.label = values[k].label;
                                    newOption.internalid = values[k].internalid;
                                }
                            }

                        }
                    }
                }
            }
            if (totalquantity < minimum_quantity) { //Needs more items.
                SC.Tools.showErrorInModal(this.application, _('Unable to Add to Basket').translate(), _.translate('Please select $(0) or more options.', minimum_quantity));
                return;
            }
            var line, lineoptions, lines = [];
            var cartOptionId, itemOptionId, values, label;
            //fist set the options on the model
            for (var i = 0; i < optionlist.length; i++) {

                lineoptions = this.model.get("options");
                //console.log("lineoptions: "+JSON.stringify(lineoptions));

                for (var j = 0; j < lineoptions.models.length; j++) {
                    cartOptionId = lineoptions.models[j].get("cartOptionId");
                    itemOptionId = lineoptions.models[j].get("itemOptionId");
                    label = optionlist[i].model.get(itemOptionId);
                    values = lineoptions.models[j].get("values");
                    for (var k = 0; k < values.length; k++) {
                        if (values[k].label == label) {
                            lineoptions.models[j].set("value", {
                                "internalid": values[k].internalid,
                                "label": label
                            });
                            lineoptions.models[j].set("value.internalid", values[k].internalid);
                            lineoptions.models[j].set("value.label", label);
                            break;
                        }
                    }
                }
                //console.log("lineoptions b: "+JSON.stringify(lineoptions));
                //then convert the model to a line.
                line = LiveOrderLineModel.createFromProduct(this.model);
                line.set("quantity", optionlist[i].quantity);



                lines.push(line);
            }

            //console.log("Test: " + JSON.stringify(lines));
            //add list of lines to cart.
            var cart_promise = this.cart.addLines(lines);
            //return;

            CartConfirmationHelpers.showCartConfirmation(cart_promise, lines, self.application);


            cart_promise.fail(function(jqXhr) {
                var error_details = null;
                try {
                    var response = JSON.parse(jqXhr.responseText);
                    error_details = response.errorDetails;
                } finally {
                    if (error_details && error_details.status === 'LINE_ROLLBACK') {
                        self.model.set('internalid', error_details.newLineId);
                    }
                }

            });

            this.disableElementsOnPromise(cart_promise, e.target);
            return false;

        },
        setQuantity: function(id, quantity) { //Save the quantity onto the model object. Because that's how it currently works.
            var matrixquantities = this.model.get("matrixquantities");
            if (!matrixquantities) {
                matrixquantities = {};
                this.model.set("matrixquantities", matrixquantities)
            }
            matrixquantities[id] = quantity;
        },
        validateMatrix: function(e) { //Go through all the matrix values and validate them against min max etc.
            var total = 0,
                totalprice = 0;
            var minimum_quantity = this.model.get('item').get('_minimumQuantity') || 0;

            var self = this,
                $StockNotes, quantityavailable;
            this.$(".product-details-quantity-value").each(function() {
                var quantity = parseInt($(this).val());
                if ($(this).val() == "") {
                    quantity = 0;
                }
                self.setQuantity($(this).attr("data-id"), quantity);


                $StockNotes = $(this).closest(".productoptions-td-row").find(".stock-notes");
                if ($StockNotes.length > 0) {

                    quantityavailable = parseInt($StockNotes.attr("data-quantityavailable"));
                    if (quantityavailable < quantity) {
                        $StockNotes.show();
                    } else {
                        $StockNotes.hide();
                    }
                }
                if (!_.isNumber(quantity) || _.isNaN(quantity) || quantity < 0) {

                } else {
                    if (quantity > 0) {
                        total += quantity;
                        totalprice += quantity * parseFloat($(this).attr("data-price"));
                    }
                }

            });
            $("#ProductOptionsQuantity").html(total);
            $("#ProductOptionsTotal").html(Utils.formatCurrency(totalprice,SC.getSessionInfo('currency').symbol));




        },
        findMatrixInput: function(e) { //Find the relevant input based on clicks or buttons.
            return this.$(e.target).closest(".product-details-quantity-container").find("[name='matrixquantity']");
        },
        findMatrixRemove: function(e) { //Find the relevant remove button based on clicks or buttons.
                return this.$(e.target).closest(".product-details-quantity-container").find(".product-details-quantity-remove");
            }

            // @method setQuantity Increase the product's Quantity by 1
            // @param {jQuery.Event} e
            // @return {Void}
            ,
        setMatrixQuantity: function setQuantity(e) {
                e.preventDefault();
                var $input = this.findMatrixInput(e);
                var value = parseInt(this.$(e.currentTarget).data('value'), 10),
                    old_value = parseInt($input.val(), 10),
                    new_quantity = old_value + value;


                $input.val(new_quantity).trigger('blur');

                var $remove = this.findMatrixRemove(e);
                if (new_quantity > 0) {
                    $remove.prop('disabled', false);
                } else {
                    $remove.prop('disabled', true);
                }
                this.validateMatrix(e);
            }

            // @method setFocus sets focus on input when clicked. Needed as FF won't focus if quantity is updated from spinners
            // @return {Void}
            ,
        setMatrixFocus: function setFocus(e) {
                var $input = this.findMatrixInput(e);
                $input.focus();
                this.validateMatrix(e);
            }

            // @method disableFocus Blur if ENTER/RETURN key is pressed
            // @return {Void}
            ,
        disableMatrixFocus: function disableFocus(e) {
                if (e.keyCode === 13) {
                    var $input = this.findMatrixInput(e);
                    $input.blur();
                }
                this.validateMatrix(e);
            }

            //@method render Override default method to made current view composite
            //@param {ProductOptionsTable.View.render}
            //@return {Void}
            ,
        render: function() {
                if (!this.model.get('options').length) {
                    return;
                }

                this._render();
            }
            //@property {ChildViews} childViews
            ,
        childViews: {

            'Item.Price': function() {
                return new ProductViewsPriceView({
                    model: this.model,
                    origin: 'PDPOPTIONS'
                });
            },
            'Item.Stock': function() {
                return new ProductLineStockView({
                    model: this.model
                });
            },
            'StockDescription': function() {
                return new ProductLineStockDescriptionView({
                    model: this.model
                });
            },
            'SocialSharing.Flyout': function() {
                return new SocialSharingFlyoutView({});
            },
            'AddToProductList': function() {
                return new ProductDetailsAddToProductListView({
                    model: this.model,
                    application: this.application
                });
            },
            'ProductDetails.AddToQuote': function() {
                return new ProductDetailToQuoteView({
                    'model': this.model,
                    'application': this.application
                });
            }
        }

        //@method getContext
        //@return {ProductOptionsTable.View.Context}
        ,
        getContext: function() {
            //Load all the matrix options into a list that's easy to render.
            var options = this.model.getVisibleOptions();
            var columns = [];
            for (var i = 0; i < options.length; i++) {
                columns.push({
                    cartOptionId: options[i].get("cartOptionId"),
                    itemOptionId: options[i].get("itemOptionId"),
                    label: options[i].get("label"),
                    type: options[i].get("type"),
                    isMatrixDimension: options[i].get("isMatrixDimension")
                });
            }

            var item_matrix_children = this.model.get('item').get('_matrixChilds');

            var nextdeliverydates = this.model.get('item').get('custitem_bb1_sca_childrennextdelivery');
            if (nextdeliverydates) {
                nextdeliverydates = JSON.parse(nextdeliverydates);
            } else {
                nextdeliverydates = {};
            }
            //console.log(nextdeliverydates);
            //console.log(item_matrix_children);
            var today = new Date(),
                orderdate;
            today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            var rows = [],
                row, value, child, showoutofstockmessage, ispurchasable, showprices = true,
                lastprice, outofstockmessage, quantityavailable, leadtime;
            for (var i = 0; i < item_matrix_children.length; i++) {
                child = item_matrix_children.models[i];
                //console.log(child);

                //hard coded, allways show a stock message.
                outofstockmessage = child.get("outofstockmessage");
                quantityavailable = child.get("quantityavailable");

                if (quantityavailable > 0) { //In stock
                    outofstockmessage = _("Available to Ship").translate();
                    outofstockmessage += "<div data-quantityavailable='" + quantityavailable + "'class='stock-notes'>" + _("Note: Only $(0) in Stock.").translate(quantityavailable) + "<br />";

                    //not enough stock messages
                    var remaindermessage;
                    if (nextdeliverydates[child.id] && nextdeliverydates[child.id].onorder) {
                        orderdate = new Date(nextdeliverydates[child.id].onorder);

                        if (orderdate >= today) {

                            remaindermessage = _('Remainder Available to Ship').translate() + " " + SC.Tools.findWeekDay(orderdate).toDateString();
                        }
                    }
                    if (!remaindermessage && nextdeliverydates[child.id] && nextdeliverydates[child.id].leadtime) {
                        leadtime = nextdeliverydates[child.id].leadtime;
                        if (leadtime == 1) {
                            remaindermessage = _('Remainder Available to Ship 1 Day After Order').translate();
                        } else if (leadtime > 1) {
                            remaindermessage = _('Remainder Available to Ship $(0) Days After Order').translate(leadtime);
                        }

                    }
                    outofstockmessage += (remaindermessage||"") + "</div>";


                } else { //Out of stock

                    if (!outofstockmessage && nextdeliverydates[child.id] && nextdeliverydates[child.id].onorder) {
                        orderdate = new Date(nextdeliverydates[child.id].onorder);

                        if (orderdate >= today) {

                            outofstockmessage = _('Available to Ship').translate() + " " + SC.Tools.findWeekDay(orderdate).toDateString();
                        }
                    }
                    if (!outofstockmessage && nextdeliverydates[child.id] && nextdeliverydates[child.id].leadtime) {
                        leadtime = nextdeliverydates[child.id].leadtime;
                        if (leadtime == 1) {
                            outofstockmessage = _('Available to Ship 1 Day After Order').translate();
                        } else if (leadtime > 1) {
                            outofstockmessage = _('Available to Ship $(0) Days After Order').translate(leadtime);
                        }

                    }
                    outofstockmessage = outofstockmessage || _("Available to Order").translate();

                }

                row = { values: [], outofstockmessage: outofstockmessage, showoutofstockmessage: outofstockmessage != null, ispurchasable: child.get("ispurchasable"), itemid: child.get("itemid"), price_formatted: child.get("onlinecustomerprice_detail").onlinecustomerprice_formatted, price: child.get("onlinecustomerprice_detail").onlinecustomerprice };

                row.quantity = 0;
                rows.push(row);
                if (row.showoutofstockmessage) {
                    showoutofstockmessage = true;
                }
                if (child.get("ispurchasable")) {
                    ispurchasable = true;
                }

                lastprice = row.price;
                for (var j = 0; j < columns.length; j++) {
                    value = { label: columns[j].label, value: child.get(columns[j]["itemOptionId"]) };
                    row.values.push(value);
                }
            }

            //sort by code then price.
            var swap, change = false;
            do {
                change = false;
                for (var i = 0; i < rows.length - 1; i++) {
                    if (parseInt(rows[i].itemid) > parseInt(rows[i + 1].itemid)) {
                        change = true;
                        swap = rows[i];
                        rows[i] = rows[i + 1];
                        rows[i + 1] = swap;
                    }
                }
            } while (change);
            do {
                change = false;
                for (var i = 0; i < rows.length - 1; i++) {
                    if (rows[i].price > rows[i + 1].price) {
                        change = true;
                        swap = rows[i];
                        rows[i] = rows[i + 1];
                        rows[i + 1] = swap;
                    }
                }
            } while (change);

            //work out if columns will wrap.
            var totalcolumns = (columns.length * 1) + 1;
            if (showprices) {
                totalcolumns += 2;
            }
            if (ispurchasable) {
                totalcolumns += 3;
            }
            if (showoutofstockmessage) {
                totalcolumns += 2;
            }

            //console.log(totalcolumns + " " + columns.length + " " + ispurchasable + " " + showprices);
            //console.log(item_matrix_children);

            //@class ProductOptionsTable.View.Context
            return {
                columns: columns,
                rows: rows,
                //@property {ProductModel} model
                model: this.model,
                showoutofstockmessage: showoutofstockmessage,
                ispurchasable: ispurchasable,
                showprices: showprices,
                iswrapped: totalcolumns > 12,
                wrapclass: totalcolumns > 12 ? " wrapped" : "",
                deliveryMessage:SC.Tools.getDeliveryMessage(),
                deliveryMessageTime:SC.Tools.getDeliveryMessageTime()

            };
            //@class ProductOptionsTable.View
        }

    });
});