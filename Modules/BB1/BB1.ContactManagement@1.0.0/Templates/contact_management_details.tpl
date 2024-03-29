{{#if showBackToAccount}}
	<a href="/" class="contact-management-detail-button-back">
		<i class="contact-management-detail-button-back-icon"></i>
		{{translate 'Back to Account'}}
	</a>
{{/if}}

{{#unless isInModal}}
<section class="contact-management-detail">
{{/unless}}

	<header class="contact-management-detail-header">
	 {{#unless isInModal}}
			<h2 class="contact-management-detail-title">{{pageHeader}}</h2>
		{{/unless}}
		<p>{{translate 'Fill in the form below and click the Save button.'}}</p>
	</header>

	<div class="contact-management-detail-alert-placeholder" data-type="alert-placeholder"></div>
	<small class="contact-management-detail-required">
		{{translate 'Required'}} <span class="contact-management-detail-required-star">*</span>
	</small>

	<form action="#" class="contact-management-detail-form" novalidate>
	
		{{#if isInModal}}
			<div class="modal-body">
		{{/if}}

	 <fieldset>
		
		<div class="contact-management-detail-controls-group" data-validation="control-group" data-input="firstname">
			<label class="contact-management-detail-label" for="{{manage}}firstname">
				{{translate 'First Name'}} <small class="contact-management-detail-required-star">*</small>
			</label>
			<div class="contact-management-detail-controls" data-validation="control">
				<input data-action="text" type="text" name="firstname" id="{{manage}}firstname" class="contact-management-detail-input" value="{{model.firstname}}" maxlength="300"/>
			</div>
		</div>

		<div class="contact-management-detail-controls-group" data-validation="control-group" data-input="lastname">
			<label class="contact-management-detail-label" for="{{manage}}lastname">
				{{translate 'Last Name'}} <small class="contact-management-detail-required-star">*</small>
			</label>
			<div class="contact-management-detail-controls" data-validation="control">
				<input data-action="text" type="text" name="lastname" id="{{manage}}lastname" class="contact-management-detail-input" value="{{model.lastname}}" maxlength="300"/>
			</div>
		</div>

		<div class="contact-management-detail-controls-group" data-validation="control-group" data-input="jobtitle">
			<label class="contact-management-detail-label" for="{{manage}}jobtitle">
				{{translate 'Job Title'}}
			</label>
			<div class="contact-management-detail-controls" data-validation="control">
				<input data-action="text" type="text" name="jobtitle" id="{{manage}}jobtitle" class="contact-management-detail-input" value="{{model.jobtitle}}" maxlength="300"/>
			</div>
		</div>

		<div class="contact-management-detail-controls-group" data-validation="control-group" data-input="email">
			<label class="contact-management-detail-label" for="{{manage}}email">
				{{translate 'Email'}} <small class="contact-management-detail-required-star">*</small>
			</label>
			<div class="contact-management-detail-controls" data-validation="control">
				<input data-action="text" type="email" name="email" id="{{manage}}email" class="contact-management-detail-input" value="{{model.email}}" maxlength="300"/>
			</div>
		</div>

		<div class="contact-management-detail-controls-group" data-validation="control-group" data-input="phone">
			<label class="contact-management-detail-label" for="{{manage}}phone">
				{{translate 'Phone'}}
			</label>
			<div class="contact-management-detail-controls" data-validation="control">
				<input data-action="text" type="phone" name="phone" id="{{manage}}phone" class="contact-management-detail-input" value="{{model.phone}}" maxlength="300"/>
			</div>
		</div>

  <div class="contact-management-detail-controls-group" data-validation="control-group" data-input="loginaccess">
   <label class="contact-management-detail-label" for="{{manage}}loginaccess">
			 <input type="checkbox" id="{{manage}}loginaccess" name="loginaccess" value="T" data-unchecked-value="F"{{#if hasLoginAccess}} checked{{/if}} />
				{{translate 'Tick to give this team member login access. A login invitation email will be sent to their email address'}}
   </label>
  </div>
  
 </fieldset>
 
	{{#if isInModal}}
		</div>
	{{/if}}
 
	<div class="{{#if isInModal}}modal-footer{{else}}form-actions{{/if}}">
		<button type="submit" class="contact-management-detail-button-submit">
			{{translate 'Save'}}
		</button>

		{{#unless model.internalid}}
			<button type="reset" class="contact-management-detail-button" data-action="reset">
				{{translate 'Reset'}}
			</button>
		{{else}}
			{{#if isInModal}}
				<button class="contact-management-detail-button" data-dismiss="modal">
					{{translate 'Cancel'}}
				</button>
			{{else}}
				<a class="contact-management-detail-button" href="/user-management">
					{{translate 'Cancel'}}
				</a>
			{{/if}}
		{{/unless}}
  
	</div>
 
</form>

{{#unless isInModal}}
</section>
{{/unless}}