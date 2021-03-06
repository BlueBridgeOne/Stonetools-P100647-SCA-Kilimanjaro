{{!===========================================

   BB1 - G Truslove

   Date: Feb 2018

   ===========================================}}

<section class="contactus-container">
    <div class="page-title" style="background-image:url('/banners/banner-contact-us.jpg');"><h1>{{translate 'Credit Account Application'}}</h1>
        </div>
    
   
    <div class="col-md-7 col-sm-6 entry-form">
<div class="article-content">
<h2>{{translate 'Apply Today'}}</h2>
    <p>{{translate 'Stonetools offer credit terms of 30 days End of Month (EOM) to business customers. To apply for a credit account, complete the online application form below.'}}</p>
<p>If you would prefer to complete the application form offline and email back or print and post back, you can download a copy below.</p>
<a class="article-doc-link" href="/documents/other/Stonetools Ltd Account Opening Form (UK LTD).pdf" data-navigation="ignore-click"><i class="icon-pdf"></i> {{translate 'Limited Company Credit Account Application Form'}}</a>
<a class="article-doc-link" href="/documents/other/Stonetools Ltd Account Opening Form (UK ST PS).pdf" data-navigation="ignore-click"><i class="icon-pdf"></i> {{translate 'Sole Trader/Partnership Credit Account Application Form'}}</a>
</div>
<br />
    <small class="contactus-required">{{translate 'Required'}}*</small>

    <form class="contactus-form">
        <fieldset>
            {{#if usecompanies}}
            <div class="contactus-company" data-input="company" data-validation="control-group">
                <label for="company">{{translate 'Company'}}<small class="contactus-required">*</small></label>
                <span data-validation="control">
                    <input name="company" type="text" id="company" maxlength="50">
                </span>
                <p class="small" style="margin-bottom:10px;">{{translate '(Invoices will be billed to the company name)'}}</p>
            </div>
            {{/if}}
            <div class="contactus-firstname" data-input="firstname" data-validation="control-group">
                <label for="firstname">{{translate 'First Name'}}<small class="contactus-required">*</small></label>
                <span data-validation="control">
                    <input name="firstname" type="text" id="firstname" maxlength="30">
                </span>
            </div>
            <div class="contactus-lastname" data-input="lastname" data-validation="control-group">
                <label for="lastname">{{translate 'Last Name'}}<small class="contactus-required">*</small></label>
                <span data-validation="control">
                    <input name="lastname" type="text" id="lastname" maxlength="30">
                </span>
            </div>

            <div class="contactus-email" data-input="email" data-validation="control-group">
                <label for="email">{{translate 'Email'}}<small class="contactus-required">*</small></label>
                <span data-validation="control">
                    <input name="email" type="text" id="email" maxlength="100">
                </span>
            </div>
<div class="contactus-phone" data-input="phone" data-validation="control-group">
                <label for="phone">{{translate 'Telephone Number'}}<small class="contactus-required">*</small></label>
                <span data-validation="control">
                    <input name="phone" type="text" id="phone" maxlength="100">
                </span>
            </div>

            <div class="contactus-address" data-input="addr1" data-validation="control-group">
        <label class="address-edit-fields-group-label" for="addr1">
            {{translate 'Address'}} <span class="address-edit-fields-input-required">*</span>
        </label>
        <div  class="address-edit-fields-group-form-controls" data-validation="control">
            <input type="text" class="address-edit-fields-group-input" id="addr1" name="addr1" value="{{addressLine1}}">
        </div>
    </div>

    {{#if showAddressFormSecondAddress}}
    <div class="contactus-address2" data-input="addr2">
        <label for="addr2" class="address-edit-fields-addr2-optional-label">
            {{translate '(optional)'}}
        </label>
        <div>
            <input type="text" class="address-edit-fields-group-input" id="addr2" name="addr2" value="{{addressLine2}}">
        </div>
    </div>
    {{/if}}
    <div class="contactus-city" data-input="city" data-validation="control-group">
        <label class="address-edit-fields-group-label" for="city">
            {{translate 'City'}} <span class="address-edit-fields-input-required">*</span>
        </label>
        <div  class="address-edit-fields-group-form-controls" data-validation="control">
            <input type="text" class="address-edit-fields-group-input" id="city" name="city" value="{{city}}">
        </div>
    </div>

<div class="contactus-state" data-input="state" data-view="StatesView" data-validation="control-group">
    </div>

    <div class="contactus-zip" data-input="zip" data-validation="control-group">
        <label class="address-edit-fields-group-label" for="zip">
            {{translate 'Zip Code'}} <span class="address-edit-fields-input-required">*</span>
        </label>
        <div  class="address-edit-fields-group-form-controls" data-validation="control">
            <input type="text" class="address-edit-fields-group-input-zip" id="zip" name="zip" value="{{zip}}" data-type="zip">
        </div>
    </div>

    <div class="contactus-country" data-view="CountriesDropdown" data-input="country" data-validation="control-group">
    </div>


            <input name="host" type="hidden" id="host" value="{{host}}">
            <input name="formtype" type="hidden" id="formtype" value="REGISTERB2B">
        </fieldset>

<div class="article-content">
        <p>If approved, this application will create a contract between your company and Stonetools Ltd. Please carefully read the terms and conditions below.</p>
<ul>
<li><a href="/support/legal/credit-account-agreement">Credit Account Agreement</a></li>
<li><a href="/support/legal/terms-and-conditions">Terms and Conditions</a></li>
<li><a href="/support/legal/web-terms-and-conditions">Web Terms and Conditions</a></li>
<li><a href="/explore/stonetools-policies/privacy-policy">Privacy Policy</a></li>
</ul>
</div>

<input id="iagree" name="iagree" type="checkbox" value="IAgree" /> {{translate 'I Agree'}} <small class="input-required">*</small>
</p>

        <div class="contactus-button-container">
            <button class="contactus-button-submit" type="submit">{{translate 'Submit'}}</button>
        </div>

    </form>
</div>
<div class="col-md-5 col-sm-6" data-view="ContactUs.Info">
</div>
</section>