/* BB1 G Truslove 2015 */

define('Sidebar', [
  'Sidebar.Router'
  ],
  function (Router) {
  'use strict';

  return {
    mountToApp: function(application) {
       return new Router(application);
    }
  }
});