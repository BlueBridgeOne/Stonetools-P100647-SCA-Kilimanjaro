{{!=========================================== BB1 - G Truslove Date: Feb 2018 ===========================================}} {{#if companies}} {{#each companies}}
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
<!--
<table class="contactus-infotable">

    {{#if company}}
    <tr>
        <td class="contactus-infoiconwidth"></td>
        <td>
            <h3>{{company}}</h3></td>
    </tr>{{/if}} {{#if address}}
    <tr>
        <td class="contactus-infoiconwidth"><i class="icon-address"></i></td>
        <td>
            <p>{{{address}}}</p>
        </td>
    </tr>{{/if}}
    <tr>
        <td colspan="2">
            <hr class="contactus-breakline" />
        </td>
    </tr>
    {{#if phone}}
    <tr>
        <td class="contactus-infoiconwidth"><i class="icon-phone"></i></td>
        <td>
            <p>{{phone}}</p>
        </td>
    </tr>{{/if}}
    <tr>
        <td colspan="2">
            <hr class="contactus-breakline" />
        </td>
    </tr>
    <tr>
        <td></td>
        <td>
            <h3>{{translate 'Links'}}</h3></td>
    </tr>
    {{#if facebook}}
    <tr>
        <td class="contactus-infoiconwidth"><i class="icon-facebook"></i></td>
        <td>
            <p><a href="{{facebook}}">Facebook</a></p>
        </td>
    </tr>{{/if}} {{#if twitter}}
    <tr>
        <td class="contactus-infoiconwidth"><i class="icon-twitter"></i></td>
        <td>
            <p><a href="{{twitter}}">Twitter</a></p>
        </td>
    </tr>{{/if}} {{#if linkedin}}
    <tr>
        <td class="contactus-infoiconwidth"><i class="icon-linkedin"></i></td>
        <td>
            <p><a href="{{linkedin}}">LinkedIn</a></p>
        </td>
    </tr>{{/if}}
    <tr>
        <td colspan="2">
            <hr class="contactus-breakline" />
        </td>
    </tr>
</table>
-->