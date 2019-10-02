{{!BB1 G Truslove 2017}} {{#if endoftype}}
<div class="col-xs-12">
	<div class="articles-more-container"><a class="articles-more" href="{{typeurl}}"  style="color:{{colour}};border-color:{{colour}}" onMouseOver="this.style.color='white';this.style.backgroundColor='{{colour}}';" onMouseOut="this.style.backgroundColor='';this.style.color='{{colour}}';">{{translate 'View all'}} {{translate typetext}}</a></div>
</div>
{{/if}} {{#unless endoftype}} {{#if firsttype}}
<div class="clearfix"></div>
<div class="col-xs-12">
	<div class="articles-padding" style="border-top:1px solid {{lightcolour}};">
		{{#unless onlyonetype}}
		<h3 class="articles-type" style="color:{{colour}}">{{translate typetext}}</h3>
		{{/unless}}
	</div>
</div>
{{/if}} {{#if largebanner}}
{{#if pagewidth_full}}
<div class="col-xs-12">
	{{/if}} {{#if pagewidth_1third}}
	<div class="col-xs-6 col-sm-4 col-md-4">
		{{/if}} {{#if pagewidth_2thirds}}
		<div class="col-xs-12 col-sm-8 col-md-8">
			{{/if}}
			{{#if pagewidth_1quarter}}
		<div class="col-xs-6 col-sm-6 col-md-3 col-lg-3">
			{{/if}}
			{{#if pagewidth_1half}}
		<div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
			{{/if}}
			{{#if pagewidth_3quarters}}
		<div class="col-xs-12 col-sm-12 col-md-9 col-lg-9">
			{{/if}}
	<div class="articles-padding-banner">
		<a href="{{href}}" data-navigation="{{nav}}">
			<table class="articles-banner-table" style="background-color:{{colour}}">
				<tr>
					{{#if imageleft}}
					{{#if image}}
					<td class="articles-banner-image-td" style="background-image:url('{{resizeImage image 'homeslider'}}');">
					</td>
					{{/if}}
					{{/if}}
					<td class="articles-banner-td">
						
						<h2 class="articles-banner-title">{{name}}</h2>
					</td>
					{{#unless imageleft}}
					{{#if image}}
					<td class="articles-banner-image-td" style="background-image:url('{{resizeImage image 'homeslider'}}');">
					</td>
					{{/if}}
					{{/unless}}
				</tr>
			</table>
		</a>
	</div>
</div>
{{/if}} {{#if mediumimage}}
{{#if pagewidth_full}}
<div class="col-xs-12">
	{{/if}} {{#if pagewidth_1third}}
	<div class="col-xs-6 col-sm-4 col-md-4">
		{{/if}} {{#if pagewidth_2thirds}}
		<div class="col-xs-12 col-sm-8 col-md-8">
			{{/if}}
			{{#if pagewidth_1quarter}}
		<div class="col-xs-6 col-sm-6 col-md-3 col-lg-3">
			{{/if}}
			{{#if pagewidth_1half}}
		<div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
			{{/if}}
			{{#if pagewidth_3quarters}}
		<div class="col-xs-12 col-sm-12 col-md-9 col-lg-9">
			{{/if}}
	<div class="articles-padding fixedheight">
		<a class="fixedheightbody" href="{{href}}" data-navigation="{{nav}}" onMouseOver="this.style.color='{{colour}}';" onMouseOut="this.style.color='';">
			<div class="articles-image-box" style="background-color:{{colour}};background-image:url('{{resizeImage image 'thumbnail'}}');"></div>
			<h5 class="articles-image-title">{{name}}</h5>
		</a>
		<div class="fixedheightspacer"></div>
	</div>
</div>
{{/if}} {{#if standard}} {{#if firstpriority}}
<div class="clearfix"></div>{{/if}}
{{#if pagewidth_full}}
<div class="col-xs-12">
	{{/if}} {{#if pagewidth_1third}}
	<div class="col-xs-6 col-sm-4 col-md-4">
		{{/if}} {{#if pagewidth_2thirds}}
		<div class="col-xs-12 col-sm-8 col-md-8">
			{{/if}}
			{{#if pagewidth_1quarter}}
		<div class="col-xs-6 col-sm-6 col-md-3 col-lg-3">
			{{/if}}
			{{#if pagewidth_1half}}
		<div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
			{{/if}}
			{{#if pagewidth_3quarters}}
		<div class="col-xs-12 col-sm-12 col-md-9 col-lg-9">
			{{/if}}
	<div class="articles-standard-link fixedheight">
		<a class="fixedheightbody" href="{{href}}" data-navigation="{{nav}}" onMouseOver="this.style.color='{{colour}}';this.style.backgroundColor='{{lightestcolour}}';" onMouseOut="this.style.color='';this.style.backgroundColor='';">
		<span style="color:{{colour}};"><i class="articles-check-icon"></i></span> {{name}}</a>
		<div class="fixedheightspacer"></div>
	</div>
</div>
{{/if}} {{#if archive}} {{#if firstpriority}}
<div class="clearfix"></div>{{/if}}
{{#if pagewidth_full}}
<div class="col-xs-12">
	{{/if}} {{#if pagewidth_1third}}
	<div class="col-xs-6 col-sm-4 col-md-4">
		{{/if}} {{#if pagewidth_2thirds}}
		<div class="col-xs-12 col-sm-8 col-md-8">
			{{/if}}
			{{#if pagewidth_1quarter}}
		<div class="col-xs-6 col-sm-6 col-md-3 col-lg-3">
			{{/if}}
			{{#if pagewidth_1half}}
		<div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
			{{/if}}
			{{#if pagewidth_3quarters}}
		<div class="col-xs-12 col-sm-12 col-md-9 col-lg-9">
			{{/if}}
	<div class="articles-standard-link fixedheight">
		<a class="fixedheightbody" href="{{href}}" data-navigation="{{nav}}" onMouseOver="this.style.color='{{colour}}';this.style.backgroundColor='{{lightestcolour}}';" onMouseOut="this.style.color='';this.style.backgroundColor='';">
		<span style="color:{{colour}};"><i class="articles-check-icon"></i></span> {{name}}</a>
		<div class="fixedheightspacer"></div>
</div>
{{/if}} 

{{#if search}} {{#if firstpriority}}
<div class="clearfix"></div>{{/if}}

<div class="col-xs-12">
	<div class="articles-standard-link fixedheight">
		<a class="fixedheightbody" href="{{href}}" data-navigation="{{nav}}" onMouseOver="this.style.color='{{colour}}';this.style.backgroundColor='{{lightestcolour}}';" onMouseOut="this.style.color='';this.style.backgroundColor='';">
		<span style="color:{{colour}};"><i class="articles-search-icon"></i></span> {{name}}
		<p class="article-search-text">{{content}}</p></a>
		<div class="fixedheightspacer"></div>
	</div>
</div>
{{/if}}

{{#if homepagebanner}} {{#if pagewidth_full}}
<div class="col-xs-12">
{{/if}} {{#if pagewidth_1third}}
<div class="col-xs-6 col-sm-4 col-md-4">
{{/if}} {{#if pagewidth_2thirds}}
<div class="col-xs-12 col-sm-8 col-md-8">
{{/if}} {{#if pagewidth_1quarter}}
<div class="col-xs-6 col-sm-6 col-md-3 col-lg-3">
{{/if}} {{#if pagewidth_1half}}
<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
{{/if}} {{#if pagewidth_3quarters}}
<div class="col-xs-12 col-sm-12 col-md-9 col-lg-9">
{{/if}}
<div class="articles-padding-home">
   <a href="{{href}}" data-navigation="{{nav}}">
      <div class="articles-banner-home">
         {{#if image}}
         <div class="articles-banner-home-image article-parallax" data-bgimage="{{image}}">
            {{else}}
            <div>
               {{/if}}
               <div class="articles-banner-home-content" style="background-color:{{colour}};background-color:{{colour}}CC;">
                  
                  <h2 class="articles-banner-title">{{name}}</h2>
                  <div class="articles-home-content">{{{content}}}</div>
                  {{#if buttontext}}
   <a href="{{href}}" data-navigation="{{nav}}" class="button-article-banner">{{buttontext}}</a> {{/if}}
   </div>
   </div>
   </div>
   </a>
   </div>
</div>
{{/if}}{{#if homepagetext}} {{#if pagewidth_full}}
<div class="col-xs-12">
{{/if}} {{#if pagewidth_1third}}
<div class="col-xs-6 col-sm-4 col-md-4">
{{/if}} {{#if pagewidth_2thirds}}
<div class="col-xs-12 col-sm-8 col-md-8">
{{/if}} {{#if pagewidth_1quarter}}
<div class="col-xs-6 col-sm-6 col-md-3 col-lg-3">
{{/if}} {{#if pagewidth_1half}}
<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
{{/if}} {{#if pagewidth_3quarters}}
<div class="col-xs-12 col-sm-12 col-md-9 col-lg-9">
   {{/if}}
   <div class="articles-padding-home">
      {{#unless buttontext}}
      <a href="{{href}}" data-navigation="{{nav}}">
         {{/unless}}
          {{#if pagewidth_full}}
<div>
{{/if}} {{#if pagewidth_1third}}
<div class="articles-banner-text-medium">
{{/if}} {{#if pagewidth_2thirds}}
<div>
{{/if}} {{#if pagewidth_1quarter}}
<div class="articles-banner-text-small">
{{/if}} {{#if pagewidth_1half}}
<div class="articles-banner-text-medium">
{{/if}} {{#if pagewidth_3quarters}}
<div>
   {{/if}}
         <table class="articles-banner-table" style="background-color:{{colour}}">
            <tr>
               <td class="articles-banner-text-td">
                 
                  <h2 class="articles-banner-text-title">{{name}}</h2>
                  <div class="articles-home-content">{{{content}}}</div>
              
               </td>
               {{#if image}}
               <td class="articles-banner-text-image-td articles-banner-td-right">
                  <div class="articles-banner-text-image-td-box article-parallax" data-bgimage="{{image}}">
                     {{#if buttontext}}
      <a href="{{href}}" data-navigation="{{nav}}" class="button-article">{{buttontext}}</a> {{/if}}
      </div>
      </td>
      {{/if}} {{#unless image}} {{#if buttontext}}
      <td class="articles-banner-text-image-td articles-banner-td-right">
      <div class="articles-banner-text-image-td-box">
      {{#if buttontext}}
      <a href="{{href}}" data-navigation="{{nav}}" class="button-article">{{buttontext}}</a> {{/if}}
      </div>
      </td>
      {{/if}} {{/unless}}
      </tr>
      <tr class="articles-banner-tr-bottom">
      {{#if image}}
      <td class="articles-banner-text-image-td articles-banner-td-bottom">
      <div class="articles-banner-text-image-td-box article-parallax" data-bgimage="{{image}}">
      {{#if buttontext}}
      <a href="{{href}}" data-navigation="{{nav}}" class="button-article">{{buttontext}}</a> {{/if}}
      </div>
      </td>
      {{/if}} {{#unless image}} {{#if buttontext}}
      <td class="articles-banner-text-image-td">
      <div class="articles-banner-text-image-td-box articles-banner-td-bottom">
      {{#if buttontext}}
      <a href="{{href}}" data-navigation="{{nav}}" class="button-article">{{buttontext}}</a> {{/if}}
      </div>
      </td>
      {{/if}} {{/unless}}
      </tr>
      </table>
      </div>
      {{#unless buttontext}}
      </a>
      {{/unless}}
   </div>
</div>
{{/if}} {{#if homepageimage}} {{#if pagewidth_full}}
<div class="col-xs-12">
{{/if}} {{#if pagewidth_1third}}
<div class="col-xs-6 col-sm-4 col-md-4">
{{/if}} {{#if pagewidth_2thirds}}
<div class="col-xs-12 col-sm-8 col-md-8">
{{/if}} {{#if pagewidth_1quarter}}
<div class="col-xs-6 col-sm-6 col-md-3 col-lg-3">
{{/if}} {{#if pagewidth_1half}}
<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
{{/if}} {{#if pagewidth_3quarters}}
<div class="col-xs-12 col-sm-12 col-md-9 col-lg-9">
{{/if}}
<div class="articles-padding-home">
   <a href="{{href}}" data-navigation="{{nav}}">
      <div class="articles-banner-image-home" onMouseOver="this.style.border='1px solid {{lightestcolour}}';" onMouseOut="this.style.border='';">
         {{#if image}}
         <div class="articles-banner-home-image article-parallax" data-bgimage="{{image}}">
            {{else}}
            <div>
               {{/if}}
               <div class="articles-home-content">{{{content}}}</div>
               {{#if buttontext}}
               <br />
   <a href="{{href}}" data-navigation="{{nav}}" class="button-article-banner">{{buttontext}}</a> {{/if}}
   </div>
   </div>
   </a>
   </div>
</div>
{{/if}}


{{/unless}}