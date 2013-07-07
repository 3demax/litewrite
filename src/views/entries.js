define(function(require) {

  var _ = require('underscore');
  var Backbone = require('backbone');
  var entriesTemplate = require('text!templates/entries.html');
  var utils = require('utils');


  var EntriesView = Backbone.View.extend({

    el: '#entries',

    initialize: function(options) {

      _.bindAll(this);

      this.app = options.app;
      this.template = _.template(entriesTemplate);

      this.collection
        .on('fetch', function ready() { this.render(); this.collection.off('fetch', ready); }, this) // TODO: backbone 1.0 - redundant
        .on('reset', this.render) // TODO: backbone 1.0 - use sort event
        .on('add', this.render)
        .on('change:title', this.update)
        .on('change:lastEdited', this.moveItem)
        .on('destroy', this.removeItem);

      this.app.doc.on('change:id', this.selectDoc);

      this.app.state.on('change:query', this.render);

    },

    events: {
      'click .item': 'openDoc'
    },

    serialize: function() {
      var query = this.app.state.get('query');
      var docs = this.collection
        .filter(function(doc) {
          var match = query ? new RegExp(utils.escapeRegExp(query), 'i').test( doc.get('title') ) : true;
          return !doc.isEmpty() && match;
        }).map(function(doc) {
          var res = doc.toJSON();
          res.opacity = doc.getOpacity();
          return res;
        });

      return { docs: docs };
    },

    render: function() {
      this.$el.html( this.template( this.serialize() ) );
      this.selectDoc();
    },

    find: function(id) {
      return this.$('.item[data-id=' + id + ']');
    },

    update: function(doc) {
      var $item = this.find(doc.id).find('a');
      if ($item.length && !doc.isEmpty()) {
        $item.text( doc.get('title') );
        $item.attr( 'href', '#!' + doc.get('uri') );
      } else {
        this.render();
      }
    },

    moveItem: function(doc) {
      this.$el.prepend( this.removeItem(doc) );
    },

    removeItem: function(doc) {
      return this.find(doc.id).remove();
    },

    selectDoc: function() {
      if (this.$selected) {
        this.$selected.removeClass('selected');
      }
      this.$selected = this.find( this.app.doc.id )
        .addClass('selected');

      this.scrollToSelected();
    },

    height: function () {
      return this.$el.height() - 50;
    },

    scrollToSelected: function() {
      var position = this.$selected.position();
      if (!position) return;
      var top = position.top;
      if ( top < 0 || top > this.height() ) {
        this.$el.scrollTop( top - 15 );
      }
    },

    openDoc: function(e) {
      e.preventDefault();
      var id = this.$(e.currentTarget).attr('data-id');
      this.app.open(id);
      this.trigger('open');
    }

  });



  return EntriesView;
});
