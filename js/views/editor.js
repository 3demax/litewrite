define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var settings = require('models/settings');
  var cache = require('utils/cache');


  var EditorView = Backbone.View.extend({

    el: '#editor',

    initialize: function() {

      this.setContent();

      settings.on('change:openDocId', this.setContent, this);

    },

    setContent: function() {
      this.$el
        .html( cache.openDoc.get('content') )
        .focus();
    },

    events: {
      'keyup': 'updateOpenDoc'
    },

    updateOpenDoc: function() {
      cache.openDoc.save( 'content', this.$el.html() );
    }

  });


  return EditorView;
});