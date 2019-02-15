// --- JS Error Logger --------------------------------------------------------

window.onerror = function (msg, errorLocation, lineNo, columnNo, error) {
  $.post('/debug/jserrorlog', {
    message: msg,
    line: lineNo,
    column: columnNo,
    url: errorLocation,
    useragent: navigator.userAgent,
    stack: error,
  }, 'multipart/form-data');
  // Something failed hard but alerts *should* still work
  // eslint-disable-next-line no-alert
  alert(msg + '\nFile: ' + errorLocation + '\nLine: ' + lineNo + '\nColumn: ' + columnNo);
};

// --- Common Functions -------------------------------------------------------

function uuid() {
  var random;
  var i;

  var result = '';
  var seed = Date.now();

  for (i = 0; i < 32; i += 1) {
    random = (seed + Math.random() * 16) % 16 | 0;
    seed = Math.floor(seed / 16);

    if (i === 8 || i === 12 || i === 16 || i === 20) {
      result += '-';
    }

    if (i === 12) {
      result += (4).toString(16);
    } else if (i === 16) {
      result += (random & (3 | 8)).toString(16);
    } else {
      result += random.toString(16);
    }
  }
  return result;
}

function sleep(time) {
  if (typeof Promise !== 'undefined' && Promise.toString().indexOf('[native code]') !== -1) {
    // The statement below should be this function without the arrow:
    // return new Promise((resolve) => setTimeout(resolve, time));
    return new Promise(function (resolve) { return setTimeout(resolve, time); }, this);
  }
  return undefined;
}

function getServerIP() {
  var response = $.ajax({
    dataType: 'text',
    url: '/api/serverip',
    async: false,
  }).responseText;

  if (response === '165.227.83.145:80') {
    response = 'https://cthugha.thegate.network/';
  } else if (response === '108.61.128.158:80') {
    response = 'https://ithaqua.thegate.network/';
  } else {
    response = 'http://' + response;
  }

  return response;
}

function getJson(inputURL) {
  return $.ajax({
    dataType: 'json',
    url: inputURL,
    async: false,
  }).responseJSON;
}

function sendJson(inputURL, message) {
  return $.ajax({
    type: 'POST',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    url: inputURL,
    data: message,
    async: false,
  }).responseJSON;
}

function getCategories() {
  var url = '/api/categories';
  var result = getJson(url);

  if (result !== undefined && Object.keys(result).length > 0) {
    return result;
  }
  return undefined;
}

function getEntries(category) {
  var url = '/api/entries/' + category;
  var result = getJson(url);

  if (result !== undefined && Object.keys(result).length > 0) {
    return result;
  }
  return undefined;
}

function getMenu() {
  var url = '/api/menu';
  var result = getJson(url);

  if (result !== undefined && Object.keys(result).length > 0) {
    return result;
  }
  return undefined;
}

function defaultHomepages() {
  if (window.location.hostname === 'www.playstation.com' || window.location.hostname === 'manuals.playstation.net') {
    return true;
  }
  return false;
}

function hostRedirect() {
  window.location.replace(getServerIP());
}

function loadFrame(url) {
  var ifrObj = $('#ifr').get(0);

  if (ifrObj !== undefined) {
    ifrObj.contentWindow.location.replace(url);
  }
}

function cacheRedirect(country) {
  loadFrame('/cache/redirect/' + country + '/index.html');
}

function cacheTheme() {
  loadFrame('/cache/theme/index.html');
}

function cacheCategory(category) {
  loadFrame('/cache/category/' + category + '/index.html');
}

function cacheEntry(category, entry) {
  loadFrame('/cache/entry/' + category + '/' + entry + '/index.html');
}

function cacheAll() {
  loadFrame('/cache/all/index.html');
}

function isCategoryCacheable(category) {
  if (category === undefined || category.Cacheable === undefined
    || typeof (category.Cacheable) !== typeof (true)) {
    return false;
  }
  return category.Cacheable;
}

function isEntryAvailableOffline(entry) {
  if (entry === undefined || entry.Offline === undefined
    || typeof (entry.Offline) !== typeof (true)) {
    return false;
  }
  return entry.Offline;
}

function checkUAMatch(validUAs) {
  var result = false;
  var currentUA = navigator.userAgent;

  if ($.inArray(currentUA, validUAs) !== -1) {
    return true;
  }

  $.each(validUAs, function (i, field) {
    var pattern = new RegExp(field);
    if (pattern.test(currentUA)) {
      result = true;
    }
  });
  return result;
}

function loadEntry(category, entry, redirect) {
  if (redirect) {
    window.location = '/exploits/' + category + '/' + entry + '/index.html';
    // TODO:
    // window.location.href = '/exploits/' + category + '/' + entry + '/index.html'; // Which one?
  } else {
    loadFrame('/exploits/' + category + '/' + entry + '/index,html');
    // $.getScript('/exploits/' + category + '/' + entry + '/index.js');
  }
}

function clearFrame() {
  loadFrame('/blank.html');
}

function safeRedirect(url) {
  clearFrame();
  $('#ifr').on('load', function () {
    window.location.href = url;
  });
}

function getStorage(key) {
  if (localStorage.getItem(key) !== null) {
    return localStorage.getItem(key);
  }
  return false;
}

function setStorage(key, value, datatype) {
  if (typeof datatype === 'string') {
    // Don't need to lint for valid-typeof on next line as we solved the issue above
    // eslint-disable-next-line valid-typeof
    if (typeof value === datatype) {
      localStorage.setItem(key, value);
      return true;
    }
  }
  return false;
}

function getLanguage() {
  return getStorage('language');
}

function setLanguage(lang) {
  setStorage('language', lang, 'string');
}

function setAutoload(category, entry) {
  document.cookie = 'autoload=' + category + '/' + entry + '; expires=Tue, 19 Jan 2038 03:14:07 UTC;';
}

function clearAutoload() {
  document.cookie = 'autoload=; expires=Mon, 01 Jan 2001 00:00:00 UTC;';
}

function getCookie(cname) {
  var result;

  var name = cname + '=';
  var decodedCookie = decodeURIComponent(document.cookie);
  var cookies = decodedCookie.split(';');

  $.each(cookies, function (i, field) {
    while (field.charAt(0) === ' ') {
      field = field.substring(1);
    }
    if (field.indexOf(name) === 0) {
      result = field.substring(name.length, field.length);
    }
  });
  return result;
}

function autoloadCookie() {
  var category;
  var entry;

  var autoload = getCookie('autoload');

  if (autoload) {
    try {
      category = autoload.split('/')[0];
      entry = autoload.split('/')[1];
      if ($.inArray(category, getCategories()) === -1
        || $.inArray(entry, getEntries(category)) === -1) {
        clearAutoload();
      } else {
        return autoload;
      }
    } catch (e) {
      clearAutoload();
    }
  }
  return false;
}

// --- Redirects --------------------------------------------------------------

if (window.location.hostname === '165.227.83.145') {
  window.location.replace('https://cthugha.thegate.network/');
}

if (window.location.hostname === '108.61.128.158') {
  window.location.replace('https://ithaqua.thegate.network/');
}

if (defaultHomepages() && !navigator.onLine) {
  hostRedirect();
}

/*
Copyright (c) 2017-2018 Al Azif, https://github.com/Al-Azif/ps4-exploit-host

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
