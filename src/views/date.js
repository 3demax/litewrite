var _ = require('underscore');
var Backbone = require('backbone');
var lang = require('../translations');


var EditorView = Backbone.View.extend({

  el: '#date',

  initialize: function(options) {
    _.bindAll(this, 'render');
    this.model.on('change:lastEdited', this.render);
    this.refreshTimeout = null;
  },

  // only re-render when content changed
  render: function() {
    this.$el.html( lang.modified+' '+this.model.formatDate() );
    this.refresh();
  },

  refresh: function() {
    clearTimeout(this.refreshTimeout);
    this.refreshTimeout = setTimeout(_.bind(function() {
      // stop updating when window is inactive
      requestAnimationFrame(this.render);
    }, this), 20000);
  }


});


module.exports = EditorView;
