define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var settings = require('models/settings');
  var cache = require('utils/cache');


  var EditorView = Backbone.View.extend({

    el: '#editor',

    initialize: function() {
      if (!cache.isMobile) {
        _.around(this, 'render', function(render) {
          render();
          this.focus();
        }, this);
      }

      cache.loading.done(_.bind(this.render, this));
      settings.on('change:openDocId', this.render, this);
    },

    render: function() {
      var content = cache.openDoc.get('content');
      if (content) {
        this.$el.html(content);
      } else {
        this.$el.text(' ');
      }
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
