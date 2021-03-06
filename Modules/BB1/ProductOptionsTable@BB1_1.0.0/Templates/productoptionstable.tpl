{{! BB1 G Truslove Jan 2018 }}
<div class="productoptionstable">
	<div class="productoptions-th-row{{wrapclass}}">
		<div class="productoptions-th-narrow">{{translate 'Code'}}</div>
		{{#each columns}}
		<div class="productoptions-th-narrow">{{label}}</div>
		{{/each}} {{#if ispurchasable}}
		<div class="productoptions-th-wide pull-right">{{translate 'Quantity'}}</div>
		{{/if}} {{#if showoutofstockmessage}}
		<div class="productoptions-th pull-right">{{translate 'Stock'}}</div>
		{{/if}} {{#if showprices}}
		<div class="productoptions-th pull-right">{{translate 'Price'}}</div>
		{{/if}}
	</div>
	{{#each rows}}
	<div class="productoptions-td-row">
		<div class="productoptions-td-narrow"><span class="productoptions-td-title{{../wrapclass}}">{{translate 'Code'}}<br /></span>{{itemid}}</div>
		{{#each values}}
		<div class="productoptions-td-narrow"><span class="productoptions-td-title{{../../wrapclass}}">{{label}}<br /></span>{{{value}}}</div>
		{{/each}} {{#if ../ispurchasable}}
		<div class="productoptions-td-wide pull-right">{{#if ispurchasable}}<span class="productoptions-td-title{{../wrapclass}}">{{translate 'Quantity'}}<br /></span>
			<div class="product-details-quantity-container">
				<button type="button" class="product-details-quantity-remove" data-action="updateMatrixQuantity" data-type="product-details-quantity-remove" data-value="-1" {{#if isMinusButtonDisabled}}disabled="disabled" {{/if}}>-</button>
				<input type="number" name="matrixquantity" id="matrixquantity" data-action="changeMatrixQuantity" data-id="{{itemid}}" class="product-details-quantity-value" value="{{quantity}}" min="0" data-price="{{price}}">
				<button type="button" class="product-details-quantity-add" data-action="updateMatrixQuantity" data-value="+1">+</button>
			</div>
			{{/if}}
		</div>
		{{/if}} {{#if ../showoutofstockmessage}}
		<div class="productoptions-td pull-right"><span class="productoptions-td-title{{../wrapclass}}">{{#if showoutofstockmessage}}{{translate 'Stock'}}<br /></span>{{{outofstockmessage}}}{{/if}}</div>
		{{/if}} {{#if ../showprices}}
		<div class="productoptions-td pull-right"><span class="productoptions-td-title{{../wrapclass}}">{{translate 'Price'}}<br /></span><span class="productoptions-price">{{price_formatted}}</span>&nbsp;<span class="price-ex-vat">{{translate 'Ex. VAT'}}</span></div>
		{{/if}}
	</div>
	{{/each}}
	<!-- Totals -->
	<div class="productoptions-foot-row">
		<div class="productoptions-td-wide"><span class="productoptions-td-titletext">{{translate 'Shipping'}}<br /></span>{{deliveryMessage}}
			<br />{{deliveryMessageTime}}</div>
		{{#if ispurchasable}}
		<div class="productoptions-td-wide pull-right">
			<p id="ProductOptionsQuantity">0</p>
			<p><span id="ProductOptionsTotal">0.00</span>&nbsp;<span class="price-ex-vat">{{translate 'Ex. VAT'}}</span></p>
		</div>
		<div class="productoptions-td pull-right">
			<p class="productoptions-td-titletext">{{translate 'Quantity'}}</p>
			<p class="productoptions-td-titletext">{{translate 'Total'}}</p>
		</div>
		{{/if}}
	</div>
</div>
<!--Buttons -->
<div class="productoptions-buttons do-not-print">
	<div class="col-sm-4 col-xs-12 pull-right">
		<button class="button-addtocart" data-action="addtocart"><span class="footer-add-icon-size"><i class="button-addtocart-icon"></i></span> {{translate 'Add to Basket'}}</button>
	</div>
	<!--<div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 pull-right">
		<div data-view="ProductDetails.AddToQuote" ></div>
	</div>-->
	<div class="col-sm-4 col-xs-12 pull-right">
		<div data-view="AddToProductList"></div>
	</div>
	<div class="col-sm-4 col-xs-12 pull-right">
		<div data-view="SocialSharing.Flyout" class="product-details-full-social-sharing"></div>
	</div>
</div>