{{!BB1 G Truslove Jan 2018}}
{{#if newparent}}
<div class="col-lg-1 col-md-2 col-sm-3 col-xs-4 shopwindow-cell">
	<a href="{{parenturl}}">
		<img src="{{resizeImage parenticon 'homecell'}}" alt="{{translate parent}}" class="shopwindow-parenticon" />
		<span class="shopwindow-parenttitle">{{translate parent}}</span>
</a>
</div>
{{/if}}
<div class="col-lg-1 col-md-2 col-sm-3 col-xs-4 shopwindow-cell">
	<a href="{{url}}">
	<img src="{{resizeImage thumbnail 'homecell'}}" class="shopwindow-image" alt={{name}} title={{name}} />
	<span class="shopwindow-title">{{translate name}}</span>
</a>
</div>