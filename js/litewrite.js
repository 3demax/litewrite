define(function(require) {

  var Backbone = require('backbone');
  var AppView = require('views/app');
  var docs = require('collections/docs');
  var cache = require('utils/cache');
  var settings = require('models/settings');
  var router = require('utils/router');


  function litewrite() {
    if ( _.isUndefined(settings.get('openDocId')) ) {
      settings.save('openDocId', docs.first().id);
    }

    setOpenDoc();
    setWindowTitle();

    settings
      .on('change:openDocId', setOpenDoc)
      .on('change:openDocId', setWindowTitle)
      .on('change:openDocId', setUrl)
      .on('change:openDocId', deleteEmpty);

    docs
      .on('change:title', setUrl)
      .on('change:title', setWindowTitle)
      .on('change:content', docs.sort)
      .on('add', function(doc) {
        settings.save('openDocId', doc.id);
      });


    //Load on DOM-ready
    $(function() {
      new AppView();
      Backbone.history.start();
      setUrl();
    });

  }


  function setOpenDoc() {
    cache.openDoc = docs.get( settings.get('openDocId') );
  }

  function setWindowTitle() {
    if(cache.openDoc.get('title') != '') {
      document.title = cache.openDoc.get('title').replace(/&nbsp;/gi,'');
    } else {
      document.title = 'Litewrite';
    }
  }

  function setUrl() {
    var formattedTitle = router.getDocUrl(cache.openDoc);
    var url = formattedTitle.length > 0 ? formattedTitle : '';
    router.navigate(url);
  }

  function deleteEmpty() {
    var previousDoc = docs.get(settings.previous('openDocId'));
    //When doc gets cloesd remove spaces and returns at the beginning
    //and remove spaces at the end of each line
    var previousContent = previousDoc.get('content').replace(/^<.*?>([^<].*?)(<\/div>|(?=<br>)|$)/, '$1');
    //Contenteditable never is really empty
    if ( !_.isNull(previousContent.match(/^(<\/{0,1}div>|<br>|\s|&nbsp;)*?$/)) || _.isEmpty(previousContent) ) {
      previousDoc.destroy();
    } else {
      previousDoc.save('content', previousContent);
    }
  }


  return litewrite;
});
