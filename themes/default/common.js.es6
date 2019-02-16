// --- JS Error Logger --------------------------------------------------------

window.onerror = (msg, errorLocation, lineNo, columnNo, error) => {
  $.post('/debug/jserrorlog', {
    message: msg,
    line: lineNo,
    column: columnNo,
    url: errorLocation,
    useragent: navigator.userAgent,
    stack: error,
  }, 'multipart/form-data');
  // Something failed hard, but alerts *should* still work
  // eslint-disable-next-line no-alert
  alert(`${msg}\nFile: ${errorLocation}\nLine: ${lineNo}\nColumn: ${columnNo}`);
};

// --- Common Functions -------------------------------------------------------

function uuid() {
  let random;
  let i;

  let result = '';
  let seed = Date.now();

  for (i = 0; i < 32; i += 1) {
    // eslint-disable-next-line no-bitwise
    random = (seed + Math.random() * 16) % 16 | 0;
    seed = Math.floor(seed / 16);

    if (i === 8 || i === 12 || i === 16 || i === 20) {
      result += '-';
    }

    if (i === 12) {
      result += (4).toString(16);
    } else if (i === 16) {
      // eslint-disable-next-line no-bitwise
      result += (random & (3 | 8)).toString(16);
    } else {
      result += random.toString(16);
    }
  }
  return result;
}

function sleep(time) {
  if (typeof Promise !== 'undefined' && Promise.toString().indexOf('[native code]') !== -1) {
    return new Promise((resolve) => { setTimeout(resolve, time); });
  }
  return undefined;
}

function getJson(inputURL) {
  return $.ajax({
    dataType: 'json',
    url: inputURL,
    async: false,
  }).responseJSON;
}

function getMenu() {
  const url = '/api/menu';
  const result = getJson(url);

  if (result !== undefined && Object.keys(result).length > 0) {
    return result;
  }
  return undefined;
}

function loadFrame(url) {
  const ifrObj = $('#ifr').get(0);

  if (ifrObj !== undefined) {
    ifrObj.contentWindow.location.replace(url);
  }
}

function cacheRedirect(country) {
  loadFrame(`/cache/redirect/${country}/index.html`);
}

function cacheTheme() {
  loadFrame('/cache/theme/index.html');
}

function cacheCategory(category) {
  loadFrame(`/cache/category/${category}/index.html`);
}

function cacheEntry(category, entry) {
  loadFrame(`/cache/entry/${category}/${entry}/index.html`);
}

function cacheAll() {
  loadFrame('/cache/all/index.html');
}

function checkUAMatch(validUAs) {
  let result = false;
  const currentUA = navigator.userAgent;

  if ($.inArray(currentUA, validUAs) !== -1) {
    return true;
  }

  $.each(validUAs, (i, field) => {
    const pattern = new RegExp(field);
    if (pattern.test(currentUA)) {
      result = true;
    }
  });
  return result;
}

function loadEntry(category, entry, redirect) {
  if (redirect) {
    window.location = `/exploits/${category}/${entry}/index.html`;
    // TODO: window.location.href or window.location
  } else {
    loadFrame(`/exploits/${category}/${entry}/index.html`);
    // JQuery: getScript(`/exploits/${category}/${entry}/index.html`);
  }
}

function clearFrame() {
  loadFrame('/blank.html');
}

function safeRedirect(url) {
  clearFrame();
  // document.getElementById('ifr').addEventListener('load', () => {}
  $('#ifr').on('load', () => {
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
  document.cookie = `autoload=${category}/${entry}; expires=Tue, 19 Jan 2038 03:14:07 UTC;`;
}

function clearAutoload() {
  document.cookie = 'autoload=; expires=Mon, 01 Jan 2001 00:00:00 UTC;';
}

function getCookie(cname) {
  let result;

  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookies = decodedCookie.split(';');

  $.each(cookies, (i, field) => {
    while (field.charAt(0) === ' ') {
      field = field.substring(1);
    }
    if (field.indexOf(name) === 0) {
      result = field.substring(name.length, field.length);
    }
  });
  return result;
}

function autoloadCookie(menu) {
  let category;
  let entry;

  const autoload = getCookie('autoload');

  if (autoload) {
    try {
      category = autoload.split('/')[0];
      entry = autoload.split('/')[1];

      if (!(category in menu) || !(entry in menu[category].entries)) {
        clearAutoload();
      } else {
        // TODO: Verify index.html is reachable
        return autoload;
      }
    } catch (e) {
      clearAutoload();
    }
  }
  return false;
}

function imageToBackground(src, callback, outputFormat) {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function onImageLoad() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.height = this.naturalHeight;
    canvas.width = this.naturalWidth;
    ctx.drawImage(this, 0, 0);
    const dataURL = canvas.toDataURL(outputFormat);
    callback(dataURL);
  };
  img.src = src;
  if (img.complete || img.complete === undefined) {
    img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    img.src = src;
  }
}

function clearThemeLoader() {
  document.getElementById('theme-loader').parentNode.removeChild(document.getElementById('theme-loader'));
  xhrThemeLoader = undefined;
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
