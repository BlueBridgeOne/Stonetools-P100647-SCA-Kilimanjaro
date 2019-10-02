{{!BB1 G Truslove 2017}}
<div class="cms-landing-page cms-content">
	<div class="cms-body">
		{{#if bannerimage}}
		<div class="page-title" style="background-image:url('/banners/{{bannerimage}}');"><h1>{{bannertext}}</h1></div>
		{{else}}
		<div class="page-title"><h1>{{bannertext}}</h1></div>
		{{/if}}
		
		<div data-cms-area="knowledgebase-list" data-cms-area-filters="path"></div>
		<div class="row">
			{{#if showSidebar}}
			<div class="col-md-3 hidden-sm">
				<div data-view="Sidebar"></div>
			</div>
			<div class="col-md-9 col-sm-12">
				{{else}}
				<div class="col-xs-12">
					{{/if}}
					{{#if empty}}
					<p>Sorry, we could not find any articles.</p>
					{{/if}}
					<div class="row articles-list" data-view="Articles.Collection"></div>
				</div>
			</div>
		</div>
	</div>