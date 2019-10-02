{{!BB1 G Truslove 2017 Article Sidebar}}
{{#if relatedcontent}}
<div class="sidebar-content article-content">
	{{{relatedcontent}}}
</div>
{{/if}}

<div class="sidebar">
	<button data-type="{{type}}"
		class="accordion-grey {{#unless startclosed}}accordionactive{{/unless}}">{{translate 'Search Articles'}}<i
			class="accordion-icon"></i></button>
	<div class="sidebar-ul sidebar-search-ul">
		<div class="sidebar-li sidebar-search-box">
			<ul class="list-inline">
				<li style="width:32px;"><i class="sidebar-search-icon"></i></li>
				<li style="width:100%;"><input data-type="article-input" type="text" class="sidebar-search-input"
						value="{{query}}" /></li>
			</ul>
		</div>
	</div>
	{{#each collection}} {{#if endoftype}}
	<div class="sidebar-li"><a class="sidebar-link sidebar-link-viewall" href="{{href}}"
			data-navigation="{{nav}}">{{translate 'View All'}} <i class="sidebar-viewall-icon"></i></a></div>
</div>
<div class="sidebar-line"></div>
{{/if}} {{#unless endoftype}} {{#if firsttype}}
<button data-type="{{type}}"
	class="accordion-grey {{#unless startclosed}}accordionactive{{/unless}}">{{translate typetext}}<i
		class="accordion-icon"></i></button>
<div class="sidebar-ul" {{#if startclosed}} style="display:none" {{/if}}>
	{{/if}}
	<div class="sidebar-li"><a class="sidebar-link" href="{{href}}" data-navigation="{{nav}}">{{name}}</a></div>
	{{/unless}} {{/each}}


<button data-type="Keywords"
		class="accordion-grey {{#unless startkeywordsclosed}}accordionactive{{/unless}}">{{translate 'Keywords'}}<i
			class="accordion-icon"></i></button>
	<div class="sidebar-ul" {{#if startkeywordsclosed}} style="display:none" {{/if}}>
		<div class="sidebar-li sidebar-keyword-box">
		{{#each keywords}}
		<a href="{{url}}" class="sidebar-keyword">{{name}}</a>
		{{/each}}
		</div>
	</div>
<div class="sidebar-line"></div>
</div>
</div>