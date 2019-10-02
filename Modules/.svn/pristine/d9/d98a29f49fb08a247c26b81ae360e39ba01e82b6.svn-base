{{! © 2017 NetSuite Inc. User may not copy, modify, distribute, or re-bundle or otherwise make available this code; provided, however, if you are an authorized user with a NetSuite account or log-in, you may use this code subject to the terms that govern your access and use. }}
<div class="header-message" data-view="Message.Placeholder"></div>
<div class="header-main-wrapper">
    <nav class="header-main-nav">
        <div class="row header-controls">
            <div class="col-md-3 header-left-side-menus">
                <div class="header-tag"><a data-touchpoint="home" href="/explore/stonetools-brand/everything-you-need-for-working-stone">{{translate 'Everything You Need<br />for Working Stone'}}</a></div>
            </div>
            <div class="col-md-3 col-sm-4 col-xs-2 header-sidebar-button-col">
                <ul class="header-logo-list checkout-hidden">
                    <li class="header-sidebar-toggle-wrapper">
                        <button class="header-sidebar-toggle" data-action="header-sidebar-show">
                            <i class="header-sidebar-toggle-icon"></i>
                        </button>
                    </li>
                </ul>
            </div>
            <div class="col-md-6 col-sm-4 col-xs-8 header-logo-container">
                <ul class="header-logo-list">
                    <li data-view="Header.Logo" class="text-center"></li>
                </ul>
            </div>
            <div class="col-md-3 col-sm-4 col-xs-2 header-right-side-menus">
                <div class="header-menu-cart checkout-hidden">
                    <div class="header-menu-cart-dropdown">
                        <div data-view="Header.MiniCart"></div>
                    </div>
                </div>
                <a data-action="show-myaccount-menu" href="#" class="header-user-link checkout-hidden">
					<span class="header-user-icon"></span>
					{{#if showDisplayName}}
					<span class="header-icon-badge">{{displayName}}</span> {{/if}}
				</a>
                <div class="header-menu-global checkout-hidden">
                    <button class="header-menu-global-link" data-action="show-siteglobal" title="{{translate 'Global'}}">
                        <span class="header-menu-global-icon"></span> {{#if siteCode}}
                        <span class="header-icon-badge">{{siteCode}}</span> {{/if}}
                    </button>
                    <div class="header-mini-cart checkout-hidden" data-type="mini-global">
                        <h4 class="text-center">{{translate 'Stonetools Around the World'}}</h4>
                        <div class="global-list">
                            {{#each availableHosts}} {{#unless @first}} | {{/unless}}
                            <a href="{{url}}" data-navigation="ignore-click">{{title}}</a> {{/each}}
                        </div>
                        <div class="text-center"><i class="header-menu-global-icon"></i></div>
                    </div>
                </div>
                <div class="header-menu-search checkout-hidden">
                    <button class="header-menu-search-link" data-action="show-sitesearch" title="{{translate 'Search'}}">
                        <span class="header-menu-search-icon"></span>
                    </button>
                </div>
            </div>
        </div>
    </nav>
</div>
<span class="checkout-hidden">
<div class="header-sidebar-overlay" data-action="header-sidebar-hide"></div>
<div class="header-secondary-wrapper" data-view="Header.Menu" data-phone-template="header_sidebar" data-tablet-template="header_sidebar">
</div>
<div class="header-site-search" data-view="SiteSearch" data-type="SiteSearch"></div>
</div>
</span>
{{!---- Use the following context variables when customizing this template: profileModel (Object) profileModel.addresses (Array) profileModel.addresses.0 (Array) profileModel.creditcards (Array) profileModel.firstname (String) profileModel.paymentterms (undefined) profileModel.phoneinfo (undefined) profileModel.middlename (String) profileModel.vatregistration (undefined) profileModel.creditholdoverride (undefined) profileModel.lastname (String) profileModel.internalid (String) profileModel.addressbook (undefined) profileModel.campaignsubscriptions (Array) profileModel.isperson (undefined) profileModel.balance (undefined) profileModel.companyname (undefined) profileModel.name (undefined) profileModel.emailsubscribe (String) profileModel.creditlimit (undefined) profileModel.email (String) profileModel.isLoggedIn (String) profileModel.isRecognized (String) profileModel.isGuest (String) profileModel.priceLevel (String) profileModel.subsidiary (String) profileModel.language (String) profileModel.currency (Object) profileModel.currency.internalid (String) profileModel.currency.symbol (String) profileModel.currency.currencyname (String) profileModel.currency.code (String) profileModel.currency.precision (Number) showLanguages (Boolean) showCurrencies (Boolean) showLanguagesOrCurrencies (Boolean) showLanguagesAndCurrencies (Boolean) isHomeTouchpoint (Boolean) cartTouchPoint (String) ----}}