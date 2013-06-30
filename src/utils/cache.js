define(function(require) {


  var cache = {
    isMac: /Mac/.test(navigator.platform),
    isMobile: matchMedia('(max-width:720px)').matches
  };

  cache.modKey = cache.isMac ? { name: 'ctrlKey', code: 17 } : { name: 'altKey', code: 18 };


  return cache;
});
