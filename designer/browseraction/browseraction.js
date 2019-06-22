/**
 * BrowserAction menu
 */
var BrowserAction = {
  // Cache of css of styles
  // Key/value pair of style id/css
  css: {},

  /**
   * Initialize the browser action for the currently active tab
   */
  init: function () {
    _.bindAll(this,
      'setup',
      'toggle',
      'preview',
      'options');

    chrome.windows.getCurrent({ populate: true }, _.bind(function (aWindow) {
      var tabs = aWindow.tabs;
      var len = tabs.length;

      for (var i = 0; i < len; i++) {
        if (tabs[i].active) {
          this.setup(tabs[i]);
          break;
        }
      }
    }, this));
  },

  /**
   * Setup the UI and event listeners for the browser action
   */
  setup: function (tab) {
    this.tab = tab;

    this.elToggle = document.getElementById("aToggle");
    this.elPreview = document.getElementById("aPreview");
    this.elOptions = document.getElementById("aOptions");

    var port = chrome.runtime.connect({
      name: 'browserAction'
    });

    port.postMessage({
      name: 'activeTab',
      tab: tab
    });

    this.elToggle.onClick(this.toggle);
    this.elPreview.onClick(this.preview);
    this.elOptions.onClick(this.options);

  },

  /**
   * Search for the styles for the current page and render them.
   */
  fetch: function (callback) {
    var searchAPI = 'http://stylebot.me/search_api?q=';

    chrome.tabs.sendRequest(this.tab.id, {
      name: 'getURLAndSocialData'
    },

      _.bind(function (response) {
        $.get(searchAPI + response.url,

          _.bind(function (json) {
            var styles = JSON.parse(json),
              socialId = null;

            // Sort the installed style to the top
            if (response.social && response.social.id) {
              styles = _.sortBy(styles, function (style) {
                socialId = response.social.id;
                return (style.id == socialId) ? -1 : 1;
              });
            }

            this.renderStyles(styles, socialId);
            callback();
          }, this));

      }, this));
  },



  /**
   * Install the clicked style on the current page.
   * Listener for the click event on styles.
   */
  install: function (e) {
    var $el = $(e.target), id;

    if ($el.hasClass('style-link') || $el.hasClass('style-author')) {
      return;
    }

    $('.style-installed').hide();
    $('.style-installed', $el).show();

    if (!$el.hasClass('style-item')) {
      $el = $el.parents('.style-item');
    }

    id = $el.data('id');

    chrome.tabs.sendRequest(this.tab.id, {
      name: 'install',
      id: id,
      title: $el.data('title'),
      timestamp: $el.data('timestamp'),
      url: $el.data('url'),
      css: this.css[id]
    }, function () { });
  },



  /**
   * Show toggle responsive paper css  on the current page.
   */
  toggle: function (e) {
    $(e.target).text('Opening...').addClass('disabled');

    chrome.tabs.sendRequest(this.tab.id, {
      name: 'toggle'
    }, function () { });

    window.close();
  },

  /**
   * Open the options page in a new tab.
   */
  options: function (e) {
    chrome.tabs.create({
      url: 'options/index.html',
      active: true
    });

    window.close();
  },


  /**
   * Listener for the click event on links in the browser action.
   * By default, links don't open in a browser action.
   */
  preview: function (e) {
    e.preventDefault();
    //TODO get tab of preview window for this url or create
    chrome.tabs.create({
      url: $(e.target).attr('href'),
      active: false
    });
  }
};

$(document).ready(function () {
  BrowserAction.init();
});
