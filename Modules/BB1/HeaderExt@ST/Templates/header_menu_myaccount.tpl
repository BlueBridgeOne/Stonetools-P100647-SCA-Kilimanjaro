{{!
© 2017 NetSuite Inc.
User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
provided, however, if you are an authorized user with a NetSuite account or log-in, you
may use this code subject to the terms that govern your access and use.
}}





<!-- Original Menu -->
<div class="sidebar-myaccount-menu">
	<a class="header-menu-myaccount-overview-anchor" href="#" data-touchpoint="customercenter" data-hashtag="#overview"
		name="accountoverview">
		{{translate 'Account Overview'}}
	</a>
	<a href="#" data-touchpoint="customercenter" data-hashtag="#purchases" name="orderhistory">
		{{translate 'Purchases History'}}
	</a>
	<a href="#" data-touchpoint="customercenter" data-hashtag="#returns" data-permissions="{{returnsPermissions}}"
		name="returns">
		{{translate 'Returns'}}
	</a>
	{{#if isProductListsEnabled}}
	<a href="#" class="header-menu-myaccount-anchor-level3" data-touchpoint="customercenter" data-hashtag="#wishlist"
		name="allmylists">
		{{translate 'Wishlist'}}
	</a>
	{{/if}}
	<a class="header-menu-myaccount-anchor-level3" href="#" data-touchpoint="customercenter"
		data-hashtag="#profileinformation" name="profileinformation">
		{{translate 'Profile Information'}}
	</a>
	{{#if isCaseModuleEnabled}}
	<a class="header-menu-myaccount-anchor-level3" tabindex="-1" href="#" data-touchpoint="customercenter"
		data-hashtag="#cases" name="allmycases">{{translate 'Support Cases'}}</a>
	{{/if}}
	<a href="#" class="header-menu-myaccount-anchor-level3" data-touchpoint="customercenter"
		data-hashtag="#user-management" name="user-management">
		{{translate 'View All My Team Members'}}
	</a>
	<a href="#" class="header-menu-myaccount-anchor-level3" data-touchpoint="customercenter"
		data-hashtag="#user-management/new" name="newcontact">
		{{translate 'Add A Team Member'}}
	</a>

</div>



<!-- New Menu -->
<div class="sidebar-myaccount-desktopmenu">
	<div>
		<ul class="header-profile-menu-login">
			<li>
				<i class="header-profile-login-icon"></i>
			</li>
			
			{{#if showDisplayName}}
			<li>
				{{displayName}}
			</li>
			<li style="padding-left:15px;">
				
				<a class="header-menu-myaccount-anchor-level3" href="#" data-touchpoint="logout" name="signout">
					<i class="header-menu-myaccount-signout-icon"></i>
					{{translate 'Sign Out'}}
				</a>
			</li>
			{{else}}
			<li>
				<a class="header-profile-login-link" data-touchpoint="login" data-hashtag="login-register" href="#">
					{{translate 'Login'}}
				</a>
			</li>
			{{/if}}

		</ul>

	</div>
	<ul class="header-menu-myaccount-level2 clearfix">
		<li>
			<a class="header-menu-myaccount-level2-anchor" data-action="show-subcat" data-subcat="menu-myaccount">
				<table class="chapter-table" cellspacing="0">
					<tr>
						<td class="chapter-table-icon-td">
							<img class="chapter-icon" src="/icons/go-more.png" />
						</td>
						<td>
							{{translate 'My Account'}}
						</td>
					</tr>
				</table>
			</a>
		</li>
		<li data-permissions="{{purchasesPermissions}}">
			<a class="header-menu-myaccount-level2-anchor" data-action="show-subcat" data-subcat="menu-purchases">
				<table class="chapter-table" cellspacing="0">
					<tr>
						<td class="chapter-table-icon-td">
							<img class="chapter-icon" src="/icons/go-more.png" />
						</td>
						<td>
							{{translate 'Purchases'}}
						</td>
					</tr>
				</table>
			</a>
		</li>
		{{#if isProductListsEnabled}}
		<li>
			<a class="header-menu-myaccount-level2-anchor" data-action="show-subcat" data-subcat="menu-wishlists">
				<table class="chapter-table" cellspacing="0">
					<tr>
						<td class="chapter-table-icon-td">
							<img class="chapter-icon" src="/icons/go-more.png" />
						</td>
						<td>
							{{translate 'Wishlist'}}
						</td>
					</tr>
				</table>
			</a>
		</li>
		{{/if}}
		<li style="padding-right:0px;">
			<a class="header-menu-myaccount-level2-anchor" data-action="show-subcat" data-subcat="menu-billing">
				<table class="chapter-table" cellspacing="0">
					<tr>
						<td class="chapter-table-icon-td">
							<img class="chapter-icon" src="/icons/go-more.png" />
						</td>
						<td>
							{{translate 'Billing'}}
						</td>
					</tr>
				</table>
			</a>
		</li>
	</ul>


	<ul id="menu-myaccount" class="header-menu-myaccount-level3 clearfix">
		<li>
			<a class="header-menu-myaccount-anchor-level3" href="#" data-touchpoint="customercenter"
				data-hashtag="#overview" name="accountoverview">
				{{translate 'Account Overview'}}
			</a>
		</li>
		<li>
			<a class="header-menu-myaccount-anchor-level3" href="#" data-touchpoint="logout" name="signout">
				<i class="header-menu-myaccount-signout-icon"></i>
				{{translate 'Sign Out'}}
			</a>
		</li>

	</ul>

	<ul id="menu-purchases" class="header-menu-myaccount-level3 clearfix" data-permissions="{{purchasesPermissions}}">
		<li data-permissions="{{purchasesPermissions}}">
			<a class="header-menu-myaccount-anchor-level3" href="#" data-touchpoint="customercenter"
				data-hashtag="#purchases" name="orderhistory">
				{{translate 'Purchases History'}}
			</a>
		</li>
		<li>
			<a class="header-menu-myaccount-anchor-level3" href="#" data-touchpoint="customercenter"
				data-hashtag="#returns" data-permissions="{{returnsPermissions}}" name="returns">
				{{translate 'Returns'}}
			</a>
		</li>
		<li data-permissions="{{purchasesPermissions}}">
			<a class="header-menu-myaccount-anchor-level3" href="#" data-touchpoint="customercenter"
				data-hashtag="#reorderItems" name="reorderitems">
				{{translate 'Reorder Items'}}
			</a>
		</li>

	</ul>

	{{#if isProductListsEnabled}}
	<ul id="menu-wishlists" class="header-menu-myaccount-level3 clearfix">
		{{#if productListsReady}}
		{{#unless isSingleList}}
		<li>
			<a href="#" class="header-menu-myaccount-anchor-level3" data-touchpoint="customercenter"
				data-hashtag="#wishlist" name="allmylists">
				{{translate 'All my lists'}}
			</a>
		</li>
		{{/unless}}
		{{#each productLists}}
		<li>
			<a href="#" class="header-menu-myaccount-anchor-level3" data-touchpoint="customercenter"
				data-hashtag="{{url}}" name="{{name}}">
				{{name}} ({{ items.length }})
			</a>
		</li>
		{{/each}}
		{{else}}
		<li>
			<a href="#" class="header-menu-myaccount-anchor-level3">
				{{translate 'Loading...'}}
			</a>
		</li>
		{{/if}}
	</ul>
	{{/if}}

	<ul id="menu-billing" class="header-menu-myaccount-level3 clearfix">
		<li>
			<a class="header-menu-myaccount-anchor-level3" tabindex="-1" href="#" data-touchpoint="customercenter"
				data-hashtag="#balance" name="accountbalance">{{translate 'Account Balance'}}</a>
		</li>
		<li>
			<a class="header-menu-myaccount-anchor-level3" tabindex="-1" href="#" data-touchpoint="customercenter"
				data-hashtag="#invoices" data-permissions="transactions.tranCustInvc.1"
				name="invoices">{{translate 'Invoices'}}</a>
		</li>
		<li>
			<a class="header-menu-myaccount-anchor-level3" tabindex="-1" href="#" data-touchpoint="customercenter"
				data-hashtag="#transactionhistory"
				data-permissions="transactions.tranCustInvc.1, transactions.tranCustCred.1, transactions.tranCustPymt.1, transactions.tranCustDep.1, transactions.tranDepAppl.1"
				data-permissions-operator="OR" name="transactionhistory">{{translate 'Transaction History'}}</a>
		</li>
		<li>
			<a class="header-menu-myaccount-anchor-level3" tabindex="-1" href="#" data-touchpoint="customercenter"
				data-hashtag="#printstatement" data-permissions="transactions.tranStatement.2"
				name="printastatement">{{translate 'Print a Statement'}}</a>
		</li>
	</ul>
	<!--second line of menus-->
	<ul class="header-menu-myaccount-level2 clearfix">
		<li>
			<a class="header-menu-myaccount-level2-anchor" data-action="show-subcat" data-subcat="menu-settings">
				<table class="chapter-table" cellspacing="0">
					<tr>
						<td class="chapter-table-icon-td">
							<img class="chapter-icon" src="/icons/go-more.png" />
						</td>
						<td>
							{{translate 'Settings'}}
						</td>
					</tr>
				</table>
			</a>
		</li>

		{{#if isContactManagementEnabled}}
		<li>
			<a class="header-menu-myaccount-level2-anchor" data-action="show-subcat" data-subcat="menu-team">
				<table class="chapter-table" cellspacing="0">
					<tr>
						<td class="chapter-table-icon-td">
							<img class="chapter-icon" src="/icons/go-more.png" />
						</td>
						<td>
							{{translate 'Manage My Team'}}
						</td>
					</tr>
				</table>
			</a>
		</li>
		{{/if}}
		{{#if isCaseModuleEnabled}}
		<li>
			<a class="header-menu-myaccount-level2-anchor" data-action="show-subcat" data-subcat="menu-cases">
				<table class="chapter-table" cellspacing="0">
					<tr>
						<td class="chapter-table-icon-td">
							<img class="chapter-icon" src="/icons/go-more.png" />
						</td>
						<td>
							{{translate 'Cases'}}
						</td>
					</tr>
				</table>
			</a>
		</li>
		{{/if}}
	</ul>

	<!-- New subcats -->


	<ul id="menu-settings" class="header-menu-myaccount-level3 clearfix">
		<li>
			<a class="header-menu-myaccount-anchor-level3" href="#" data-touchpoint="customercenter"
				data-hashtag="#profileinformation" name="profileinformation">
				{{translate 'Profile Information'}}
			</a>
		</li>
		<li>
			<a class="header-menu-myaccount-anchor-level3" href="#" data-touchpoint="customercenter"
				data-hashtag="#emailpreferences" name="emailpreferences">
				{{translate 'Email Preferences'}}
			</a>
		</li>
		<li>
			<a class="header-menu-myaccount-anchor-level3" href="#" data-touchpoint="customercenter"
				data-hashtag="#addressbook" name="addressbook">
				{{translate 'Address Book'}}
			</a>
		</li>
		<li>
			<a class="header-menu-myaccount-anchor-level3" href="#" data-touchpoint="customercenter"
				data-hashtag="#creditcards" name="creditcards">
				{{translate 'Credit Cards'}}
			</a>
		</li>
		<li>
			<a class="header-menu-myaccount-anchor-level3" href="#" data-touchpoint="customercenter"
				data-hashtag="#updateyourpassword" name="updateyourpassword">
				{{translate 'Update Your Password'}}
			</a>
		</li>

	</ul>

	{{#if isContactManagementEnabled}}
	<ul id="menu-team" class="header-menu-myaccount-level3 clearfix">
		<li>
			<a href="#" class="header-menu-myaccount-anchor-level3" data-touchpoint="customercenter"
				data-hashtag="#user-management" name="user-management">
				{{translate 'View All My Team Members'}}
			</a>
		</li>
		<li>
			<a href="#" class="header-menu-myaccount-anchor-level3" data-touchpoint="customercenter"
				data-hashtag="#user-management/new" name="newcontact">
				{{translate 'Add A Team Member'}}
			</a>
		</li>
	</ul>
	{{/if}}
	{{#if isCaseModuleEnabled}}
	<ul id="menu-cases" class="header-menu-myaccount-level3 clearfix">
		<li>
			<a class="header-menu-myaccount-anchor-level3" tabindex="-1" href="#" data-touchpoint="customercenter"
				data-hashtag="#cases" name="allmycases">{{translate 'Support Cases'}}</a>
		</li>
		<li>
			<a class="header-menu-myaccount-anchor-level3" tabindex="-1" href="#" data-touchpoint="customercenter"
				data-hashtag="#newcase" name="submitnewcase">{{translate 'Submit New Case'}}</a>
		</li>
	</ul>
	{{/if}}
</div>
</div>

{{!----
Use the following context variables when customizing this template:

isProductListsEnabled (Boolean)
isSingleList (Boolean)
isCaseModuleEnabled (Boolean)
productListsReady (Boolean)
productLists (Array)
purchasesPermissions (String)
returnsPermissions (String)

----}}