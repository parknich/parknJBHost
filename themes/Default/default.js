"use strict";
function _defineProperty(a, b, c) {
  return (
    b in a
      ? Object.defineProperty(a, b, {
          value: c,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (a[b] = c),
    a
  );
}
function myAlert(a, b, c) {
  var d,
    e = "alert-".concat(uuid()),
    f = '<div class="alert alert-'
      .concat(a, ' alert-dismissible fade collapse" id="')
      .concat(e, '" role="alert">');
  (d = void 0 === c ? 3e3 : c),
    (f += b),
    (f +=
      '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'),
    (f += "<span>&times;</span>"),
    (f += "</button>"),
    (f += "</div>"),
    $("#alert-box").append(f),
    $("#".concat(e)).collapse("show"),
    0 !== d &&
      sleep(d).then(function () {
        $("#".concat(e)).alert("close");
      });
}
function newsAlert() {
  getJsonAsync("".concat(getBasePath(), "/api/news"), function (a) {
    if (a) {
      var b = a,
        c = getCookie("newsDate");
      b !== void 0 &&
        (c === void 0 || b.Date > c) &&
        b.Message !== void 0 &&
        b.Severity !== void 0 &&
        (autoloadCookie(window.Menu)
          ? (alert(b.Message), setCookie("newsDate", b.Date, 30))
          : (myAlert("".concat(b.Severity, " alert-news"), b.Message, 0),
            $('.alert-news [data-dismiss="alert"]').on("click", function () {
              setCookie("newsDate", b.Date, 30);
            })));
    }
  });
}
function buildHTML() {
  var a = "";
  return $.isEmptyObject(window.Menu)
    ? ((a = '<div class="col-sm-9 col-md-9 col-lg-9">'),
      (a += '<div class="btn-group">'),
      (a +=
        '<button class="btn btn-primary btn-custom-main btn-custom-full" aria-label="No Categories Found">No Categories Found</button>'),
      (a += "</div>"),
      (a += '<div class="btn-group">'),
      (a +=
        '<button class="btn btn-primary btn-custom-main btn-custom-full refresh-button" aria-label="Refresh">Refresh</button>'),
      (a += "</div>"),
      (a += "</div>"),
      void $("#buttons").html(a))
    : "error" in window.Menu &&
      !0 === window.Menu.error &&
      "message" in window.Menu
    ? ((a = '<div class="col-sm-9 col-md-9 col-lg-9">'),
      (a += '<div class="btn-group">'),
      (a +=
        '<button class="btn btn-primary btn-custom-main btn-custom-full" aria-label="'
          .concat(window.Menu.message, '">')
          .concat(window.Menu.message, "</button>")),
      (a += "</div>"),
      (a += '<div class="btn-group">'),
      (a +=
        '<button class="btn btn-primary btn-custom-main btn-custom-full refresh-button" aria-label="Refresh">Refresh</button>'),
      (a += "</div>"),
      (a += "</div>"),
      void $("#buttons").html(a))
    : void (
        window.Menu !== void 0 &&
        ((a = '<div id="category-buttons" class="col-sm-9 col-md-9 col-lg-9">'),
        $.each(window.Menu, function (b, c) {
          (a += '<div class="btn-group">'),
            (a +=
              '<button class="btn btn-primary btn-custom-main category-button" data-category="'
                .concat(c.title, '" aria-label="')
                .concat(c.title, '">')
                .concat(c.title, "</button>")),
            (a +=
              '<button type="button" class="btn btn-primary btn-custom-dropdown dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-label="Dropdown"></button>'),
            (a += '<div class="dropdown-menu">'),
            (a +=
              '<a class="dropdown-item about-button" href="javascript:void(0)" data-category="'.concat(
                c.title,
                '" aria-label="About">About</a>'
              )),
            navigator.onLine &&
              c.offline &&
              ((a += '<div class="dropdown-divider"></div>'),
              (a +=
                '<a class="dropdown-item cache-button" href="javascript:void(0)" data-category="'.concat(
                  c.title,
                  '" aria-label="Cache">Cache</a>'
                ))),
            (a += "</div>"),
            (a += "</div>");
        }),
        navigator.onLine &&
          ((a += '<div class="btn-group">'),
          (a +=
            '<button class="btn btn-primary btn-custom-main btn-custom-full cache-all-button" aria-label="Cache All">[Cache All]</button>'),
          (a += "</div>")),
        (a += "</div>"),
        $("#buttons").append(a),
        $.each(window.Menu, function (b, c) {
          (a =
            '<div class="category-page col-sm-9 col-md-9 col-lg-9" data-category="'.concat(
              c.title,
              '">'
            )),
            "error" in c.entries &&
            !0 === c.entries.error &&
            "message" in c.entries
              ? ((a += '<div class="btn-group">'),
                (a +=
                  '<button class="btn btn-primary btn-custom-main btn-custom-full" aria-label="'
                    .concat(c.entries.message, '">')
                    .concat(c.entries.message, "</button>")),
                (a += "</div>"),
                (a += "</div>"))
              : ($.each(c.entries, function (b, d) {
                  (a += '<div class="btn-group">'),
                    (a +=
                      '<button class="btn btn-primary btn-custom-main entry-button" data-category="'
                        .concat(c.title, '" data-entry="')
                        .concat(d.title, '">')
                        .concat(d.title, "</button>")),
                    (a +=
                      '<button type="button" class="btn btn-primary btn-custom-dropdown dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-label="Dropdown"></button>'),
                    (a += '<div class="dropdown-menu">'),
                    (a +=
                      '<a class="dropdown-item about-button" href="javascript:void(0)" data-category="'
                        .concat(c.title, '" data-entry="')
                        .concat(d.title, '" aria-label="About">About</a>')),
                    (a +=
                      '<a class="dropdown-item autoload-button" href="javascript:void(0)" data-category="'
                        .concat(c.title, '" data-entry="')
                        .concat(
                          d.title,
                          '" aria-label="Autoload">Autoload</a>'
                        )),
                    navigator.onLine &&
                      c.offline &&
                      ((a += '<div class="dropdown-divider"></div>'),
                      (a +=
                        '<a class="dropdown-item cache-button" href="javascript:void(0)" data-category="'
                          .concat(c.title, '" data-entry="')
                          .concat(d.title, '" aria-label="Cache">Cache</a>'))),
                    (a += "</div>"),
                    (a += "</div>");
                }),
                navigator.onLine &&
                  c.offline &&
                  ((a += '<div class="btn-group">'),
                  (a +=
                    '<button class="btn btn-primary btn-custom-main btn-custom-full cache-all-button" data-category="'.concat(
                      c.title,
                      '" aria-label="Cache All">[Cache All]</button>'
                    )),
                  (a += "</div>")),
                window.Failsafe &&
                  ((a += '<div class="btn-group">'),
                  (a +=
                    '<button class="btn btn-primary btn-custom-main btn-custom-full back-button" aria-label="Back">[Back]</button>'),
                  (a += "</div>")),
                (a += "</div>")),
            $("#buttons").append(a);
        }))
      );
}
function clearOverlays() {
  $("#cache-overlay").hide(),
    $("#bar-text").hide(),
    $("#bar-back").hide(),
    $("#bar-load").hide(),
    $("#bar-load").html(""),
    $("#bar-load").width("0%"),
    $("#exploit-overlay").hide(),
    $("#exploit-message").hide(),
    $("#exploit-message").html(""),
    $("#exploit-loader").hide();
}
function showCaching() {
  $("#cache-overlay").show(),
    $("#bar-text").show(),
    $("#bar-back").show(),
    $("#bar-load").show();
}
function showLoader() {
  $("#exploit-overlay").show(),
    $("#exploit-loader").show(),
    $("#exploit-message").show();
}
function exploitDone(a) {
  $("#exploit-loader").hide(), $("#exploit-message").html(a);
  var b = /^https?:\/\/.*\/exploits\/(.*)\/(.*)\/index.html/,
    c = b.exec($("#ifr")[0].contentDocument.URL),
    d = decodeURIComponent(c[1]),
    e = decodeURIComponent(c[2]);
  !0 === window.Menu[d].entries[e].reload &&
    sleep(3e3).then(function () {
      clearFrame(), clearOverlays();
    });
}
function displayHome() {
  $(document).prop("title", "Category Selection | parknJBHost"),
    window.history.replaceState({ location: "", modal: !1 }, null, " "),
    $("#title").text("Category Selection"),
    $("#header").text("Categories"),
    $(".category-page").hide(),
    $("#category-buttons").show();
}
function displayCategory(a) {
  $(document).prop("title", "Exploit Selection | parknJBHost"),
    window.history.pushState({ location: a, modal: !1 }, null, "#".concat(a)),
    $("#title").text("Exploit Selection"),
    $("#header").text(a),
    $("#category-buttons").hide(),
    $(".category-page").hide(),
    $(".category-page").each(function (b, c) {
      $(c).data("category") + "" === a + "" && $(c).show();
    });
}
function exploitLoader(a, b) {
  showLoader(), loadEntry(a, b, window.Menu[a].entries[b].redirect);
}
function triggerAutoload() {
  var a = autoloadCookie(window.Menu);
  if (a) {
    var b = a.split("/")[0],
      c = a.split("/")[1];
    exploitLoader(b, c);
  }
}
function startAutoload(a, b) {
  setAutoload(a, b),
    navigator.onLine ||
    (window.Menu[a].offline && window.Menu[a].entries[b].offline)
      ? navigator.onLine &&
        window.Menu[a].offline &&
        window.Menu[a].entries[b].offline
        ? cacheEntry(a, b)
        : triggerAutoload()
      : myAlert(
          "danger",
          "Could not autoload, payload is online only (Currently offline)"
        );
}
function addCacheStatus(a, b, c) {
  var d = [],
    e = [],
    f = {};
  getStorage("cache-status") || setStorage("cache-status", "{}", "string");
  var g = JSON.parse(getStorage("cache-status"));
  if ("all" === a) {
    d = Object.keys(window.Menu);
    for (var h = 0; h < d.length; h += 1) {
      e = Object.keys(window.Menu[d[h]].entries);
      for (var i = 0; i < e.length; i += 1)
        $.extend(
          !0,
          f,
          _defineProperty(
            {},
            d[h],
            _defineProperty(
              {},
              window.Menu[d[h]].entries[e[i]].title,
              new Date().toISOString()
            )
          )
        );
    }
    setStorage("cache-status", JSON.stringify($.extend({}, g, f)), "string");
  } else if ("category" === a) {
    e = Object.keys(window.Menu[b].entries);
    for (var j = 0; j < e.length; j += 1)
      $.extend(
        !0,
        f,
        _defineProperty(
          {},
          b,
          _defineProperty(
            {},
            window.Menu[b].entries[e[j]].title,
            new Date().toISOString()
          )
        )
      );
    setStorage(
      "cache-status",
      JSON.stringify($.extend(!0, {}, g, f)),
      "string"
    );
  } else
    "entry" === a &&
      setStorage(
        "cache-status",
        JSON.stringify(
          $.extend(
            !0,
            {},
            g,
            _defineProperty(
              {},
              b,
              _defineProperty({}, c, new Date().toISOString())
            )
          )
        ),
        "string"
      );
}
function removeCacheStatus(a, b, c) {
  if (navigator.onLine) {
    if (!getStorage("cache-status"))
      return void setStorage("cache-status", "{}", "string");
    var d = JSON.parse(getStorage("cache-status"));
    "all" === a
      ? setStorage("cache-status", "{}", "string")
      : "category" === a
      ? (delete d[b], setStorage("cache-status", JSON.stringify(d), "string"))
      : "entry" == a &&
        (delete d[b][c],
        setStorage("cache-status", JSON.stringify(d), "string"));
  }
}
function categoryMeta(a) {
  var b,
    c,
    d,
    e = window.Menu[a];
  if ("undefined" == typeof e)
    return void myAlert("danger", "Unable to retrieve metadata");
  $.extend(
    !0,
    {
      title: "",
      device: "",
      firmware: "",
      user_agents: "",
      notes: { default: "" },
    },
    e
  );
  var f = checkUAMatch(e.user_agents)
    ? '<span class="badge badge-success">Match</span>'
    : '<span class="badge badge-danger">Mismatch</span>';
  (b = getCookie("language")),
    "string" != typeof b &&
      (setCookie("language", "default", 36500), (b = "default")),
    (d = "string" == typeof e.notes[b] ? e.notes[b] : e.notes["default"]),
    (c =
      '<div class="row"><div class="col-sm-3">Device:</div><div class="col-sm-9">'.concat(
        e.device,
        "</div></div>"
      )),
    (c +=
      '<div class="row"><div class="col-sm-3">Firmware:</div><div class="col-sm-9">'.concat(
        e.firmware,
        "</div></div>"
      )),
    (c +=
      '<div class="row"><div class="col-sm-3">UA Match?:</div><div class="col-sm-9">'.concat(
        f,
        "</div></div>"
      )),
    (c +=
      '<div class="row"><div class="col-sm-3">Notes:</div><div class="col-sm-9">'.concat(
        d,
        "</div></div>"
      )),
    $("#meta-modal-title").html(e.title),
    $("#meta-modal-body").html(c),
    window.Failsafe ||
      (window.location.hash
        ? window.history.pushState(
            { location: window.history.state.location, modal: !0 },
            null,
            "#".concat(window.history.state.location)
          )
        : window.history.pushState(
            { location: window.history.state.location, modal: !0 },
            null,
            " "
          ),
      $("#meta-modal").on("hide.bs.modal", function () {
        "" === window.history.state.location
          ? displayHome()
          : displayCategory(window.history.state.location);
      })),
    $("#meta-modal").modal("show");
}
function isValidDate(a) {
  var b = Number.isNaN,
    c = new Date(a);
  return b ? c instanceof Date && !b(+c) : c instanceof Date && !isNaN(+c);
}
function entryMeta(a, b) {
  var c,
    d,
    e,
    f,
    g = '<span class="badge badge-warning">Not Cached</span>',
    h = window.Menu[a].entries[b],
    i = JSON.parse(getStorage("cache-status"));
  return (
    i || (i = {}),
    "undefined" == typeof h
      ? void myAlert("danger", "Unable to retrieve metadata")
      : void ($.extend(
          !0,
          {
            title: "",
            version: "",
            updated: "",
            device: "",
            firmware: "",
            description: { default: "" },
            author: "",
            url: "",
          },
          h
        ),
        h.updated && isValidDate(h.updated)
          ? ((c = new Date(h.updated).toLocaleString()),
            a in i &&
              b in i[a] &&
              (new Date(c) <= new Date(i[a][b])
                ? (g = '<span class="badge badge-success">Up to Date</span>')
                : (g = '<span class="badge badge-danger">Out of Date</span>')))
          : ((c = "Invalid Date"),
            a in i &&
              b in i[a] &&
              !isValidDate(new Date(c)) &&
              (g = '<span class="badge badge-warning">Unknown</span>')),
        (d = getCookie("language")),
        "string" != typeof d &&
          (setCookie("language", "default", 36500), (d = "default")),
        (e =
          "string" == typeof h.description[d]
            ? h.description[d]
            : h.description["default"]),
        (f =
          '<div class="row"><div class="col-sm-3">Version:</div><div class="col-sm-9">'.concat(
            h.version,
            "</div></div>"
          )),
        (f +=
          '<div class="row"><div class="col-sm-3">Updated:</div><div class="col-sm-9">'.concat(
            c,
            "</div></div>"
          )),
        (f +=
          '<div class="row"><div class="col-sm-3">Cache:</div><div class="col-sm-9">'.concat(
            g,
            "</div></div>"
          )),
        (f +=
          '<div class="row"><div class="col-sm-3">Device:</div><div class="col-sm-9">'.concat(
            h.device,
            "</div></div>"
          )),
        (f +=
          '<div class="row"><div class="col-sm-3">Firmware:</div><div class="col-sm-9">'.concat(
            h.firmware,
            "</div></div>"
          )),
        (f +=
          '<div class="row"><div class="col-sm-3">Description:</div><div class="col-sm-9">'.concat(
            e,
            "</div></div>"
          )),
        (f +=
          '<div class="row"><div class="col-sm-3">Author(s):</div><div class="col-sm-9">'.concat(
            h.author,
            "</div></div>"
          )),
        (f +=
          '<div class="row"><div class="col-sm-3">URL:</div><div class="col-sm-9"><a href="'
            .concat(h.url, '">')
            .concat(h.url, "</a></div></div>")),
        $("#meta-modal-title").html(h.title),
        $("#meta-modal-body").html(f),
        !window.Failsafe &&
          (window.location.hash
            ? window.history.pushState(
                { location: window.history.state.location, modal: !0 },
                null,
                "#".concat(window.history.state.location)
              )
            : window.history.pushState(
                { location: window.history.state.location, modal: !0 },
                null,
                " "
              ),
          $("#meta-modal").on("hide.bs.modal", function () {
            "" === window.history.state.location
              ? displayHome()
              : displayCategory(window.history.state.location);
          })),
        $("#meta-modal").modal("show"))
  );
}
function settingsModal() {
  getSettingsAsync(function (a) {
    if (a) {
      var b = getCookie("language"),
        c = getCookie("theme");
      try {
        var h = Object.keys(a.languages);
        $("#language-selection").html("");
        for (var j = 0; j < h.length; j += 1)
          $("#language-selection").append(
            '<option value="'
              .concat(a.languages[h[j]], '">')
              .concat(h[j], "</option>")
          );
        $("#language-selection option[value='".concat(b, "']")).attr(
          "selected",
          !0
        );
      } catch (a) {}
      $("#theme-selection").html("");
      for (var i = 0; i < a.themes.length; i += 1)
        $("#theme-selection").append(
          '<option value="'
            .concat(a.themes[i], '">')
            .concat(a.themes[i], "</option>")
        );
      try {
        $("#theme-selection option[value='".concat(c, "']")).attr(
          "selected",
          !0
        );
      } catch (a) {}
    }
    navigator.onLine
      ? $("#custom-theme-options").show()
      : $("#custom-theme-options").hide();
    var d = getStorage("background-image-url"),
      e = getStorage("custom-css-url"),
      f = getStorage("custom-js-url");
    d && $("#background-image-url").val(d),
      e && $("#custom-css-url").val(e),
      f && $("#custom-js-url").val(f),
      $("#submit-language").on("click", function () {
        setCookie("language", $("#language-selection").val(), 36500);
      }),
      $("#submit-theme").on("click", function () {
        getCookie("theme") !== $("#theme-selection").val() &&
          (setCookie("theme", $("#theme-selection").val(), 36500),
          window.location.reload());
      });
    var g = /^https?:\/\/.+\..+/i;
    $("#submit-background-image").on("click", function () {
      "" === $("#background-image-url").val()
        ? ($("body").css("background-image", ""),
          deleteStorage("background-image-url"),
          deleteStorage("background-image"))
        : $("#background-image-url").val().match(g) &&
          imageToBackground(
            $("#background-image-url").val(),
            function (a) {
              setStorage(
                "background-image-url",
                $("#background-image-url").val(),
                "string"
              ),
                setStorage("background-image", a, "string"),
                $("body").css("background-image", "url('".concat(a, "')"));
            },
            !1
          );
    }),
      $("#submit-css").on("click", function () {
        $("style").remove(),
          "" === $("#custom-css-url").val()
            ? (deleteStorage("custom-css-url"), deleteStorage("custom-css"))
            : $("#custom-css-url").val().match(g) &&
              getDataAsync(
                $("#custom-css-url").val(),
                function (a) {
                  setStorage("custom-css", a, "string"),
                    setStorage(
                      "custom-css-url",
                      $("#custom-css-url").val(),
                      "string"
                    ),
                    $("head").append("<style>".concat(a, "</style>"));
                },
                !0
              );
      }),
      $("#submit-js").on("click", function () {
        "" === $("#custom-js-url").val()
          ? (deleteStorage("custom-js-url"),
            deleteStorage("custom-js"),
            window.location.reload())
          : $("#custom-js-url").val().match(g) &&
            getDataAsync(
              $("#custom-js-url").val(),
              function (a) {
                setStorage("custom-js", a, "string"),
                  setStorage(
                    "custom-js-url",
                    $("#custom-js-url").val(),
                    "string"
                  ),
                  window.location.reload();
              },
              !0
            );
      }),
      $("#reload-page").on("click", function () {
        window.location.reload();
      }),
      $("#reset-defaults").on("click", function () {
        deleteStorage("background-image-url"),
          deleteStorage("background-image"),
          deleteStorage("custom-css-url"),
          deleteStorage("custom-css"),
          deleteStorage("custom-js-url"),
          deleteStorage("custom-js"),
          window.location.reload();
      }),
      window.Failsafe ||
        (window.location.hash
          ? window.history.pushState(
              { location: window.history.state.location, modal: !0 },
              null,
              "#".concat(window.history.state.location)
            )
          : window.history.pushState(
              { location: window.history.state.location, modal: !0 },
              null,
              " "
            ),
        $("#settings-modal").on("hide.bs.modal", function () {
          "" === window.history.state.location
            ? displayHome()
            : displayCategory(window.history.state.location);
        })),
      $("#settings-modal").modal("show");
  });
}
function urlModal() {
  $("#submit-url-redirect").on("click", function () {
    window.location.href = $("#url-redirect").val();
  }),
    window.Failsafe ||
      (window.location.hash
        ? window.history.pushState(
            { location: window.history.state.location, modal: !0 },
            null,
            "#".concat(window.history.state.location)
          )
        : window.history.pushState(
            { location: window.history.state.location, modal: !0 },
            null,
            " "
          ),
      $("#url-modal").on("hide.bs.modal", function () {
        "" === window.history.state.location
          ? displayHome()
          : displayCategory(window.history.state.location);
      })),
    $("#url-modal").modal("show");
}
function randomBackground() {
  var a = [
    'url("'.concat(getBasePath(), '/themes/Default/images/0.png")'),
    'url("'.concat(getBasePath(), '/themes/Default/images/1.png")'),
  ];
  $("body").css("background-image", a[Math.floor(Math.random() * a.length)]);
}
function buildAfterCaching() {
  getMenuAsync(function (a) {
    if (void 0 !== a) {
      if (
        ((window.Menu = a), navigator.onLine && newsAlert(), !navigator.onLine)
      ) {
        var b = JSON.parse(getStorage("cache-status"));
        $.each(window.Menu, function (a, c) {
          $.each(c.entries, function (c, d) {
            d.offline
              ? (!{}.hasOwnProperty.call(b, a) ||
                  !{}.hasOwnProperty.call(b[a], c)) &&
                delete window.Menu[a].entries[c]
              : delete window.Menu[a].entries[c];
          }),
            $.isEmptyObject(window.Menu[a].entries) && delete window.Menu[a];
        });
      }
      triggerAutoload(),
        buildHTML(),
        window.location.hash
          ? decodeURIComponent(window.location.hash.substr(1)) in window.Menu
            ? displayCategory(
                decodeURIComponent(window.location.hash.substr(1))
              )
            : displayHome()
          : 1 === Object.keys(window.Menu).length
          ? displayCategory(Object.keys(window.Menu)[0])
          : displayHome(),
        $(window).on("keyup", function (a) {
          27 === a.keyCode &&
            (clearFrame(),
            clearOverlays(),
            $(".modal").is(":visible")
              ? $(".modal").modal("hide")
              : displayHome()),
            118 === a.keyCode &&
              ($(".modal").modal("hide"),
              $("#settings-modal").is(":visible")
                ? $("#url-modal").modal("show")
                : $("#settings-modal").modal("show"));
        }),
        $(".category-button").on("click", function (a) {
          displayCategory($(a.target).data("category"));
        }),
        $(".entry-button").on("click", function (a) {
          if (
            window.Menu[$(a.target).data("category")].entries[
              $(a.target).data("entry")
            ].params
          ) {
            var b = window.Menu[$(a.target).data("category")].entries[
              $(a.target).data("entry")
            ].params.replace(
              /{{EXPLOIT_LOCATION}}/g,
              ""
                .concat(getBasePath(), "/exploits/")
                .concat($(a.target).data("category"), "/")
                .concat($(a.target).data("entry"), "/index.html")
            );
            (b = b.replace(
              /\/\/ {{LOADER}}/g,
              "$('#param-modal').modal('hide');showLoader();"
            )),
              $("#param-modal-title").text($(a.target).data("entry")),
              $("#param-modal-body").html(b),
              $("#param-modal").modal("show");
          } else exploitLoader($(a.target).data("category"), $(a.target).data("entry"));
        }),
        $(".about-button").on("click", function (a) {
          $(a.target).data("entry")
            ? entryMeta($(a.target).data("category"), $(a.target).data("entry"))
            : categoryMeta($(a.target).data("category"));
        }),
        $(".autoload-button").on("click", function (a) {
          startAutoload(
            $(a.target).data("category"),
            $(a.target).data("entry")
          );
        }),
        $(".cache-button").on("click", function (a) {
          $(a.target).data("entry")
            ? cacheEntry(
                $(a.target).data("category"),
                $(a.target).data("entry")
              )
            : cacheCategory($(a.target).data("category"));
        }),
        $(".cache-all-button").on("click", function (a) {
          $(a.target).data("category")
            ? cacheCategory($(a.target).data("category"))
            : cacheAll();
        }),
        $(".refresh-button").on("click", function () {
          window.location.reload(!0);
        }),
        $(".back-button").on("click", function () {
          displayHome();
        }),
        $("#settings-modal").on("show.bs.modal", settingsModal),
        $("#url-modal").on("show.bs.modal", urlModal);
    } else {
      $(document).prop("title", "Menu Error | parknJBHost"),
        $("#title").text("Menu Error"),
        $("#header").text("");
      var c = '<div class="col-sm-9 col-md-9 col-lg-9">';
      (c += '<div class="btn-group">'),
        (c +=
          '<button class="btn btn-primary btn-custom-main btn-custom-full" aria-label="Unable to Retrieve Menu">Unable to Retrieve Menu</button>'),
        (c += "</div>"),
        (c += '<div class="btn-group">'),
        (c +=
          '<button class="btn btn-primary btn-custom-main btn-custom-full refresh-button" aria-label="Refresh">Refresh</button>'),
        (c += "</div>"),
        (c += "</div>"),
        $("#buttons").html(c);
    }
  });
}
function cacheInterface(a) {
  var b, c, d;
  if ("ondownloading" === a) $("#bar-text").html("Caching..."), showCaching();
  else if ("ondownloading-theme" === a)
    $("#bar-text").html("Caching Theme..."), showCaching();
  else {
    var e = $("#ifr")[0].contentDocument.URL + "",
      f = /\/cache\/(theme|category|entry|all)\/.*index\.html$/,
      g = /\/cache\/category\/(.*)\/index\.html$/,
      h = /\/cache\/entry\/(.*)\/(.*)\/index\.html$/,
      i = f.exec(e);
    "category" === i[1]
      ? ((b = g.exec(e)), (c = decodeURIComponent(b[1])))
      : "entry" === i[1] &&
        ((b = h.exec(e)),
        (c = decodeURIComponent(b[1])),
        (d = decodeURIComponent(b[2]))),
      clearFrame(),
      $("#ifr").one("load", function () {
        clearOverlays(),
          "oncached" === a
            ? (myAlert("success", "Cached Successfully"),
              addCacheStatus(i[1], c, d),
              triggerAutoload())
            : "onupdateready" === a
            ? (myAlert("success", "Cache updated"),
              addCacheStatus(i[1], c, d),
              triggerAutoload())
            : "onnoupdate" === a
            ? (myAlert("primary", "No update available"),
              addCacheStatus(i[1], c, d),
              triggerAutoload())
            : "onerror" === a
            ? (myAlert("danger", "Error caching resources"),
              removeCacheStatus(i[1], c, d),
              triggerAutoload())
            : "onobsolete" === a
            ? (myAlert("danger", "Manifest returned a 404, cache was deleted"),
              removeCacheStatus(i[1], c, d),
              triggerAutoload())
            : "oncached-theme" === a || "onnoupdate-theme" === a
            ? buildAfterCaching()
            : "onupdateready-theme" === a
            ? (deleteCookie("newsDate"), window.location.reload(!0))
            : "onerror-theme" === a
            ? (buildAfterCaching(),
              myAlert("danger", "Error caching theme resources"))
            : "onobsolete-theme" === a
            ? (buildAfterCaching(),
              myAlert(
                "danger",
                "Manifest returned a 404, theme cache was deleted"
              ))
            : "onerror-appcache-theme" === a
            ? (buildAfterCaching(),
              myAlert(
                "danger",
                "Browser does not support AppCache, theme was not cached"
              ))
            : "onerror-appcache" == a &&
              (myAlert(
                "danger",
                "Browser does not support AppCache, nothing was cached"
              ),
              removeCacheStatus("all", void 0, void 0),
              triggerAutoload());
      });
  }
}
function cacheProgress(a) {
  $("#bar-load").width("".concat(a, "%")),
    $("#bar-load").html("".concat(a, "%"));
}
$(function () {
  null === window.history.state &&
    (window.history.replaceState(
      {},
      null,
      window.location.hash ? window.location.hash : " "
    ),
    null === window.history.state &&
      "true" !== getCookie("session-warning") &&
      ((document.cookie = "session-warning=true; domain="
        .concat(window.location.hostname, "; path=")
        .concat(window.location.pathname, ";")),
      alert(
        "This session is bugged. The circle button will close the browser rather than going back in the menu. Use the on screen controls."
      ))),
    (window.Failsafe = null === window.history.state);
  var a = getCookie("theme");
  a === void 0
    ? setCookie("theme", "Default", 36500)
    : "Default" !== a && (window.location.search += "".concat(a)),
    randomBackground();
  var b = getStorage("background-image"),
    c = getStorage("custom-css"),
    d = getStorage("custom-js");
  b && $("body").css("background-image", "url(".concat(b, ")")),
    c && $("head").append("<style>".concat(c, "</style>")),
    d && $("head").append("<script>".concat(d, "</script>")),
    $("#ifr").attr("src", "".concat(getBasePath(), "/blank.html")),
    $("#ifr").one("load", function () {
      navigator.onLine ? cacheTheme() : buildAfterCaching();
    });
});
