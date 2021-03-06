{{!===========================================

   BB1 - G Truslove

   Date: Feb 2018

   ===========================================}}

<section class="contactus-container">

     <div class="page-title" style="background-image:url('/banners/banner-contact-us.jpg');"><h1>{{translate 'Let Us Call You'}}</h1></div>
    
    <h1 class="entry-form-title"><i class="icon-call"></i> {{translate 'Schedule a call back'}}</h1>

    <div class="col-md-7 col-sm-6 entry-form">

<p>{{translate 'Complete the form below and a member of our team will contact you by telephone at your preferred time.'}}</p><br />
    <small class="contactus-required">{{translate 'Required'}}*</small>

    <form class="contactus-form">
        <fieldset>
            <div class="contactus-time" data-input="time" data-validation="control-group">
                <label for="time">{{translate 'Time'}}<small class="contactus-required">*</small></label>
                <span data-validation="control">
                    <select name="time" id="time" >
                        {{#each times}}
     <option value="{{value}}">{{translate text}}</option>
     {{/each}}
   </select>
                </span>
            </div>
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
            {{#if usecompanies}}
            <div class="contactus-company" data-input="company" data-validation="control-group">
                <label for="company">{{translate 'Company'}} <small>(Optional)</small></label>
                <span data-validation="control">
                    <input name="company" type="text" id="company" maxlength="50">
                </span>
            </div>
            {{/if}}
            <div class="contactus-email" data-input="email" data-validation="control-group">
                <label for="email">{{translate 'Email'}}<small class="contactus-required">*</small></label>
                <span data-validation="control">
                    <input name="email" type="text" id="email" maxlength="100" />
                </span>
            </div>
            <div class="contactus-phone" data-input="phone" data-validation="control-group">
                <label for="phone">{{translate 'Telephone Number'}}<small class="contactus-required">*</small></label>
                <span data-validation="control">
                    <input name="phone" type="text" id="phone" maxlength="100">
                </span>
            </div>
            


            <input name="host" type="hidden" id="host" value="{{host}}">
            <input name="formtype" type="hidden" id="formtype" value="REQUESTCALLBACK">
        </fieldset>

        <p class="contact-gdpr-message">{{translate 'By scheduling a call back you agree to Stonetools Ltd&apos;s <a href="/explore/stonetools-policies/privacy-policy">Privacy Policy,
</a> <a href="support/legal/web-terms-and-conditions"> Web

Terms and Conditions </a> and <a href="/support/legal/terms-and-conditions">Terms and Conditions.</a>'}}</p>

<p>
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