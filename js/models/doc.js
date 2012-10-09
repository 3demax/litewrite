define(function(require) {

  var Backbone = require('backbone');


  Doc = Backbone.Model.extend({

    defaults: {
      title: '',
      url: '',
      content: '',
      lastEdited: undefined,
      color: 'rgb(0, 0, 0)'
    },

    initialize: function() {
      this
        .on('change:content', this.updateLastEdited)
        .on('change:content', this.updateTitle)
        .on('change:lastEdited', this.resetColor);
    },

    isEmpty: function() {
      //Contenteditable never is really empty
      return this.get('content').match(/^(<\/{0,1}div>|<br>|\s|&nbsp;)*?$/) !== null;
    },

    updateLastEdited: function() {
        this.set('lastEdited', new Date().getTime());
    },

    updateTitle: function() {
      //Title is the first not empty line of the content
      var title = this.get('content')
        .match(/^(<div>|<\/div>|<br>|\s|&nbsp;)*(.*?)(<div>|<\/div>|<br>|$)/)[2]
        .replace(/&nbsp;/gi,'');
      this.set('title', title);
    },

    resetColor: function() {
      this.set('color', 'rgb(0, 0, 0)');
    },

    calculateColor: function() {
      //Time passed since last this document was edited the last time in milliseconds
      var diff = (new Date().getTime() - this.get('lastEdited'));
      //For documents older than 2 Weeks the color won't change anymore
      var limit = 14 * 86400000;
      //The older the document the lighter the color
      var c = diff > limit ? 200 : Math.round(diff / limit * 200);

      this.set('color', 'rgb('+c+', '+c+', '+c+')');
    }

  });


  return Doc;
});
