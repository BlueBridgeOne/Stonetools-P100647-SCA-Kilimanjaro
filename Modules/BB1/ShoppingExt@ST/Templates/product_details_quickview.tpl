{{!
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="product-details-quickview">
	<div class="product-details-quickview-img">
		<div data-view="Product.ImageGallery"></div>
	</div>
	<div class="product-details-quickview-details">

		<h1 class="product-details-quickview-item-name" itemprop="name">{{pageHeader}}</h1>

		<a class="product-details-quickview-full-details" data-action="go-to-fullview" data-touchpoint="home" data-name="view-full-details" data-hashtag="#{{itemUrl}}" href="{{itemUrl}}">
			{{translate 'View full details'}}
		</a>

		<div class="product-details-quickview-main">
			{{#if isItemProperlyConfigured}}
				<form id="product-details-quickview-form" data-action="submit-form" method="POST">

					<section class="product-details-quickview-info">

						<div id="banner-summary-bottom" class="product-details-quickview-banner-summary-bottom"></div>

					</section>

					<section data-view="Product.Options"></section>

<div class="productoptionstable">
	<div class="productoptions-th-row{{wrapclass}}">
		<div class="productoptions-th-narrow">{{translate 'Code'}}</div>
		<div class="productoptions-th-wide pull-right">{{translate 'Quantity'}}</div>
		<div class="productoptions-th-verywide pull-right">{{translate 'Stock'}}</div>
		<div class="productoptions-th-verywide pull-right">{{translate 'Price'}}</div>
	</div>
	
	<div class="productoptions-td-row">
		<div class="productoptions-td-narrow"><span class="productoptions-td-title">{{translate 'Code'}}<br /></span><div data-view="Product.Sku"></div></div>
		<div class="productoptions-td-wide pull-right">{{#if isPriceEnabled}}
						<span class="productoptions-td-title">{{translate 'Quantity'}}<br /></span><div data-view="Quantity" class="hide-add-remove"></div>{{/if}}</div>
		<div class="productoptions-td-verywide pull-right"><span class="productoptions-td-title">{{translate 'Stock'}}<br /></span><div data-view="Product.Stock.Info"></div></div>
		<div class="productoptions-td-verywide pull-right"><span class="productoptions-td-title">{{translate 'Price'}}<br /></span><div data-view="Quantity.Pricing"></div><div data-view="Product.Price"></div></div>
	</div>

	<!-- Totals -->
	<div class="productoptions-foot-row">
		<div class="productoptions-td-verywide"><span class="productoptions-td-titletext">{{translate 'Shipping'}}<br /></span>{{deliveryMessage}}
			<br />{{deliveryMessageTime}}</div>
	</div>

</div>

					{{#if isPriceEnabled}}

						<div class="productoptions-buttons do-not-print">
	{{#if isPriceEnabled}}
	<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 pull-right">
		<div data-view="MainActionView"></div>
	</div>
	<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 pull-right">
		<div data-view="AddToProductList"></div>
	</div>
	{{/if}}
</div>

					{{/if}}

					<div data-view="StockDescription"></div>

					<div class="product-details-quickview-main-bottom-banner">
						<div id="banner-summary-bottom" class="product-details-quickview-banner-summary-bottom"></div>
					</div>
				</form>
			{{else}}
				<div data-view="GlobalViewsMessageView.WronglyConfigureItem"></div>
			{{/if}}

			<div id="banner-details-bottom" class="product-details-quickview-banner-details-bottom" data-cms-area="item_info_bottom" data-cms-area-filters="page_type"></div>
		</div>

	</div>
</div>


{{!----
The context variables for this template are not currently documented. Use the {{log this}} helper to view the context variables in the Console of your browser's developer tools.

----}}
