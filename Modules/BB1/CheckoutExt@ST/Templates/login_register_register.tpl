{{!
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

{{#unless showFormFieldsOnly}}
<p class="login-register-register-form-description">
	{{translate 'Create an account and take advantage of faster checkouts and other great benefits.'}}
</p>

<form class="login-register-register-form" method="POST" novalidate>
	<small class="login-register-register-required">{{translate 'Required <span class="login-register-register-form-required">*</span>'}}</small>

{{/unless}}

{{#if showCompanyField}}
		<div class="login-register-register-form-controls-group" data-validation="control-group">
			<label class="login-register-register-form-label" for="register-company">
				{{#if isCompanyFieldRequire}}
					{{translate 'Company Name <small class="login-register-register-form-required">*</small>'}}
				{{else}}
					{{translate 'Company Name'}} <small class="login-register-register-form-optional">{{translate '(optional)'}}</small>
				{{/if}}
			</label>
			<div class="login-register-register-form-controls" data-validation="control">
				<input type="text" name="company" id="register-company" class="login-register-register-form-input"/>
			</div>
			<p class="small">{{translate '(Invoices will be billed to the company name, if applicable)'}}</p>
		</div>
			<div class="login-register-register-form-controls-group" data-validation="control-group">
			<label class="login-register-register-form-label" for="register-vatregnumber">
				
					{{translate 'VAT Number'}} <small class="login-register-register-form-optional">{{translate '(optional)'}}</small>
				
			</label>
			<div class="login-register-register-form-controls" data-validation="control">
				<input type="text" name="vatregnumber" id="register-vatregnumber" class="login-register-register-form-input"/>
			</div>
			<p class="small">{{translate '(Please enter your VAT number if you have one)'}}</p>
		</div>
	{{/if}}

	<div class="login-register-register-form-controls-group" data-validation="control-group">
		<label class="login-register-register-form-label" for="register-firstname">
			{{translate 'First Name <small class="login-register-register-form-required">*</small>'}}
		</label>
		<div class="login-register-register-form-controls" data-validation="control">
			<input {{#if hasAutoFocus}} autofocus {{/if}} type="text" name="firstname" id="register-firstname" class="login-register-register-form-input">
		</div>
	</div>

	<div class="login-register-register-form-controls-group" data-validation="control-group">
		<label class="login-register-register-form-label" for="register-lastname">
			{{translate 'Last Name <small class="login-register-register-form-required">*</small>'}}
		</label>
		<div class="login-register-register-form-controls" data-validation="control">
			<input type="text" name="lastname" id="register-lastname" class="login-register-register-form-input">
		</div>
	</div>

	<div class="login-register-register-form-controls-group" data-validation="control-group">
		<label class="login-register-register-form-label" for="register-email">
			{{translate 'Email Address <small class="login-register-register-form-required">*</small>'}}
		</label>
		<div class="login-register-register-form-controls" data-validation="control">
			<input type="email" name="email" id="register-email" class="login-register-register-form-input" placeholder="{{translate 'your@email.com'}}">
			<p class="login-register-register-form-help-block">
				<small>
					{{translate 'We need your email address to contact you about your order.'}}
				</small>
			</p>
		</div>
	</div>
	<div class="login-register-register-form-controls-group" data-validation="control-group">
		<label class="login-register-register-form-label" for="register-password">
			{{translate 'Password <small class="login-register-register-form-required">*</small>'}}
		</label>
		<div class="login-register-register-form-controls" data-validation="control">
			<input type="password" name="password" id="register-password" class="login-register-register-form-input">
		</div>
	</div>

	<div class="login-register-register-form-controls-group" data-validation="control-group">
		<label class="login-register-register-form-label" for="register-password2">
			{{translate 'Re-Enter Password <small class="login-register-register-form-required">*</small>'}}
		</label>
		<div class="login-register-register-form-controls" data-validation="control">
			<input type="password" name="password2" id="register-password2" class="login-register-register-form-input">
		</div>
	</div>

	{{#if isRedirect}}
		<div class="login-register-register-form-controls-group" data-validation="control-group">
			<div class="login-register-register-form-controls" data-validation="control">
				<input value="true" type="hidden" name="redirect">
			</div>
		</div>
	{{/if}}

	<div class="login-register-register-form-controls-group">
		<label class="login-register-register-form-label">
			<input type="checkbox" name="emailsubscribe" id="register-emailsubscribe" value="T" {{#if isEmailSubscribeChecked}} checked {{/if}}>
			{{translate 'Keep me up to date with Quarterly New Product and Stone Working
Information Email.' siteName}}
		</label>
	</div>

	<p class="contact-gdpr-message">{{translate 'By creating an account you agree to Stonetools Ltd&apos;s <a href="/explore/stonetools-policies/privacy-policy">Privacy Policy,
</a> <a href="support/legal/web-terms-and-conditions"> Web

Terms and Conditions </a> and <a href="/support/legal/terms-and-conditions">Terms and Conditions.</a>'}}</p>

<p>
<input id="iagree" name="iagree" type="checkbox" value="IAgree" /> {{translate 'I Agree'}} <small class="input-required">*</small>
</p>


	<div class="login-register-register-form-messages" data-type="alert-placeholder"></div>

{{#unless showFormFieldsOnly}}
	<div class="login-register-register-form-controls-group">
		<button type="submit" class="login-register-register-form-submit">
			{{translate 'Create Account'}}
		</button>
	</div>
</form>
{{/unless}}




{{!----
Use the following context variables when customizing this template: 
	
	showCompanyField (Boolean)
	isCompanyFieldRequire (Boolean)
	siteName (String)
	showFormFieldsOnly (Boolean)
	isRedirect (Boolean)
	hasAutoFocus (Boolean)

----}}
