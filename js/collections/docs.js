//Module is a Singelton
define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var Store = require('localstorage');
  var Doc = require('models/doc');
  var settings = require('models/settings');
  var rsSync = require('utils/backbone.remoteStorage-documents');

  var deferred = $.Deferred();

  var Docs = Backbone.Collection.extend({

    model: Doc,

    sync: rsSync,

    initialize: function(models) {
      this.deferred = deferred.promise();

      this
        .on('change:content', this.sort)
        .on('change:lastEdited', this.saveWhenIdle)
        .on('change:title', this.updateUrl);
    },

    addNew: function() {
      this.add({
        id: _.uniqueId(),
        lastEdited: new Date().getTime()
      });
    },

    // Sort by 'lastEdited'
    comparator: function(first, second) {
      return first.get('lastEdited') > second.get('lastEdited') ? -1 : 1 ;
    },

    saveTimeout: undefined,
    saveWhenIdle: function(doc) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = setTimeout(_.bind(doc.save, doc), 1000);
    },

    updateUrl: function(doc) {
      var url = encodeURI(doc.get('title').toLowerCase().replace(/\s|&nbsp;/g, '-'));
      if (url.length < 1) {
        doc.set('url', '');
        return;
      }
      var len = this.filter(function(doc) {
        return new RegExp('^' + escapeRegExp(url) + '(-[0-9]|$)').test(doc.get('url'));
      }).length;
      url = len < 1 ? url : url + '-' + len;
      doc.set('url', url);
    },

    deleteEmpty: function() {
      var previousDoc = this.get(settings.previous('openDocId'));
      if (previousDoc && previousDoc.isEmpty()) {
        previousDoc.destroy();
      }
    }

  });


  var escapeRegExp = function(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  };


  var docs = new Docs();


  function fetch() {
    docs.fetch({
      success: function() {
        if (docs.isEmpty()) docs.addNew();
        deferred.resolve();
      }
    });
  }

  remoteStorage.onWidget('ready', function() {
    fetch();
  });

  remoteStorage.onWidget('state', function(state) {
    if (state === 'anonymous') {
      fetch();
    } else if(state == 'disconnected') {
      docs.reset().addNew();
    }
  });


  return docs;

});
