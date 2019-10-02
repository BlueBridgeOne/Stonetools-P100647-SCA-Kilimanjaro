{{!BB1 G Truslove 2017 - Article}}
<style>
/* These are all the colour accents in the articles*/
	hr,.article-button{background-color:{{lightcolour}};}
	.cell-number,.article-button:hover{background-color:{{colour}};}
	.sidebar-content{background-color:{{lightestcolour}};border-top:1px solid {{lightcolour}};border-bottom:1px solid {{lightcolour}};}
	.article-header{border-top:1px solid {{lightcolour}};border-bottom:1px solid {{lightcolour}};}
	.article-doc-link{background-color: {{lightestcolour}};display:block;font-weight:bold;font-size:18px;padding:$sc-padding-lv3 $sc-padding-lv3;color:$sc-color-copy;margin-bottom:$sc-margin-lv2;}
  .article-doc-link:hover,.medium-image a:hover,.small-image a:hover,.large-image a:hover{color:{{colour}};}
 .articles-standard-link:hover a{background-color:{{lightestcolour}};color:{{colour}};}
  .article-doc-link i,.articles-go-icon,.product-views-price-lead{
  color:{{colour}};
  }
</style>
<div class="cms-landing-page cms-content">
	<div class="cms-body">
		<div data-cms-area="knowledgebase-list" data-cms-area-filters="path"></div>
		<div class="row">
			{{#if showSidebar}}
			<div class="col-md-3 hidden-sm do-not-print">
				<div data-view="Sidebar"></div>
			</div>
			<div class="col-md-9 col-sm-12 sidebar-article">
				{{else}}
<div class="col-xs-12">
				{{/if}}
				<div class="article-header">
				<!--<p class="articles-header-type" itemprop="about">{{translate typetext}}</p>-->
				<h1 class="articles-header-title" itemprop="name">{{name}}</h1>
<div data-view="SocialSharing.Flyout" class="product-details-full-social-sharing-right do-not-print"></div>
						</div>
				{{#if image}}
							<img class="article-header-img" itemprop="image" src="{{image}}" />
						
						{{/if}}
						
				
				<div class="article-content-container">
				<div class="article-content" itemprop="articleBody">
					{{{content}}}
				</div>
			</div>
				{{#if hasrelatedarticles}}
				<div class="article-related-container do-not-print" style="border-top:1px solid {{lightcolour}};">
					<h3 class="article-related-title" style="color:{{colour}};">{{translate 'Related'}}</h3>
					<div class="row">
						{{#each relatedarticles}}
						<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
							<div class="articles-standard-link" onMouseOver="this.style.backgroundColor='{{lightestcolour}}';"
   onMouseOut="this.style.backgroundColor='';">
			<a href="{{this.href}}" data-navigation="{{nav}}"><i class="articles-go-icon"></i> {{this.name}}</a>
							</div>
						</div>
						{{/each}}
					</div>
				</div>
				{{/if}} {{#if hasrelateditems}}
				<div class="article-related-container do-not-print" style="border-top:1px solid {{lightcolour}};">
					<h3 class="article-related-title" style="color:{{colour}};">{{translate 'Products You Might Need'}}</h3>
					<div data-view="Related.Items" class="cart-detailed-related"></div>
				</div>
				{{/if}}
			</div>
		</div>
	</div>
</div>