/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Cart
define('Cart.Confirmation.View', [

	'Backbone.CompositeView', 'cart_confirmation_modal.tpl', 'Backbone', 'underscore', 'Utils'
], function(

	BackboneCompositeView, cart_confirmation_modal_tpl, Backbone, _
) {
	'use strict';

	// @class Cart.Confirmation.View Cart Confirmation view @extends Backbone.View
	return Backbone.View.extend({

		// @property {Function} template
		template: cart_confirmation_modal_tpl

			// @property {String} title
			,
		title: _('Added to Basket').translate()

			,
		modalClass: 'global-views-modal-large'

			// @property {String} page_header
			,
		page_header: _('Added to Basket').translate()

			// @property {Object} attributes
			,
		attributes: {
			'id': 'Cart.Confirmation.View',
			'class': 'add-to-cart-confirmation-modal shopping-cart-modal'
		}

		// @method initialize
		,
		initialize: function(options) {
				if (this.model) {
					this.models = [this.model];
				}
				this.models = options.models;
				for (var i = 0; i < this.models.length; i++) {
					this.models[i].on('change', this.render, this);
				}
				BackboneCompositeView.add(this);
			}

			,
		destroy: function destroy() {
				for (var i = 0; i < this.models.length; i++) {
					this.models[i].off('change', this.render, this);
				}
				this._destroy();
			}

			// @method getContext
			// @return {Cart.Confirmation.View.Context}
			,
		getContext: function() {

			var item = this.models[0].get('item');
			var quantity = 0;
			var lines = [],
				options, optiontext,value;
			for (var i = 0; i < this.models.length; i++) {
				//console.log(this.models[i]);
				quantity += this.models[i].get("quantity");
				options = this.models[i].get("options");
				
				optiontext = "";
				for (var j = 0; j < options.models.length; j++) {
					if (optiontext.length > 0) {
						optiontext += ", ";
					}
					value=options.models[j].get("value");

					optiontext += "<b>" + options.models[j].get("label") + ":</b> " + value.label;
				}
				lines.push({ quantity: this.models[i].get("quantity"), rate_formatted: this.models[i].get("rate_formatted"), optiontext: optiontext });
			}

			// @class Cart.Confirmation.View.Context
			return {
				// @property {LiveOrder.Line.Model} model
				model: this.models[0]
					// @property {ImageContainer} thumbnail
					,
				thumbnail: this.models[0].getThumbnail()
					// @property {Boolean} showQuantity
					,
				showQuantity: (item.get('_itemType') !== 'GiftCert') && (quantity > 0)
					// @property {String} itemName
					,
				itemName: item.get('_name', true),
				lines: lines

			};
		}

		// @class Cart.Confirmation.View
	});

});