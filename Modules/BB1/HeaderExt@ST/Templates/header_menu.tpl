{{! © 2017 NetSuite Inc. User may not copy, modify, distribute, or re-bundle or otherwise make available this code; provided, however, if you are an authorized user with a NetSuite account or log-in, you may use this code subject to the terms that govern your access and use. }}
<div class="header-menu-profile" data-view="Header.Profile"></div>
<nav class="header-menu-secondary-nav">
	<ul class="header-menu-level1">
		{{#each maincategories}} {{#if text}}
		<li {{#if categories}}data-toggle="categories-menu" {{/if}}>
			<a class="{{class}}" {{objectToAtrributes this}}>
					{{translate text}}
					</a> {{#if categories}}
			<ul class="header-menu-level-container">
				<li>
					<ul class="header-menu-level2 clearfix">
						{{#each categories}} {{#if subcat}}
					</ul>
					<ul id="{{id}}" class="header-menu-level3 clearfix">
						{{#each categories}}
						<li>
							<a class="{{class}}" {{objectToAtrributes this}}>{{translate text}}</a>
						</li>
						{{#if clearfix}}
						<div class="clearfix" style="width:100%"></div>
						{{/if}}
						{{/each}}
					</ul>
					<ul class="header-menu-level2 clearfix">{{else}}
						{{#if clearfix}}
						<li style="padding-right:0px;">
							{{else}}
							<li>
							{{/if}}
							{{#if subcatid}}
							<a class="{{class}}" data-action="show-subcat" data-subcat={{subcatid}}>
								<table class="chapter-table" cellspacing="0">
									<tr>
										<td class="chapter-table-icon-td">
											<img class="chapter-icon" src="/icons{{href}}.png" />
										</td>
										<td>
											{{translate text}}
										</td>
									</tr>
								</table>
							</a>
							{{else}}
							<a class="{{class}}" {{objectToAtrributes this}}><table class="chapter-table" cellspacing="0">
									<tr>
										<td class="chapter-table-icon-td">
											<img class="chapter-icon" src="/icons/go.png" />
										</td>
										<td>
											{{translate text}}
										</td>
									</tr>
								</table>
							</a> 
							{{/if}}
						</li>
						{{/if}} {{/each}}
					</ul>
				</li>
			</ul>
			{{/if}}
		</li>
		{{/if}} {{/each}}
	</ul>
</nav>

{{!---- Use the following context variables when customizing this template: categories (Array) showExtendedMenu (Boolean) showLanguages (Boolean) showCurrencies (Boolean) ----}}