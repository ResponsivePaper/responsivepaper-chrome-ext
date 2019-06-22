/**
 * Urls object used by background.js
 * @constructor
 * @param {Object} param JSON style object
 * Example:
 * urls = {
    'google.com' : {.
      _enabled: true
    }
  }
 */
function Urls(param) {
  this.urls = param;

  this.ENABLED_PROPERTY = "_enabled";
}

/**
 * Delete a url.
 * @param {String} url The url to delete.
 */
Urls.prototype.delete = function (url) {
  delete this.Urls[url];
  this.persist();
};

/**
 * Return the style object associated with the given url.
 *   If no url is given, return all the style objects.
 * @param {String} url The URL of the requested object.
 * @return {Object} The request style(s) object(s).
 */
Urls.prototype.get = function (url) {
  if (url === undefined) {
    return this.urls;
  } else {
    return this.urls[url];
  }
};

Urls.prototype.set = function (url, value) {
  if (url === undefined) {
    return false;
  } else {
    this.urls[url] = value;
    return this.urls[url];
  }
};

Urls.prototype.persist = function () {
  chrome.storage.local.set({ 'urls': this.urls });
}

/**
 * Create a new entry for the specified URL
 * @param {String} url URL of the new object.
 */
Urls.prototype.create = function (url) {
  this.urls[url] = {};
  this.urls[url][this.ENABLED_PROPERTY] = true;
  this.persist();
};


/**
 * Retrieve the enabled status for the given URL.
 * @param {String} url URL of the requested object.
 * @return {Boolean} The enabled status for the given URL.
 */
Urls.prototype.isEnabled = function (url) {
  if (this.urls[url] === undefined) {
    return false;
  }
  return this.urls[url][this.ENABLED_PROPERTY];
};

/**
 * Save the given rules and metadata inside the style for the given URL.
 *   If no rules are given, delete the given URL's style.
 * @param {String} url URL of the saved object.
 */
Urls.prototype.save = function (url) {
  if (!url || url === '') {
    return;
  }

  this.create(url);
};

/**
 * If no value is given, toggle the enabled status for the given URL.
 *   Otherwise, set the enabled status for the given URL.
 * @param {String} url URL of the saved object.
 * @param {Object} value The enabled status for the given URL.
 */
Urls.prototype.toggle = function (url, value, shouldSave) {
  if (this.isEmpty(url)) {
    return false;
  }

  if (value != undefined && value != null) {
    this.urls[url][this.ENABLED_PROPERTY] = value;
  } else {
    this.urls[url][this.ENABLED_PROPERTY] = !this.urls[url][this.ENABLED_PROPERTY];
  }

  if (shouldSave) {
    this.persist();
  }

  return true;
};

/**
 * If no value is given, toggle the enabled status for all the styles.
 *   Otherwise, set the enabled status for all the styles.
 * @param {Object} value The enabled status.
 */
Urls.prototype.toggleAll = function (value) {
  for (var url in this.urls) {
    this.toggle(url, value, false);
  }
  this.persist();
};

Urls.prototype.deleteAll = function () {
  this.styles = {};
  this.persist();
};

/**
 * Check if the style for the given identifier exists.
 * @param {String} url The style's identifier.
 * @return {Boolean} True if the requested style exists.
 */
Urls.prototype.isEmpty = function (url) {
  return this.urls[url] === undefined || this.urls[url] == null;
};


/**
 * Import a url object i.e. replace the existing urls
 *   object with the specified object
 * @param {Object} newUrls Urls object to import.
 */
Urls.prototype.import = function (newUrls) {
  for (var url in newUrls) {

    this.create(url);
  }

  this.persist();
};





