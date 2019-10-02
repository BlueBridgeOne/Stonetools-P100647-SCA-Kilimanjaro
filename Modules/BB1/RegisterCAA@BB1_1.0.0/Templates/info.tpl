{{#if companies}} {{#each companies}}
<div class="contactus-infotitle">
    {{#if location}}
    <i class="icon-flag"></i> {{location}} {{else}} {{name}} {{/if}}
</div>
<div class="contactus-infotext">
<div class="row">
    <div class="col-sm-7">
<p>Stonetools Ltd</p>
{{#if address_formatted}}
<p>{{{address_formatted}}}</p>
{{/if}}
{{#if vat}}
<p>{{translate 'VAT'}} {{vat}}</p>
{{/if}}
</div>
<div class="col-sm-5">
{{#if phone}}
<p>{{translate 'You can call us'}}</p>
<p><a href="tel:{{phone}}">{{phone}}</a></p>
{{/if}}
{{#if email}}
<p>{{translate 'Email'}} <a href="mailto:{{email}}">{{email}}</a></p>
{{/if}}
</div></div>
</div>
{{/each}} {{/if}}