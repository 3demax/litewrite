define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var settings = require('models/settings');
  var cache = require('utils/cache');


  var EditorView = Backbone.View.extend({

    el: '#editor',

    initialize: function() {

      this.changeContent();

      settings.on('change:openDocId', this.changeContent, this);

    },

    changeContent: function() {
      this.$el
        .fadeOut(100, _.bind(this.render, this))
        .fadeIn(100)
        .focus();
    },

    render: function() {
      this.$el.html(cache.openDoc.get('content'));
    },

    focus: function() {
      this.$el.focus();
    },

    events: {
      'keyup': 'updateOpenDoc'
    },

    updateOpenDoc: function() {
      cache.openDoc.set( 'content', this.$el.html() );
    }

  });


  return EditorView;
});
