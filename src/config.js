require.config( {

  deps: [
    '../lib/matchMedia',
    '../lib/requestAnimationFrame',
    'main'
  ],

  paths: {
    text: '../lib/require.text',
    jquery: '../lib/jquery.min',
    autosize: '../lib/jquery.autosize',
    underscore: '../lib/underscore',
    backbone: '../lib/backbone',
    localstorage: '../lib/backbone.localstorage',
    remotestorage: '../lib/remotestorage',
    'remotestorage-documents': '../lib/remotestorage-documents',
    'rs-adapter': '../lib/backbone.remoteStorage-documents',
    snap: '../lib/snap',
    moment: '../lib/moment'
  },

  baseUrl: 'src',

  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    autosize: {
      deps: ['jquery']
    }
  }

});
