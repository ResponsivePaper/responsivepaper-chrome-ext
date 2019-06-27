/**
 * Background Page
 */
var cache = {
  urls: {},

  options: {
    apiKey: "",
    includeConsoleInPreview: true
  },


  // Temporary cached map of tabId to rules to prevent recalculating rules
  // for iframes. Cleared when a tab is closed.
  loadingTabs: []
};

/**
 * Initialize the background page cache
 */
function initCache(callback) {
  chrome.storage.local.get(['options', 'urls'], function (items) {
    if (items['options']) {
      cache.options = items['options'];
    }

    if (items['urls']) {
      cache.urls = new Urls(items['urls']);
    } else {
      cache.urls = new Urls({});
    }

    if (callback) {
      callback();
    }
  });
}

BrowserAction.init();


initCache(function () {
  //ContextMenu.init();
});

