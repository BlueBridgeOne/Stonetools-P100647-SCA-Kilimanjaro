{{#if showBackToAccount}}
	<a href="/" class="contact-management-list-button-back">
		<i class="contact-management-list-button-back-icon"></i>
		{{translate 'Back to Account'}}
	</a>
{{/if}}

<section class="contact-management-list">
	<header class="contact-management-list-header">
		<h2 class="contact-management-list-title">
			{{pageHeader}}
		</h2>
		<div data-confirm-message class="contact-management-list-confirm-message"></div>
	</header>

	<div data-view="List.Header" class="contact-management-list-list-header-container"></div>

	<div class="contact-management-list-results-container">
		{{#if hasContacts}}
			<table class="contact-management-list-recordviews-table">
				<thead class="contact-management-list-content-table">
					<tr class="contact-management-list-content-table-header-row">
						<th class="contact-management-list-content-table-header-row-name">
							<span>{{translate 'Name'}}</span>
						</th>
						<th class="contact-management-list-content-table-header-row-jobtitle">
							<span>{{translate 'Job title'}}</span>
						</th>
						<th class="contact-management-list-content-table-header-row-email">
							<span>{{translate 'Email'}}</span>
						</th>
						<th class="contact-management-list-content-table-header-row-jobtitle">
							<span>{{translate 'Login access'}}</span>
						</th>
      <th></th>
					</tr>
				</thead>
				<tbody data-view="ContactManagement.List"></tbody>
			</table>
		{{else}}
			{{#if isLoading}}
				<p class="contact-management-list-empty">{{translate 'Loading...'}}</p>
			{{else}}
				<p class="contact-management-list-empty">{{translate 'No contacts were found'}}</p>
			{{/if}}
		{{/if}}
	</div>

	{{#if showPagination}}
		<div class="contact-management-list-paginator">
			<div data-view="GlobalViews.Pagination" class="contact-management-list-global-views-pagination"></div>
			{{#if showCurrentPage}}
				<div data-view="GlobalViews.ShowCurrentPage" class="contact-management-list-global-views-current-page"></div>
			{{/if}}
		</div>
	{{/if}}
</section>




{{!----
Use the following context variables when customizing this template: 
	
	pageHeader (String)
	hasContacts (Number)
	isLoading (Boolean)
	showPagination (Boolean)
	showCurrentPage (Boolean)
	showBackToAccount (Boolean)

----}}
