// --- Specific Theme Functions -----------------------------------------------

function hostRedirect() {
  // For DNS Usage:
  // location.replace("https://cthugha.thegate.network/");
  // Otherwise:
  location.replace(getServerIP());
}

function defaultHomepages() {
  if (location.hostname === 'www.playstation.com' || location.hostname === 'manuals.playstation.net') {
    return true;
  }
  return undefined;
}

function myAlert(type, message, wait) {
  var safeWait;

  var alertID = 'alert-' + uuid();
  var alertString = '<div class="alert alert-' + type + ' alert-dismissible fade collapse" id="' + alertID + '" role="alert">';

  if (wait === undefined) {
    safeWait = 3000;
  } else {
    safeWait = wait;
  }
  alertString += message;
  alertString += '<button type="button" class="close" data-dismiss="alert" aria-label="Close">';
  alertString += '<span aria-hidden="true">&times;</span>';
  alertString += '</button>';
  alertString += '</div>';
  $('#alertBox').append(alertString);
  $('#' + alertID).collapse('show');
  // # TODO: Calculate top
  // $("#alert-" + randomID).css("top", ($(".alert").length));
  if (safeWait !== 0) {
    sleep(safeWait).then(function () {
      $('#' + alertID).alert('close');
      // TODO: Shift remaining alerts up
    });
  }
}

function newsAlert() {
  var news = getJson('/news');
  var date = getStorage('newsDate');
  if (news !== undefined && (date === undefined || news.Date > date) && news.Message !== undefined && news.Severity !== undefined) {
    if (autoloadCookie() !== undefined) {
      alert(news.Message);
    } else {
      myAlert(news.Severity, news.Message, 0);
    }
    setStorage('newsDate', news.Date, typeof (1));
  }
}

function buildCategoryButtons() {
  var buttonString = '';
  var buttonCount = 0;
  var categories = getCategories();

  if (categories !== undefined) {
    $.each(categories, function (i, field) {
      if (field === 'No Categories Found' || field === 'I/O Error on Host') {
        return;
      }
      if (navigator.onLine && isCategoryCacheable(field)) {
        buttonString += '<div class="btn-group">';
        buttonString += '<button class="btn btn-primary btn-custom-main" onclick="loadPage(\'Exploit Selection\', \'' + field + '\');">' + field + '</button>';
        buttonString += '<button type="button" class="btn btn-primary btn-custom-dropdown dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>';
        buttonString += '<div class="dropdown-menu">';
        buttonString += '<a class="dropdown-item" href="#" onclick="myCategoryMeta(\'' + field + '\');">About</a>';
        buttonString += '<div class="dropdown-divider"></div>';
        buttonString += '<a class="dropdown-item" href="#" onclick="cacheCategory(\'' + field + '\');">Cache</a>';
        buttonString += '</div>';
        buttonString += '</div>';
        buttonCount += 1;
        if (buttonCount % 3 === 0) {
          buttonString += '<br>';
        }
      } else if ((navigator.onLine && !isCategoryCacheable(field)) || (!navigator.onLine && isCategoryCacheable(field))) {
        buttonString += '<div class="btn-group">';
        buttonString += '<button class="btn btn-primary btn-custom-main" onclick="loadPage(\'Exploit Selection\', \'' + field + '\');">' + field + '</button>';
        buttonString += '<button type="button" class="btn btn-primary btn-custom-dropdown dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>';
        buttonString += '<div class="dropdown-menu">';
        buttonString += '<a class="dropdown-item" href="#" onclick="myCategoryMeta(\'' + field + '\');">About</a>';
        buttonString += '</div>';
        buttonString += '</div>';
        buttonCount += 1;
        if (buttonCount % 3 === 0) {
          buttonString += '<br>';
        }
      }
    });
    buttonString += '<div class="btn-group">';
    buttonString += '<button class="btn btn-primary btn-custom-main btn-custom-full" onclick="cacheAll();">[Cache All]</button>';
    buttonString += '</div>';
    return buttonString;
  }
  return undefined;
}

