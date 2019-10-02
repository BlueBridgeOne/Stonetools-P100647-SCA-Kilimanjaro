/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module SiteSettings
// Pre-processes the SiteSettings to be used on the site
define(
    'SiteSettings.Model', ['SC.Model', 'SC.Models.Init', 'underscore', 'Utils'],
    function(
        SCModel, ModelsInit, _, Utils
    ) {
        'use strict';

        var settings_cache, is_https_supported = Utils.isHttpsSupported();

        // @class SiteSettings Pre-processes the SiteSettings to be used on the site. For performance reasons it
        // adds a cache layer using netsuite's application cache. Cache use the siteid in the keyword to support multi sites.
        // Cache douration can be configured in cacheTtl property. Some properties like touchpoints, siteid, languages and currencies are never cached.
        // @extends SCModel
        return SCModel.extend({

            name: 'SiteSettings'

                // @method get the site settings. Notice that can be cached @returns { ShoppingSession.SiteSettings}
                ,
            get: function() {
                    var i, countries, shipToCountries, settings;
                    if (settings_cache) {
                        settings = settings_cache;
                    } else {
                        settings = ModelsInit.session.getSiteSettings();

                        settings.paymentmethods_cache = settings.paymentmethods; //Create a copy.
                        if (settings.shipallcountries === 'F') {
                            if (settings.shiptocountries) {
                                shipToCountries = {};
                                for (i = 0; i < settings.shiptocountries.length; i++) {
                                    shipToCountries[settings.shiptocountries[i]] = true;
                                }
                            }
                        }
                        var allCountries = ModelsInit.session.getCountries();
                        if (shipToCountries) {
                            countries = {};
                            for (i = 0; i < allCountries.length; i++) {
                                if (shipToCountries[allCountries[i].code]) {
                                    countries[allCountries[i].code] = allCountries[i];
                                }
                            }
                        } else {
                            countries = {};
                            for (i = 0; i < allCountries.length; i++) {
                                countries[allCountries[i].code] = allCountries[i];
                            }
                        }
                        var allStates = ModelsInit.session.getStates();
                        if (allStates) {
                            for (i = 0; i < allStates.length; i++) {
                                if (countries[allStates[i].countrycode]) {
                                    countries[allStates[i].countrycode].states = allStates[i].states;
                                }
                            }
                        }
                        settings.countries = countries;
                        settings.phoneformat = ModelsInit.context.getPreference('phoneformat');
                        settings.minpasswordlength = ModelsInit.context.getPreference('minpasswordlength');
                        settings.campaignsubscriptions = ModelsInit.context.getFeature('CAMPAIGNSUBSCRIPTIONS');
                        settings.analytics.confpagetrackinghtml = _.escape(settings.analytics.confpagetrackinghtml);
                        settings.quantitypricing = ModelsInit.context.getFeature('QUANTITYPRICING');
                        settings.groupseparator = window.groupseparator;
                        settings.decimalseparator = window.decimalseparator;
                        settings.negativeprefix = window.negativeprefix;
                        settings.negativesuffix = window.negativesuffix;
                        settings.dateformat = window.dateformat;
                        settings.longdateformat = window.longdateformat;
                        settings.isMultiShippingRoutesEnabled = this.isMultiShippingRoutesEnabled();
                        settings.isPickupInStoreEnabled = this.isPickupInStoreEnabled();
                        settings.isAutoapplyPromotionsEnabled = this.isAutoapplyPromotionsEnabled();
                        settings.isSCISIntegrationEnabled = this.isSCISIntegrationEnabled();
                        settings.checkoutSupported = Utils.isCheckoutDomain();
                        settings.shoppingSupported = Utils.isShoppingDomain();
                        settings.isHttpsSupported = is_https_supported;
                        settings.isSingleDomain = settings.checkoutSupported && settings.shoppingSupported;
                        delete settings.entrypoints;
                        settings_cache = settings;
                    }
                    settings.is_logged_in = ModelsInit.session.isLoggedIn2();
                    settings.shopperCurrency = ModelsInit.session.getShopperCurrency();
                    settings.touchpoints = this.getTouchPoints();
                    
                    //Hard Coded filter payment methods by currency.
                    var paymentmethods = [];
                    var CurrCode = ModelsInit.session.getShopperCurrency().code;
                    var merchantid = 4;
                    if (CurrCode == "USD") {
                        merchantid = 3;
                    } else if (CurrCode == "EUR") {
                        merchantid = 6;
                    } else if (CurrCode == "GBP") {
                        merchantid = 4;
                    }
                    //nlapiLogExecution('DEBUG', 'Curr', CurrCode + " " + merchantid);

                    for (var i = settings.paymentmethods_cache.length - 1; i >= 0; i--) {
                        if (settings.paymentmethods_cache[i].merchantid == merchantid) {
                            paymentmethods.push(settings.paymentmethods_cache[i]);
                        }
                    }
                    settings.paymentmethods = paymentmethods;
                    //nlapiLogExecution('DEBUG', 'settings.paymentmethods', JSON.stringify(settings.paymentmethods));
                    return settings;
                }
                // @method isPickupInStoreEnabled. @returns {Boolean}
                ,
            isPickupInStoreEnabled: function() {
                    return SC.Configuration.isPickupInStoreEnabled && ModelsInit.context.getSetting('FEATURE', 'STOREPICKUP') === 'T';
                }
                // @method isSCISIntegrationEnabled. @returns {Boolean}
                ,
            isSCISIntegrationEnabled: function() {
                    return SC.Configuration.isSCISIntegrationEnabled && Utils.recordTypeHasField('salesorder', 'custbody_ns_pos_transaction_status');
                }
                // @method isMultiShippingRoutesEnabled. @returns {Boolean}
                ,
            isMultiShippingRoutesEnabled: function() {
                    return SC.Configuration.isMultiShippingEnabled && ModelsInit.context.getSetting('FEATURE', 'MULTISHIPTO') === 'T';
                }
                // @method isAutoapplyPromotionsEnabled. @returns {Boolean}
                ,
            isAutoapplyPromotionsEnabled: function() {
                    return ModelsInit.session.getSiteSettings(['autoapplypromotionsenabled']).autoapplypromotionsenabled === 'T';
                }
                // @method getTouchPoints. @returns {Object}
                ,
            getTouchPoints: function() {
                var settings = ModelsInit.session.getSiteSettings(['touchpoints', 'sitetype']);

                if (!is_https_supported && settings.sitetype === 'ADVANCED') {
                    settings.touchpoints.storelocator = settings.touchpoints.login.replace('is=login', 'is=storelocator');
                }

                return settings.touchpoints;
            }
        });
    });