{{! © 2017 NetSuite Inc. User may not copy, modify, distribute, or re-bundle or otherwise make available this code; provided, however, if you are an authorized user with a NetSuite account or log-in, you may use this code subject to the terms that govern your access and use. }}
<div class="product-details-full">
	<div data-cms-area="item_details_banner" data-cms-area-filters="page_type"></div>
	<header class="product-details-full-header">
		<div id="banner-content-top" class="product-details-full-banner-top"></div>
	</header>
	<article class="product-details-full-content" itemscope itemtype="https://schema.org/Product">
		<meta itemprop="url" content="{{itemUrl}}">
		<div id="banner-details-top" class="product-details-full-banner-top-details"></div>
		<section class="product-details-full-main-content">
			<div class="product-details-full-content-header">
				<h1 class="product-details-full-content-header-title h1-title" itemprop="name">{{pageHeader}}</h1>
				<div class="product-details-full-rating" data-view="Global.StarRating"></div>
				<div data-cms-area="item_info" data-cms-area-filters="path"></div>
			</div>
			<div class="product-details-full-main-content-left">
				<div class="product-details-full-image-gallery-container">
					<div id="banner-image-top" class="content-banner banner-image-top"></div>
					<div data-view="Product.ImageGallery"></div>
					<div id="banner-image-bottom" class="content-banner banner-image-bottom"></div>
				</div>
			</div>
			<div class="product-details-full-main-content-right">
				<div class="product-details-full-main">
					{{#if isItemProperlyConfigured}}
					
						<section class="product-details-full-info">
							<div id="banner-summary-bottom" class="product-details-full-banner-summary-bottom"></div>
						</section>
						<!--Additional Information-->
						<div class="item-additional">
							{{#if additional.overview}}
							<button class="accordion accordionactive">{{translate 'Overview'}}<i class="accordion-icon"></i></button>
							<div class="accordion-panel article-content" style="display:block;">
								<p>{{{additional.overview}}}</p>
							</div>
							{{/if}} {{#if additional.features}}
							<button class="accordion accordionactive">{{translate 'Features'}}<i class="accordion-icon"></i></button>
							<div class="accordion-panel article-content" style="display:block;">
								<p>{{{additional.features}}}</p>
							</div>
							{{/if}} {{#if additional.included}}
							<button class="accordion">{{translate 'What&apos;s Included'}}<i class="accordion-icon"></i></button>
							<div class="accordion-panel article-content">
								<p>{{{additional.included}}}</p>
							</div>
							{{/if}} {{#if additional.techspecs}}
							<button class="accordion">{{translate 'Tech Spec'}}<i class="accordion-icon"></i></button>
							<div class="accordion-panel article-content">
								<p>{{{additional.techspecs}}}</p>
							</div>
							{{/if}} {{#if additional.instructions}}
							<button class="accordion">{{translate 'Instructions'}}<i class="accordion-icon"></i></button>
							<div class="accordion-panel article-content">
								<p>{{{additional.instructions}}}</p>
							</div>
							{{/if}} {{#if additional.safety}}
							<button class="accordion">{{translate 'Safety'}}<i class="accordion-icon"></i></button>
							<div class="accordion-panel article-content">
								<p>{{{additional.safety}}}</p>
							</div>
							{{/if}} {{#if additional.recommended}}
							<button class="accordion">{{translate 'Recommended Tool Sequences'}}<i class="accordion-icon"></i></button>
							<div class="accordion-panel article-content">
								<p>{{{additional.recommended}}}</p>
							</div>
							{{/if}}
						</div>



						
						{{else}}
					<div data-view="GlobalViewsMessageView.WronglyConfigureItem"></div>
					{{/if}}
				</div>
			</div>
			<div class="col-xs-12">

				<form id="product-details-full-form" data-action="submit-form" method="POST">
					{{#unless isMatrix}}
<section data-view="Product.Options"></section>

<div class="productoptionstable">
	<div class="productoptions-th-row{{wrapclass}}">
		<div class="productoptions-th-narrow">{{translate 'Code'}}</div>
		<div class="productoptions-th-wide pull-right">{{translate 'Quantity'}}</div>
		<div class="productoptions-th-wide pull-right">{{translate 'Stock'}}</div>
		<div class="productoptions-th pull-right">{{translate 'Price'}}</div>
	</div>
	
	<div class="productoptions-td-row">
		<div class="productoptions-td-narrow"><span class="productoptions-td-title">{{translate 'Code'}}<br /></span><div data-view="Product.Sku"></div></div>
		<div class="productoptions-td-wide pull-right">{{#if isPriceEnabled}}
						<span class="productoptions-td-title">{{translate 'Quantity'}}<br /></span><div data-view="Quantity"></div>{{/if}}</div>
		<div class="productoptions-td-wide pull-right"><span class="productoptions-td-title">{{translate 'Stock'}}<br /></span><div data-view="Product.Stock.Info"></div></div>
		<div class="productoptions-td pull-right"><span class="productoptions-td-title">{{translate 'Price'}}<br /></span><div data-view="Quantity.Pricing"></div><div data-view="Product.Price"></div></div>
	</div>

	<!-- Totals -->
	<div class="productoptions-foot-row">
		<div class="productoptions-td-wide"><span class="productoptions-td-titletext">{{translate 'Shipping'}}<br /></span>{{deliveryMessage}}
			<br />{{deliveryMessageTime}}</div>
	</div>

</div>

<!--Buttons -->
<div class="productoptions-buttons do-not-print">
	{{#if isPriceEnabled}}
	<div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 pull-right">
		<div data-view="MainActionView"></div>
	</div>
	<div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 pull-right">
		<div data-view="ProductDetails.AddToQuote" ></div>
	</div>
	<div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 pull-right">
		<div data-view="AddToProductList"></div>
	</div>
	{{/if}}
	<div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 pull-right">
		<div data-view="SocialSharing.Flyout" class="product-details-full-social-sharing"></div>
	</div>
</div>

						</div>
						{{/unless}}
					</form>
<!--Matrix Options -->
				<section data-view="Product.OptionsTable"></section>

</div>
</section>

	</article>
</div>
<div class="product-details-reviews-container do-not-print">
	<div class="product-details-reviews">
		<div data-view="ProductReviews.Center"></div>
	</div>
</div>
<div class="product-details-footer-container do-not-print">
	<div class="product-details-footer">
		<div class="product-details-full-content-related-items">
			<div data-view="Related.Items"></div>
		</div>
		<div class="product-details-full-content-correlated-items">
			<div data-view="Correlated.Items"></div>
		</div>
		<div id="banner-details-bottom" class="content-banner banner-details-bottom" data-cms-area="item_details_banner_bottom" data-cms-area-filters="page_type"></div>
	</div>
</div>
{{!---- Use the following context variables when customizing this template: model (Object) model.item (Object) model.item.internalid (Number) model.item.type (String) model.quantity (Number) model.options (Array) model.options.0 (Object) model.options.0.cartOptionId (String) model.options.0.itemOptionId (String) model.options.0.label (String) model.options.0.type (String) model.location (String) model.fulfillmentChoice (String) pageHeader (String) itemUrl (String) isItemProperlyConfigured (Boolean) isPriceEnabled (Boolean) ----}}