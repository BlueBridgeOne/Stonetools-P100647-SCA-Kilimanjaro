{{!
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="facets-category-cell">
	{{#if hasImage}}
		
			<a href="{{url}}" class="facets-category-cell-anchor">
				<span class="facets-category-cell-thumbnail">
				<img src="{{resizeImage image 'homeslider'}}" alt="{{name}}" class="facets-category-cell-image">
				</span>
			</a>
	{{/if}}
	<div class="facets-category-cell-title">
		<a href="{{url}}" class="facets-category-cell-anchor">
			{{name}}
		</a>
	</div>
</div>


{{!----
The context variables for this template are not currently documented. Use the {{log this}} helper to view the context variables in the Console of your browser's developer tools.

----}}
