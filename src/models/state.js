define(function(require) {

  var Backbone = require('backbone');
  var Store = require('localstorage');


  var State = Backbone.Model.extend({

    defaults: {
      id: 0,
      query: '',
      openDocId: null
    },

    localStorage: new Store('litewriteState')

  });


  return State;
});
