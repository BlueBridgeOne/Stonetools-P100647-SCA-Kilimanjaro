{{!
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

	{{#if showMyAccountMenu}}
		<ul id="myaccount-container" class="header-profile-menu-myaccount-container">
			<li data-view="Header.Menu.MyAccount"></li>
		</ul>
	{{/if}}

<span class="sidebar-only">

{{#if showExtendedMenu}}
	<a class="header-profile-welcome-link" href="#" data-touchpoint="customercenter">
		<i class="header-profile-welcome-user-icon"></i>
		{{translate 'Welcome'}} {{displayName}}
	</a>

{{else}}

	{{#if showLoginMenu}}
		{{#if showLogin}}
			<div class="header-profile-menu-login-container">
				<ul class="header-profile-menu-login">
					<li>
						<i class="header-profile-login-icon"></i>
					</li>
					<li>
						<a class="header-profile-login-link" data-touchpoint="login" data-hashtag="login-register" href="#">
							{{translate 'Login'}}
						</a>
					</li>
				</ul>
			</div>
		{{/if}}
	{{else}}
		<a class="header-profile-loading-link">
			<i class="header-profile-loading-icon"></i>
			<span class="header-profile-loading-indicator"></span>
		</a>
	{{/if}}

{{/if}}
</span>


{{!----
Use the following context variables when customizing this template: 
	
	showExtendedMenu (Boolean)
	showLoginMenu (Boolean)
	showLoadingMenu (Boolean)
	showMyAccountMenu (Boolean)
	displayName (String)
	showLogin (Boolean)
	showRegister (Boolean)

----}}
