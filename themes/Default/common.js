"use strict";
function _typeof(a) {
  return (
    (_typeof =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (a) {
            return typeof a;
          }
        : function (a) {
            return a &&
              "function" == typeof Symbol &&
              a.constructor === Symbol &&
              a !== Symbol.prototype
              ? "symbol"
              : typeof a;
          }),
    _typeof(a)
  );
}
function getBasePath() {
  var b = "".concat(window.location.origin).concat(window.location.pathname);
  return "/" === b.slice(-1) && (b = b.slice(0, -1)), b;
}
window.onerror = function (a, b, c, d, e) {
  if (b === document.location.href)
    return void alert(
      "User Custom JS Error\n\n"
        .concat(a, "\nLine: ")
        .concat(c, "\nColumn: ")
        .concat(d)
    );
  var f = JSON.stringify({
      message: a,
      line: c,
      column: d,
      url: b,
      useragent: navigator.userAgent,
      stack: e,
    }),
    g = new XMLHttpRequest();
  g.open("POST", "".concat(getBasePath(), "/debug/jserrorlog"), !0),
    g.setRequestHeader("Content-Type", "application/json"),
    navigator.onLine
      ? ((g.onload = function () {
          200 <= g.status && 400 > g.status
            ? alert(
                "Successfully Submitted Error Log\n\n"
                  .concat(a, "\nFile: ")
                  .concat(b, "\nLine: ")
                  .concat(c, "\nColumn: ")
                  .concat(d)
              )
            : alert(
                "Error Submitting Error Log\n\n"
                  .concat(a, "\nFile: ")
                  .concat(b, "\nLine: ")
                  .concat(c, "\nColumn: ")
                  .concat(d)
              );
        }),
        (g.onerror = function () {
          alert(
            "Error Submitting Error Log\n\n"
              .concat(a, "\nFile: ")
              .concat(b, "\nLine: ")
              .concat(c, "\nColumn: ")
              .concat(d)
          );
        }))
      : alert(
          "Offline, No Error Log Submitted\n\n"
            .concat(a, "\nFile: ")
            .concat(b, "\nLine: ")
            .concat(c, "\nColumn: ")
            .concat(d)
        ),
    g.send(f);
};
function int2Hex(a) {
  return a.toString(16);
}
function uuid() {
  var b,
    c,
    a = Math.floor,
    d = "",
    e = Date.now();
  for (c = 0; 32 > c; c += 1)
    (b = 0 | (e + 16 * Math.random()) % 16),
      (e = a(e / 16)),
      (8 === c || 12 === c || 16 === c || 20 === c) && (d += "-"),
      (d += 12 === c ? int2Hex(4) : 16 === c ? int2Hex(11 & b) : int2Hex(b));
  return d;
}
function sleep(a) {
  return new Promise(function (b) {
    setTimeout(b, a);
  });
}
function getJson(a) {
  var b = new XMLHttpRequest();
  return (
    b.open("GET", a, !1),
    b.setRequestHeader("Content-Type", "application/json"),
    b.send(),
    !!(4 === b.readyState && 200 <= b.status && 400 > b.status) &&
      JSON.parse(b.responseText)
  );
}
function getJsonAsync(a, b) {
  var c = new XMLHttpRequest();
  c.open("GET", a, !0),
    c.setRequestHeader("Content-Type", "application/json"),
    (c.onload = function () {
      200 <= c.status && 400 > c.status ? b(JSON.parse(c.responseText)) : b(!1);
    }),
    (c.onerror = function () {
      b(!1);
    }),
    c.send();
}
function getMenu() {
  var a = "".concat(getBasePath(), "/api/menu"),
    b = getJson(a);
  return !!(void 0 !== b && 0 < Object.keys(b).length) && b;
}
function getMenuAsync(a) {
  var b = "".concat(getBasePath(), "/api/menu");
  getJsonAsync(b, function (b) {
    b && {} !== b ? a(b) : a(!1);
  });
}
function getSettings() {
  var a = "".concat(getBasePath(), "/api/themes"),
    b = getJson(a);
  return !!(void 0 !== b && 0 < Object.keys(b).length) && b;
}
function getSettingsAsync(a) {
  var b = "".concat(getBasePath(), "/api/themes");
  getJsonAsync(b, function (b) {
    b && {} !== b ? a(b) : a(!1);
  });
}
function getData(a, b) {
  var c = new XMLHttpRequest();
  return (
    c.open("GET", b ? "https://cors.plus/".concat(a) : a, !1),
    c.send(),
    !!(4 === c.readyState && 200 <= c.status && 400 > c.status) &&
      c.responseText
  );
}
function getDataAsync(a, b, c) {
  var d = new XMLHttpRequest();
  d.open("GET", c ? "https://cors.plus/".concat(a) : a, !0),
    (d.onload = function () {
      200 <= d.status && 400 > d.status ? b(d.responseText) : b(!1);
    }),
    (d.onerror = function () {
      b(!1);
    }),
    d.send();
}
function loadFrame(a) {
  var b = document.getElementById("ifr");
  b !== void 0 && b.contentWindow.location.replace(a);
}
function loadEntry(a, b, c) {
  c
    ? (window.location.href = ""
        .concat(getBasePath(), "/exploits/")
        .concat(a, "/")
        .concat(b, "/index.html"))
    : loadFrame(
        ""
          .concat(getBasePath(), "/exploits/")
          .concat(a, "/")
          .concat(b, "/index.html")
      );
}
function clearFrame() {
  loadFrame("".concat(getBasePath(), "/blank.html"));
}
function safeRedirect(a) {
  clearFrame(),
    document.getElementById("ifr").addEventListener("load", function () {
      window.location.href = a;
    });
}
function cacheTheme() {
  loadFrame("".concat(getBasePath(), "/cache/theme/index.html"));
}
function cacheCategory(a) {
  loadFrame(
    "".concat(getBasePath(), "/cache/category/").concat(a, "/index.html")
  );
}
function cacheEntry(a, b) {
  loadFrame(
    ""
      .concat(getBasePath(), "/cache/entry/")
      .concat(a, "/")
      .concat(b, "/index.html")
  );
}
function cacheAll() {
  loadFrame("".concat(getBasePath(), "/cache/all/index.html"));
}
function setStorage(a, b, c) {
  return (
    !("string" != typeof c || _typeof(b) !== c) &&
    (localStorage.setItem(a, b), !0)
  );
}
function getStorage(a) {
  return null !== localStorage.getItem(a) && localStorage.getItem(a);
}
function deleteStorage(a) {
  localStorage.removeItem(a);
}
function setCookie(a, b, c) {
  var d = "";
  if (c) {
    var e = new Date();
    e.setTime(e.getTime() + 1e3 * (60 * (60 * (24 * c)))),
      (d = "; expires=".concat(e.toUTCString()));
  }
  document.cookie = ""
    .concat(a, "=")
    .concat(encodeURIComponent(b))
    .concat(d, "; domain=")
    .concat(window.location.hostname, "; path=")
    .concat(window.location.pathname, ";");
}
function deleteCookie(a) {
  document.cookie = "".concat(a, "=; expires=Thu, 01 Jan 1970 00:00:00 UTC;");
}
function getCookie(a) {
  for (
    var b,
      c = "".concat(a, "="),
      d = decodeURIComponent(document.cookie),
      e = d.split(";"),
      f = 0;
    f < e.length;
    f += 1
  ) {
    for (b = e[f]; " " === b.charAt(0); ) b = b.substring(1);
    if (0 === b.indexOf(c)) return decodeURI(b.substring(c.length, b.length));
  }
}
function setAutoload(a, b) {
  setCookie("autoload", "".concat(a, "/").concat(b), 36500);
}
function autoloadCookie(a) {
  var b = getCookie("autoload");
  if (b)
    try {
      var c = b.split("/")[0],
        d = b.split("/")[1];
      if (!(c in a) || !(d in a[c].entries)) deleteCookie("autoload");
      else return b;
    } catch (a) {
      deleteCookie("autoload");
    }
  return !1;
}
function imageToBackground(a, b, c, d) {
  var e = new Image();
  (e.crossOrigin = "Anonymous"),
    (e.onload = function () {
      var a = document.createElement("canvas"),
        c = a.getContext("2d");
      (a.height = this.naturalHeight),
        (a.width = this.naturalWidth),
        c.drawImage(this, 0, 0);
      var e = a.toDataURL(d);
      b(e);
    }),
    (e.src = c ? "https://cors.plus/".concat(a) : a);
}
function checkUAMatch(a) {
  var b = navigator.userAgent;
  if (-1 < a.indexOf(b)) return !0;
  for (var c, d = 0; d < a.length; d += 1)
    if (((c = new RegExp(a[d])), c.test(b))) return !0;
  return !1;
}