function buildEntryButtons(category) {
  var buttonString = '';
  var buttonCount = 0;
  var entries = getEntries(category);

  if (entries !== undefined) {
    $.each(entries, function (i, field) {
      if (field === 'No Entries Found' || field === 'I/O Error on Host') {
        return;
      }
      if (navigator.onLine && isCategoryCacheable(category)) {
        buttonString += '<div class="btn-group">';
        buttonString += '<button class="btn btn-primary btn-custom-main" onclick="myLoader(\'' + category + '\', \'' + field + '\');">' + field + '</button>';
        buttonString += '<button type="button" class="btn btn-primary btn-custom-dropdown dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>';
        buttonString += '<div class="dropdown-menu">';
        buttonString += '<a class="dropdown-item" href="#' + category + '" onclick="myEntryMeta(\'' + category + '\', \'' + field + '\');">About</a>';
        buttonString += '<a class="dropdown-item" href="#' + category + '" onclick="mySetAutoload(\'' + category + '\', \'' + field + '\');">Autoload</a>';
        buttonString += '<div class="dropdown-divider"></div>';
        buttonString += '<a class="dropdown-item" href="#' + category + '" onclick="cacheEntry(\'' + category + '\', \'' + field + '\');">Cache</a>';
        buttonString += '</div>';
        buttonString += '</div>';
        buttonCount += 1;
        if (buttonCount % 3 === 0) {
          buttonString += '<br>';
        }
      } else if ((navigator.onLine && !isCategoryCacheable(category)) || (!navigator.onLine && isEntryAvailableOffline(category, field))) {
        buttonString += '<div class="btn-group">';
        buttonString += '<button class="btn btn-primary btn-custom-main" onclick="myLoader(\'' + category + '\', \'' + field + '\');">' + field + '</button>';
        buttonString += '<button type="button" class="btn btn-primary btn-custom-dropdown dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>';
        buttonString += '<div class="dropdown-menu">';
        buttonString += '<a class="dropdown-item" href="#' + category + '" onclick="myEntryMeta(\'' + category + '\', \'' + field + '\');">About</a>';
        buttonString += '<a class="dropdown-item" href="#' + category + '" onclick="mySetAutoload(\'' + category + '\', \'' + field + '\');">Autoload</a>';
        buttonString += '</div>';
        buttonString += '</div>';
        buttonCount += 1;
        if (buttonCount % 3 === 0) {
          buttonString += '<br>';
        }
      }
    });
    return buttonString;
  }
  return undefined;
}

function loadPage(title, header) {
  var safeTitle;
  var safeHeader;
  var categoryList;
  var categoryButtons;
  var entryButtons;

  if (title === undefined || header === undefined) {
    safeTitle = 'Category Selection';
    safeHeader = 'Categories';
  } else {
    safeTitle = title;
    safeHeader = header;
  }

  if (safeTitle === 'Category Selection') {
    categoryList = getCategories();
    if (categoryList.length === 1) {
      loadPage('Exploit Selection', categoryList[0]);
      return;
    }

    categoryButtons = buildCategoryButtons();
    if (categoryButtons !== undefined) {
      $(document).attr('title', safeTitle + ' | Exploit Host by Al Azif');
      $('#title').html(safeTitle);
      $('#header').html(safeHeader);
      $('#buttons').html(categoryButtons);
    } else {
      myAlert('danger', 'Error retrieving categories!');
    }
  } else if (safeTitle === 'Exploit Selection') {
    entryButtons = buildEntryButtons(safeHeader);
    if (entryButtons !== undefined) {
      history.pushState(null, null, '#' + safeHeader);
      $(document).attr('title', safeTitle + ' | Exploit Host by Al Azif');
      $('#title').html(safeTitle);
      $('#header').html(safeHeader);
      $('#buttons').html(entryButtons);
    } else {
      myAlert('danger', 'Error retrieving entries!');
    }
  } else {
    myAlert('danger', 'Theme error');
  }
}

function clearOverlays() {
  $('#cacheOverlay').hide();
  $('#barText').hide();
  $('#barBack').hide();
  $('#barLoad').hide();
  $('#barLoad').html('');
  $('#barLoad').width('0%');
  $('#exploitOverlay').hide();
  $('#exploitMessage').hide();
  $('#exploitMessage').html('');
  $('#exploitLoader').hide();
}

