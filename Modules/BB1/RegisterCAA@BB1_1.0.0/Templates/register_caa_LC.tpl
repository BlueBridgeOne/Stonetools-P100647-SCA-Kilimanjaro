<small class="contactus-required">{{translate 'Required'}}*</small>

<form class="contactus-limited-company-form">


    <fieldset>
        <legend>Registered Company Information</legend>
        <div class="contactus-company" data-input="company" data-validation="control-group">
            <label for="company">
                {{translate 'Company Name'}}
                <small class="contactus-required">&nbsp;*</small>
            </label>
            <span data-validation="control">
                <input name="company" type="text" id="company" maxlength="50">
            </span>
        </div>


        <div class="contactus-tradingname" data-input="tradingname" data-validation="control-group">
            <label for="tradingname">{{translate 'Trading Name'}}</label>
            <span data-validation="control">
                <input name="tradingname" type="text" id="tradingname" maxlength="50">
            </span>
        </div>
    </fieldset>


    <fieldset>
        <legend>Registered Address</legend>

        <div class="contactus-address" data-input="primaryaddress_addr1" data-validation="control-group">
            <label class="address-edit-fields-group-label" for="primaryaddress_addr1">
                {{translate 'Address Line 1'}}
                <small class="contactus-required">&nbsp;*</small>
            </label>
            <div class="address-edit-fields-group-form-controls" data-validation="control">
                <input type="text" class="address-edit-fields-group-input" id="primaryaddress_addr1" name="primaryaddress_addr1">
            </div>
        </div>

        <div class="contactus-city" data-input="primaryaddress_city" data-validation="control-group">
            <label class="address-edit-fields-group-label" for="primaryaddress_city">
                {{translate 'City'}}
                <small class="contactus-required">&nbsp;*</small>
            </label>
            <div class="address-edit-fields-group-form-controls" data-validation="control">
                <input type="text" class="address-edit-fields-group-input" id="primaryaddress_city" name="primaryaddress_city">
            </div>
        </div>

        <div class="contactus-state" data-input="primaryaddress_state" data-view="StatesView">
        </div>

        <div class="contactus-zip" data-input="primaryaddress_zip" data-validation="control-group">
            <label class="address-edit-fields-group-label" for="primaryaddress_zip">
                {{translate 'Zip Code'}}
                <small class="contactus-required">&nbsp;*</small>
            </label>
            <div class="address-edit-fields-group-form-controls" data-validation="control">
                <input type="text" class="address-edit-fields-group-input-zip" id="primaryaddress_zip" name="primaryaddress_zip"  data-type="zip">
            </div>
        </div>

        <div class="contactus-country" data-view="CountriesDropdown" data-input="country" data-validation="control-group">
        </div>

        <div class="contactus-registrationnumber" data-input="registrationnumber" data-validation="control-group">
            <label for="registrationnumber">{{translate 'Company Registration Number'}}
                <small class="contactus-required">&nbsp;*</small>
            </label>
            <span data-validation="control">
                <input name="registrationnumber" type="text" id="registrationnumber" maxlength="30">
            </span>
        </div>

        <div class="contactus-vatnumber" data-input="vatnumber" data-validation="control-group">
            <label for="vatnumber">{{translate 'VAT Number'}}
                <small class="contactus-required">&nbsp;*</small>
            </label>
            <span data-validation="control">
                <input name="vatnumber" type="text" id="vatnumber" maxlength="30">
            </span>
        </div>

        <div class="contactus-phone" data-input="phone" data-validation="control-group">
            <label for="phone">{{translate 'Telephone Number'}}
                <small class="contactus-required">&nbsp;*</small>
            </label>
            <span data-validation="control">
                <input name="phone" type="text" id="phone" maxlength="100">
            </span>
        </div>

        <div class="contactus-generalemailaddress" data-input="generalemailaddress" data-validation="control-group">
            <label for="generalemailaddress">{{translate 'General Email Address'}}
                <small class="contactus-required">&nbsp;*</small>
            </label>
            <span data-validation="control">
                <input name="generalemailaddress" type="text" id="generalemailaddress" maxlength="100">
            </span>
        </div>

        <div class="contactus-companywebsite" data-input="companywebsite" data-validation="control-group">
            <label for="companywebsite">{{translate 'Company Website'}}
            </label>
            <div>
                <span data-validation="control">
                    <input name="companywebsite" type="text" id="companywebsite" maxlength="100">
                </span>
            </div>
        </div>
    </fieldset>



    <fieldset>
        <legend>Default Billing Address</legend>
        <div class="contactus-defaultbillingaddress" data-input="billingaddress_checkbox" data-validation="control-group">
            <label for="billingaddress_checkbox">{{translate 'Your Default Registered Address is where billing correspondence will be sent. Please check the box below if your billing address is different to your registered address.'}}
            </label>
            <span data-validation="control">
                <input name="billingaddress_checkbox" type="checkbox" value="false" id="defaultbillingaddress">
            </span>
        </div>
        

        <div class="contactus-address defaultbillingaddress" data-input="billingaddress_addr1" data-validation="control-group">
            <label class="address-edit-fields-group-label" for="billingaddress_addr1">
                {{translate 'Address'}}
                <small class="contactus-required">&nbsp;*</small>
            </label>
            <div class="address-edit-fields-group-form-controls" data-validation="control">
                <input type="text" class="address-edit-fields-group-input" id="billingaddress_addr1" name="billingaddress_addr1">
            </div>
        </div>

        <div class="contactus-city defaultbillingaddress" data-input="billingaddress_city" data-validation="control-group">
            <label class="address-edit-fields-group-label" for="billingaddress_city">
                {{translate 'City'}}
                <small class="contactus-required">&nbsp;*</small>
            </label>
            <div class="address-edit-fields-group-form-controls" data-validation="control">
                <input type="text" class="address-edit-fields-group-input" id="billingaddress_city" name="billingaddress_city">
            </div>
        </div>

        <div class="contactus-state defaultbillingaddress" data-input="billingaddress_state" data-view="StatesView" data-validation="control-group">
        </div>

        <div class="contactus-zip defaultbillingaddress" data-input="billingaddress_zip" data-validation="control-group">
            <label class="address-edit-fields-group-label" for="billingaddress_zip">
                {{translate 'Zip Code'}}
                <small class="contactus-required">&nbsp;*</small>
            </label>
            <div class="address-edit-fields-group-form-controls" data-validation="control">
                <input type="text" class="address-edit-fields-group-input-zip" id="billingaddress_zip" name="billingaddress_zip" data-type="zip">
            </div>
        </div>

        <div class="contactus-country defaultbillingaddress" data-view="CountriesDropdown" data-input="billingaddress_zip" data-validation="control-group">
        </div>
    </fieldset>



    <fieldset>
        <legend>Default Shipping Address</legend>
        <div class="contactus-defaultshippingaddress" data-input="shippingaddress_checkbox" data-validation="control-group">
            <label for="shippingaddress_checkbox">{{translate 'Your Default Registered Address is where most shipments are delivered. Please check the box below if your shipping address is different to your registered address.'}}
            </label>
            <span data-validation="control">
                <input name="shippingaddress_checkbox" type="checkbox" value="false" id="defaultshippingaddress">
            </span>
        </div>
        

        <div class="contactus-address defaultshippingaddress" data-input="shippingaddress_addr1" data-validation="control-group">
            <label class="address-edit-fields-group-label" for="shippingaddress_addr1">
                {{translate 'Address'}}
                <small class="contactus-required">&nbsp;*</small>
            </label>
            <div class="address-edit-fields-group-form-controls" data-validation="control">
                <input type="text" class="address-edit-fields-group-input" id="shippingaddress_addr1" name="shippingaddress_addr1">
            </div>
        </div>

        <div class="contactus-city defaultshippingaddress" data-input="shippingaddress_city" data-validation="control-group">
            <label class="address-edit-fields-group-label" for="shippingaddress_city">
                {{translate 'City'}}
                <small class="contactus-required">&nbsp;*</small>
            </label>
            <div class="address-edit-fields-group-form-controls" data-validation="control">
                <input type="text" class="address-edit-fields-group-input" id="shippingaddress_city" name="shippingaddress_city">
            </div>
        </div>

        <div class="contactus-state defaultshippingaddress" data-input="shippingaddress_state" data-view="StatesView" data-validation="control-group">
        </div>

        <div class="contactus-zip defaultshippingaddress" data-input="shippingaddress_zip" data-validation="control-group">
            <label class="address-edit-fields-group-label" for="shippingaddress_zip">
                {{translate 'Zip Code'}}
                <small class="contactus-required">&nbsp;*</small>
            </label>
            <div class="address-edit-fields-group-form-controls" data-validation="control">
                <input type="text" class="address-edit-fields-group-input-zip" id="shippingaddress_zip" name="shippingaddress_zip" data-type="zip">
            </div>
        </div>

        <div class="contactus-country defaultshippingaddress" data-view="CountriesDropdown" data-input="shippingaddress_zip" data-validation="control-group">
        </div>
    </fieldset>


    <fieldset>
        <legend>{{translate 'Company Director(s)'}}<small class="contactus-required">&nbsp;*</small></legend>
        <div class="panel panel-default">
            <div class="panel-body">
                <div id="company-directors-fields-container"></div>
                <div class="row">
                    <div class="col-sm-12 col-md-5 nopadding">
                        <div data-input="director_firstname" data-validation="control-group">
                            <span data-validation="control">
                                <input type="text" class="form-control full-width" name="director_firstname" id="director_firstname" placeholder="First name" maxlength="100">
                            </span>
                        </div>
                    </div>
                    <div class="col-sm-12 col-md-5 nopadding">
                        <div data-input="director_lastname" data-validation="control-group">
                            <span data-validation="control">
                                <input type="text" class="form-control full-width" name="director_lastname" id="director_lastname" placeholder="Last name" maxlength="100">
                            </span>
                        </div>
                    </div>
                    <div class="col-sm-12 col-md-2">
                        <button class="btn btn-success add_fields" type="button" data-companydirectors="company-directors-fields-container">
                            <span class="fa-plus" aria-hidden="true"></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </fieldset>


    <fieldset>
        <legend>{{translate 'Authorised Purchasers'}}<small class="contactus-required">&nbsp;*</small></legend>
        <div class="panel panel-default">
            <div class="panel-body">
                <div id="authorised-purchasers-fields-container"></div>
                <div class="row">
                    <div class="col-sm-12 col-md-3 nopadding">
                        <div data-input="authorisedpurchasers_firstname" data-validation="control-group">
                            <span data-validation="control">
                                <input type="text" class="form-control full-width" name="authorisedpurchasers_firstname" id="authorisedpurchasers_firstname" placeholder="First name" maxlength="100">
                            </span>
                        </div>
                    </div>
                    <div class="col-sm-12 col-md-3 nopadding">
                        <div data-input="authorisedpurchasers_lastname" data-validation="control-group">
                            <span data-validation="control">
                                <input type="text" class="form-control full-width" name="authorisedpurchasers_lastname" id="authorisedpurchasers_lastname" placeholder="Last name" maxlength="100">
                            </span>
                        </div>
                    </div>
                    <div class="col-sm-12 col-md-4 nopadding">
                        <div data-input="authorisedpurchasers_email" data-validation="control-group">
                            <span data-validation="control">
                                <input type="text" class="form-control full-width" name="authorisedpurchasers_email" id="authorisedpurchasers_email" placeholder="Email">
                            </span>
                        </div>
                    </div>
                    <div class="col-sm-12 col-md-2 nopadding">
                        <button class="btn btn-success add_fields" type="button" data-authorisedpurchasers="authorised-purchasers-fields-container">
                            <span class="fa-plus" aria-hidden="true"></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </fieldset>


    <fieldset>
        <legend>{{translate 'Accounts Receivable Contact Details'}}</legend>
        <label for="firstname">
            {{translate 'First Name'}}
            <small class="contactus-required">&nbsp;*</small>
        </label>
        <div data-input="arcd_firstname" data-validation="control-group" class="contactus-general">
            <span data-validation="control">
                <input type="text" name="arcd_firstname" id="arcd_firstname" />
            </span>
        </div>
        <label for="lastname">
            {{translate 'Last Name'}}
            <small class="contactus-required">&nbsp;*</small>
        </label>
        <div data-input="arcd_lastname" data-validation="control-group" class="contactus-general" >
            <span data-validation="control">
                <input type="text" name="arcd_lastname" id="arcd_lastname" />
            </span>
        </div>
        <label for="phone">
            {{translate 'Telephone Number'}}
            <small class="contactus-required">&nbsp;*</small>
        </label>
        <div data-input="arcd_phone" data-validation="control-group" class="contactus-general">
            <span data-validation="control">
                <input type="text" name="arcd_phone" id="arcd_phone" />
            </span>
        </div>
        <label for="email">
            {{translate 'Email Address'}}
            <small class="contactus-required">&nbsp;*</small>
        </label>
        <div data-input="arcd_email" data-validation="control-group" class="contactus-general">
            <span data-validation="control">
                <input type="text" name="arcd_email" id="arcd_email" />
            </span>
        </div>
        <label for="po">
            {{translate 'Do you use Purchase Order Numbers?'}}
        </label>
        <div data-input="arcd_po" data-validation="control-group" class="contactus-general">
            <input type="checkbox" name="arcd_po" id="arcd_po" value="false" class="checkbox-no-min-width"/>
        </div>
    </fieldset>



    <fieldset>
        <legend>{{translate 'Trade Reference 1'}}</legend>

        <div data-input="tr_businessname" data-validation="control-group" class="contactus-general">
            <label for="businessname">
                {{translate 'Business Name'}}
                <small class="contactus-required">&nbsp;*</small>
            </label>
            <span data-validation="control">
                <input type="text" name="tr_businessname" id="tr_businessname" />
            </span>
        </div>

        <div data-input="tr_firstname" data-validation="control-group" class="contactus-general">
            <label for="firstname">
                {{translate 'Contact First Name'}}
                <small class="contactus-required">&nbsp;*</small>
            </label>
            <span data-validation="control">
                <input type="text" name="tr_firstname" id="tr_firstname" />
            </span>
        </div>

        <div data-input="tr_lastname" data-validation="control-group" class="contactus-general" >
            <label for="lastname">
                {{translate 'Contact Last Name'}}
                <small class="contactus-required">&nbsp;*</small>
            </label>
            <span data-validation="control">
                <input type="text" name="tr_lastname" id="tr_lastname" />
            </span>
        </div>

        <div data-input="tr_phone" data-validation="control-group" class="contactus-general">
            <label for="phone">
                {{translate 'Telephone Number'}}
                <small class="contactus-required">&nbsp;*</small>
            </label>
            <span data-validation="control">
                <input type="text" name="tr_phone" id="tr_phone" />
            </span>
        </div>
    </fieldset>


    <fieldset>
        <legend>{{translate 'Trade Reference 2'}}</legend>

        <div data-input="tr_businessname" data-validation="control-group" class="contactus-general">
            <label for="businessname">
                {{translate 'Business Name'}}
                <small class="contactus-required">&nbsp;*</small>
            </label>
            <span data-validation="control">
                <input type="text" name="tr_businessname" id="tr_businessname" />
            </span>
        </div>


        <div data-input="tr_firstname" data-validation="control-group" class="contactus-general">
            <label for="firstname">
                {{translate 'Contact First Name'}}
                <small class="contactus-required">&nbsp;*</small>
            </label>
            <span data-validation="control">
                <input type="text" name="tr_firstname" id="tr_firstname" />
            </span>
        </div>


        <div data-input="tr_lastname" data-validation="control-group" class="contactus-general" >
            <label for="lastname">
                {{translate 'Contact Last Name'}}
                <small class="contactus-required">&nbsp;*</small>
            </label>
            <span data-validation="control">
                <input type="text" name="tr_lastname" id="tr_lastname" />
            </span>
        </div>


        <div data-input="tr_phone" data-validation="control-group" class="contactus-general">
            <label for="phone">
                {{translate 'Telephone Number'}}
                <small class="contactus-required">&nbsp;*</small>
            </label>
            <span data-validation="control">
                <input type="text" name="tr_phone" id="tr_phone" />
            </span>
        </div>
    </fieldset>

    



    <fieldset>
        <legend>Requested Credit Limit (GBP)</legend>
        <div class="contactus-general" data-validation="control-group">
            <label for="requestedcreditlimit">{{translate 'Requested Credit Limit (GBP)'}}
                <small class="contactus-required">*</small>
            </label>
            <span data-validation="control">
                <input type="number" value="0" min="0" step="0.01" data-number-to-fixed="2" data-number-stepfactor="100" id="requested_credit" name="requested_credit"/>
            </span>
        </div>
    </fieldset>




    <p>
        DATA PROTECTION ACT: We require your consent to request the trade references you have given us. 
        By submitting this application form you are providing permission for Stonetools Ltd to approach the 
        trade references supplied for information regarding the credit account you hold.
    </p>




    <div class="article-content">
        <p>
            If approved, this application will create a contract between your company and Stonetools Ltd. Please carefully read
            the terms and conditions below.
        </p>
        <ul>
            <li>
                <a href="/support/legal/credit-account-agreement">Credit Account Agreement</a>
            </li>
            <li>
                <a href="/support/legal/terms-and-conditions">Terms and Conditions</a>
            </li>
            <li>
                <a href="/support/legal/web-terms-and-conditions">Web Terms and Conditions</a>
            </li>
            <li>
                <a href="/explore/stonetools-policies/privacy-policy">Privacy Policy</a>
            </li>
        </ul>
        <p>
            We want you to know exactly how our service works and why we need the details requested above.
        </p>
        <p>
            I have read and accept Stonetools Ltd Credit Account Agreement, General Terms and Conditions, Web Terms and Conditions and Privacy Policy.
        </p>
    </div>

    <input id="iagree" name="iagree" type="checkbox" value="IAgree" /> {{translate 'I Agree'}}
    <small class="input-required">*</small>



    <fieldset>
        <legend>{{translate 'Confirmation Agreement'}}</legend>

        <label for="firstname">
            {{translate 'First Name'}}
            <small class="contactus-required">&nbsp;*</small>
        </label>
        <div data-input="confirmation_firstname" data-validation="control-group" class="contactus-general">
            <span data-validation="control">
                <input type="text" name="confirmation_firstname" id="confirmation_firstname" />
            </span>
        </div>

        <label for="lastname">
            {{translate 'Last Name'}}
            <small class="contactus-required">&nbsp;*</small>
        </label>
        <div data-input="confirmation_lastname" data-validation="control-group" class="contactus-general" >
            <span data-validation="control">
                <input type="text" name="confirmation_lastname" id="confirmation_lastname" />
            </span>
        </div>

        <label for="title">
            {{translate 'Title'}}
            <small class="contactus-required">&nbsp;*</small>
        </label>
        <div data-input="confirmation_title" data-validation="control-group" class="contactus-general">
            <span data-validation="control">
                <input type="text" name="confirmation_title" id="confirmation_title" />
            </span>
        </div>

        <label for="email">
            {{translate 'Email'}}
            <small class="contactus-required">&nbsp;*</small>
        </label>
        <div data-input="confirmation_email" data-validation="control-group" class="contactus-general">
            <span data-validation="control">
                <input type="text" name="confirmation_email" id="confirmation_email" />
            </span>
        </div>

         <label for="date">
            {{translate 'Date'}}
            <small class="contactus-required">&nbsp;*</small>
        </label>
        <div data-input="confirmation_date" data-validation="control-group" class="contactus-general">
            <span data-validation="control">
                <input type="text" name="confirmation_date" id="confirmation_date" value="{{date}}" placeholder="{{date}}" readonly/>
            </span>
        </div>

        <input name="host" type="hidden" id="host" value="{{host}}">
        <input name="formtype" type="hidden" id="formtype" value="REGISTER CAA">       
    </fieldset>



    <div class="contactus-button-container">
        <button class="contactus-button-submit" type="submit">{{translate 'Send Account Application Form to Stonetools'}}</button>
    </div>

</form>