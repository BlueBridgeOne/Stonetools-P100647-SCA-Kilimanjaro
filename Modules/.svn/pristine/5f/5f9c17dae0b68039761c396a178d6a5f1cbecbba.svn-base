define('RegisterCAA.ServiceController'
, [
    'ServiceController'
  , 'Application'
  , 'RegisterCAA.Model'
  ]
, function
  (
    ServiceController
  , Application
  , RegisterCAAModel
  )
{
  
  'use strict';

  return ServiceController.extend({
    name: 'RegisterCAA.ServiceController',
    
    post: function()
    {
      nlapiLogExecution("DEBUG", "Service Post Called", "called...");
      this.sendContent(RegisterCAAModel.create(this.data));
    }

  });
});