function showCaching() {
  $('#cacheOverlay').show();
  $('#barText').show();
  $('#barBack').show();
  $('#barLoad').show();
}

function showLoader() {
  $('#exploitOverlay').show();
  $('#exploitLoader').show();
  $('#exploitMessage').show();
}

function exploitDone(message) {
  $('#exploitLoader').hide();
  $('#exploitMessage').html(message);
  sleep(3000).then(function () {
    if ($('#exploitMessage').html() !== 'Waiting...' && $('#exploitMessage').html() !== 'Awaiting Payload...') {
      clearFrame();
      clearOverlays();
    }
  });
}

function cacheInterface(callback) {
  if (callback === 'ondownloading') {
    $('#barText').html('Caching...');
    showCaching();
  } else if (callback === 'ondownloading-redirect') {
    $('#barText').html('Caching Redirect...');
    showCaching();
  } else if (callback === 'ondownloading-theme') {
    $('#barText').html('Caching Theme...');
    showCaching();
  } else {
    clearFrame();
    clearOverlays();
    if (callback === 'oncached') {
      myAlert('success', 'Cached Successfully');
    } else if (callback === 'onupdateready') {
      myAlert('success', 'Cache updated');
    } else if (callback === 'onnoupdate') {
      myAlert('primary', 'No update available');
    } else if (callback === 'onerror') {
      myAlert('danger', 'Error caching resources');
    } else if (callback === 'onobsolete') {
      myAlert('danger', 'Manifest returned a 404, cache was deleted');
    } else if (callback === 'oncached-redirect' || callback === 'onupdateready-redirect' || callback === 'onnoupdate-redirect') {
      hostRedirect();
    } else if (callback === 'onerror-redirect') {
      myAlert('danger', 'Error caching redirect');
    } else if (callback === 'onobsolete-redirect') {
      myAlert('danger', 'Manifest returned a 404, redirect was deleted');
    } else if (callback === 'oncached-theme' || callback === 'onnoupdate-theme') {
      // Do Nothing...
    } else if (callback === 'onupdateready-theme') {
      setStorage('newsDate', 0, typeof (1));
      location.reload(true);
    } else if (callback === 'onerror-theme') {
      myAlert('danger', 'Error caching theme resources');
    } else if (callback === 'onobsolete-theme') {
      myAlert('danger', 'Manifest returned a 404, theme cache was deleted');
    }
  }
}

function cacheProgress(percent) {
  $('#barLoad').width(percent + '%');
  $('#barLoad').html(percent + '%');
}

function myLoader(category, entry) {
  showLoader();
  loadEntry(category, entry);
}

function mySetAutoload(category, entry) {
  setAutoload(category, entry);
  if (isCategoryCacheable(category)) {
    cacheEntry(category, entry);
  }
  // TODO: Wait for cache to complete (Check for alerts?)
  // then loadEntry(category, entry)
}

function myCategoryMeta(category) {
  var title;
  var device;
  var firmware;
  var lang;
  var notes;
  var modalBody;

  var uaMatch = '<span class="badge badge-danger">Mismatch</span>';
  var meta = getCategoryMeta(category);

  if (meta === undefined) {
    myAlert('danger', 'Unable to retrieve metadata');
    return;
  }

  if (meta.Title !== undefined) {
    title = meta.Title;
  }

  if (meta.Device !== undefined) {
    device = meta.Device;
  }

  if (meta.Firmware !== undefined) {
    firmware = meta.Firmware;
  }

  if (checkUAMatch(meta.User_Agents)) {
    uaMatch = '<span class="badge badge-success">Match</span>';
  }

  lang = getLanguage();
  if (lang === undefined) {
    setLanguage('default');
    lang = 'default';
  }

  notes = meta.Notes[lang];
  if (notes === undefined) {
    notes = meta.Notes.default;
  }
  if (notes === undefined) {
    notes = '';
  }

  modalBody = '<div class="row"><div class="col-sm-3">Device:</div><div class="col-sm-9">' + device + '</div></div>';
  modalBody += '<div class="row"><div class="col-sm-3">Firmware:</div><div class="col-sm-9">' + firmware + '</div></div>';
  modalBody += '<div class="row"><div class="col-sm-3">UA Match?:</div><div class="col-sm-9">' + uaMatch + '</div></div>';
  modalBody += '<div class="row"><div class="col-sm-3">Notes:</div><div class="col-sm-9">' + notes + '</div></div>';

  $('#metaModalTitle').html(title);
  $('#metaModalBody').html(modalBody);
  $('#metaModal').modal('show');
}

function myEntryMeta(category, entry) {
  var lang;
  var description;
  var url;
  var modalBody;

  var title = '';
  var version = '';
  var updated = '';
  var device = '';
  var firmware = '';
  var meta = getEntryMeta(category, entry);

  if (meta === undefined) {
    myAlert('danger', 'Unable to retrieve metadata');
    return;
  }

  if (meta.Title !== undefined) {
    title = meta.Title;
  }

  if (meta.Version !== undefined) {
    version = meta.Version;
  }

  if (meta.Updated !== undefined) {
    updated = meta.Updated;
  }

  if (meta.Device !== undefined) {
    device = meta.Device;
  }

  if (meta.Firmware !== undefined) {
    firmware = meta.Firmware;
  }

  lang = getLanguage();
  if (lang === undefined) {
    setLanguage('default');
    lang = 'default';
  }

  description = meta.Description[lang];
  if (description === undefined) {
    description = meta.Description.default;
  }
  if (description === undefined) {
    description = '';
  }

  if (meta.URL !== undefined) {
    url = meta.URL;
  }

  modalBody = '<div class="row"><div class="col-sm-3">Version:</div><div class="col-sm-9">' + version + '</div></div>';
  modalBody += '<div class="row"><div class="col-sm-3">Updated:</div><div class="col-sm-9">' + updated + '</div></div>';
  modalBody += '<div class="row"><div class="col-sm-3">Device:</div><div class="col-sm-9">' + device + '</div></div>';
  modalBody += '<div class="row"><div class="col-sm-3">Firmware:</div><div class="col-sm-9">' + firmware + '</div></div>';
  modalBody += '<div class="row"><div class="col-sm-3">Description:</div><div class="col-sm-9">' + description + '</div></div>';
  modalBody += '<div class="row"><div class="col-sm-3">URL:</div><div class="col-sm-9"><a href="' + url + '">' + url + '</a></div></div>';

  $('#metaModalTitle').html(title);
  $('#metaModalBody').html(modalBody);
  $('#metaModal').modal('show');
}

// --- Handlers ---------------------------------------------------------------

$(window).on('keyup', function (event) {
  if (event.keyCode === 27) {
    history.replaceState('', document.title, window.location.pathname + window.location.search);
    clearFrame();
    clearOverlays();
    loadPage();
  }
});

// --- Redirects --------------------------------------------------------------

if (location.hostname === '165.227.83.145') {
  location.replace('https://cthugha.thegate.network/');
}

if (location.hostname === '108.61.128.158') {
  location.replace('https://ithaqua.thegate.network/');
}

if (defaultHomepages() !== undefined && !navigator.onLine) {
  hostRedirect();
}

// --- On Ready ---------------------------------------------------------------

$(function () {
  var country;
  var myRegexp;
  var match;
  var autoload;

  $('#ifr').attr('src', '/blank.html');

  if (defaultHomepages() !== undefined && navigator.onLine) {
    country = 'xx';
    myRegexp = /^\/document\/([a-z]{2,5})\/ps4\/index.html$/;
    match = myRegexp.exec(location.pathname);
    if (match !== null) {
      country = match[1];
    }
    cacheRedirect(country);
  } else if (navigator.onLine) {
    cacheTheme();
  }

  if (navigator.onLine) {
    newsAlert();
  }

  if (window.location.hash) {
    loadPage('Exploit Selection', decodeURIComponent(window.location.hash.substr(1)));
  } else {
    loadPage();
  }

  autoload = autoloadCookie();
  if (autoload !== undefined) {
    if (!navigator.onLine && (!isCategoryCacheable(autoload.split('/')[0]) || !isEntryAvailableOffline(autoload.split('/')[0], autoload.split('/')[1]))) {
      myAlert('danger', 'Could not autoload, payload is online only (Currently running from cache)');
    } else {
      myLoader(autoload.split('/')[0], autoload.split('/')[1]);
    }
  }
});
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
