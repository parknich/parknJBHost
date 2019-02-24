"use strict";function _extends(){return _extends=Object.assign||function(a){for(var b,c=1;c<arguments.length;c++)for(var d in b=arguments[c],b)Object.prototype.hasOwnProperty.call(b,d)&&(a[d]=b[d]);return a},_extends.apply(this,arguments)}function myAlert(a,b,c){var d,e="alert-".concat(uuid()),f="<div class=\"alert alert-".concat(a," alert-dismissible fade collapse\" id=\"").concat(e,"\" role=\"alert\">");d=void 0===c?3e3:c,f+=b,f+="<button type=\"button\" class=\"close\" data-dismiss=\"alert\">",f+="<span>&times;</span>",f+="</button>",f+="</div>",$("#alert-box").append(f),$("#".concat(e)).collapse("show"),0!==d&&sleep(d).then(function(){$("#".concat(e)).alert("close")})}function newsAlert(){getJsonAsync("./news",function(a){if(a){var b=a,c=getCookie("newsDate");b!==void 0&&(c===void 0||b.Date>c)&&b.Message!==void 0&&b.Severity!==void 0&&(autoloadCookie(window.Menu)?(alert(b.Message),setCookie("newsDate",b.Date)):(myAlert("".concat(b.Severity," alert-news"),b.Message,0),$(".alert-news [data-dismiss=\"alert\"]").on("click",function(){setCookie("newsDate",b.Date)})))}})}function buildHTML(){var a="",b=0;return"error"in window.Menu&&!0===window.Menu.error&&"message"in window.Menu?(a+="<div class=\"btn-group\">",a+="<button class=\"btn btn-primary btn-custom-main btn-custom-full\">".concat(window.Menu.message,"</button>"),a+="</div>",void $("#buttons").html(a)):void(window.Menu!==void 0&&(a+="<div id=\"category-buttons\">",$.each(window.Menu,function(c,d){a+="<div class=\"btn-group\">",a+="<button class=\"btn btn-primary btn-custom-main category-button\" data-category=\"".concat(d.title,"\">").concat(d.title,"</button>"),a+="<button type=\"button\" class=\"btn btn-primary btn-custom-dropdown dropdown-toggle dropdown-toggle-split\" data-toggle=\"dropdown\"></button>",a+="<div class=\"dropdown-menu\">",a+="<a class=\"dropdown-item about-button\" href=\"javascript:void(0)\" data-category=\"".concat(d.title,"\">About</a>"),navigator.onLine&&d.offline&&(a+="<div class=\"dropdown-divider\"></div>",a+="<a class=\"dropdown-item cache-button\" href=\"javascript:void(0)\" data-category=\"".concat(d.title,"\">Cache</a>")),a+="</div>",a+="</div>",b+=1,0==b%3&&(a+="<br>")}),navigator.onLine&&(a+="<div class=\"btn-group\">",a+="<button class=\"btn btn-primary btn-custom-main btn-custom-full cache-all-button\">[Cache All]</button>",a+="</div>"),a+="</div>",b=0,$.each(window.Menu,function(c,d){a+="<div class=\"category-page\" data-category=\"".concat(d.title,"\">"),"error"in d.entries&&!0===d.entries.error&&"message"in d.entries?(a+="<div class=\"btn-group\">",a+="<button class=\"btn btn-primary btn-custom-main btn-custom-full\">".concat(d.entries.message,"</button>"),a+="</div>"):($.each(d.entries,function(c,e){a+="<div class=\"btn-group\">",a+="<button class=\"btn btn-primary btn-custom-main entry-button\" data-category=\"".concat(d.title,"\" data-entry=\"").concat(e.title,"\">").concat(e.title,"</button>"),a+="<button type=\"button\" class=\"btn btn-primary btn-custom-dropdown dropdown-toggle dropdown-toggle-split\" data-toggle=\"dropdown\"></button>",a+="<div class=\"dropdown-menu\">",a+="<a class=\"dropdown-item about-button\" href=\"javascript:void(0)\" data-category=\"".concat(d.title,"\" data-entry=\"").concat(e.title,"\">About</a>"),a+="<a class=\"dropdown-item autoload-button\" href=\"javascript:void(0)\" data-category=\"".concat(d.title,"\" data-entry=\"").concat(e.title,"\">Autoload</a>"),navigator.onLine&&d.offline&&(a+="<div class=\"dropdown-divider\"></div>",a+="<a class=\"dropdown-item cache-button\" href=\"javascript:void(0)\" data-category=\"".concat(d.title,"\" data-entry=\"").concat(e.title,"\">Cache</a>")),a+="</div>",a+="</div>",b+=1,0==b%3&&(a+="<br>")}),navigator.onLine&&d.offline&&(a+="<div class=\"btn-group\">",a+="<button class=\"btn btn-primary btn-custom-main btn-custom-full cache-all-button\" data-category=\"".concat(d.title,"\">[Cache All]</button>"),a+="</div>"),a+="</div>",b=0)})),$("#buttons").html(a))}function clearOverlays(){$("#cache-overlay").hide(),$("#bar-text").hide(),$("#bar-back").hide(),$("#bar-load").hide(),$("#bar-load").html(""),$("#bar-load").width("0%"),$("#exploit-overlay").hide(),$("#exploit-message").hide(),$("#exploit-message").html(""),$("#exploit-loader").hide()}function showCaching(){$("#cache-overlay").show(),$("#bar-text").show(),$("#bar-back").show(),$("#bar-load").show()}function showLoader(){$("#exploit-overlay").show(),$("#exploit-loader").show(),$("#exploit-message").show()}function exploitDone(a){$("#exploit-loader").hide(),$("#exploit-message").html(a);var b=/^https?:\/\/.*\/exploits\/(.*)\/(.*)\/index.html$/,c=b.exec($("#ifr")[0].contentDocument.URL),d=decodeURIComponent(c[1]),e=decodeURIComponent(c[2]);!0===window.Menu[d].entries[e].reload&&sleep(3e3).then(function(){clearFrame(),clearOverlays()})}function displayHome(){$(document).prop("title","Category Selection | Exploit Host by Al Azif"),window.history.replaceState({location:"",modal:!1},null," "),$("#title").text("Category Selection"),$("#header").text("Categories"),$(".category-page").hide(),$("#category-buttons").show()}function displayCategory(a){$(document).prop("title","Exploit Selection | Exploit Host by Al Azif"),window.history.pushState({location:a,modal:!1},null,"#".concat(a)),$("#title").text("Exploit Selection"),$("#header").text(a),$("#category-buttons").hide(),$(".category-page").hide(),$(".category-page").each(function(b,c){$(c).data("category")+""===a+""&&$(c).show()})}function cacheInterface(a){"ondownloading"===a?($("#bar-text").html("Caching..."),showCaching()):"ondownloading-theme"===a?($("#bar-text").html("Caching Theme..."),showCaching()):(clearFrame(),clearOverlays(),"oncached"===a?myAlert("success","Cached Successfully"):"onupdateready"===a?myAlert("success","Cache updated"):"onnoupdate"===a?myAlert("primary","No update available"):"onerror"===a?myAlert("danger","Error caching resources"):"onobsolete"===a?myAlert("danger","Manifest returned a 404, cache was deleted"):"oncached-theme"==a||"onnoupdate-theme"==a||("onupdateready-theme"===a?(setCookie("newsDate",0),window.location.reload(!0)):"onerror-theme"===a?myAlert("danger","Error caching theme resources"):"onobsolete-theme"===a?myAlert("danger","Manifest returned a 404, theme cache was deleted"):"onerror-appcache"==a&&myAlert("danger","Browser does not support AppCache, nothing was cached")))}function cacheProgress(a){$("#bar-load").width("".concat(a,"%")),$("#bar-load").html("".concat(a,"%"))}function exploitLoader(a,b){showLoader(),loadEntry(a,b,window.Menu[a].entries[b].redirect)}function myAutoload(a,b){setAutoload(a,b),navigator.onLine&&window.Menu[a].offline&&window.Menu[a].entries[b].offline?cacheEntry(a,b):exploitLoader(a,b)}function categoryMeta(a){var b,c,d,e,f=window.Menu[a];return"undefined"==typeof f?void myAlert("danger","Unable to retrieve metadata"):void(f=_extends({title:"",device:"",firmware:"",user_agents:"",notes:{default:""}},f),b=checkUAMatch(f.user_agents)?"<span class=\"badge badge-success\">Match</span>":"<span class=\"badge badge-danger\">Mismatch</span>",c=getCookie("language"),"string"!=typeof c&&(setCookie("language","default"),c="default"),e="string"==typeof f.notes[c]?f.notes[c]:f.notes.default,d="<div class=\"row\"><div class=\"col-sm-3\">Device:</div><div class=\"col-sm-9\">".concat(f.device,"</div></div>"),d+="<div class=\"row\"><div class=\"col-sm-3\">Firmware:</div><div class=\"col-sm-9\">".concat(f.firmware,"</div></div>"),d+="<div class=\"row\"><div class=\"col-sm-3\">UA Match?:</div><div class=\"col-sm-9\">".concat(b,"</div></div>"),d+="<div class=\"row\"><div class=\"col-sm-3\">Notes:</div><div class=\"col-sm-9\">".concat(e,"</div></div>"),$("#meta-modal-title").html(f.title),$("#meta-modal-body").html(d),window.location.hash?window.history.pushState({location:window.history.state.location,modal:!0},null,"#".concat(window.history.state.location)):window.history.pushState({location:window.history.state.location,modal:!0},null," "),$("#meta-modal").on("hide.bs.modal",function(){""===window.history.state.location?displayHome():displayCategory(window.history.state.location)}),$("#meta-modal").modal("show"))}function entryMeta(a,b){var c,d,e,f=window.Menu[a].entries[b];return"undefined"==typeof f?void myAlert("danger","Unable to retrieve metadata"):void(f=_extends({title:"",version:"",updated:"",device:"",firmware:"",description:{default:""},author:"",url:""},f),f.updated&&(f.updated=new Date(f.updated).toLocaleString()),c=getCookie("language"),"string"!=typeof c&&(setCookie("language","default"),c="default"),d="string"==typeof f.description[c]?f.description[c]:f.description.default,e="<div class=\"row\"><div class=\"col-sm-3\">Version:</div><div class=\"col-sm-9\">".concat(f.version,"</div></div>"),e+="<div class=\"row\"><div class=\"col-sm-3\">Updated:</div><div class=\"col-sm-9\">".concat(f.updated,"</div></div>"),e+="<div class=\"row\"><div class=\"col-sm-3\">Device:</div><div class=\"col-sm-9\">".concat(f.device,"</div></div>"),e+="<div class=\"row\"><div class=\"col-sm-3\">Firmware:</div><div class=\"col-sm-9\">".concat(f.firmware,"</div></div>"),e+="<div class=\"row\"><div class=\"col-sm-3\">Description:</div><div class=\"col-sm-9\">".concat(d,"</div></div>"),e+="<div class=\"row\"><div class=\"col-sm-3\">Author(s):</div><div class=\"col-sm-9\">".concat(f.author,"</div></div>"),e+="<div class=\"row\"><div class=\"col-sm-3\">URL:</div><div class=\"col-sm-9\"><a href=\"".concat(f.url,"\">").concat(f.url,"</a></div></div>"),$("#meta-modal-title").html(f.title),$("#meta-modal-body").html(e),window.location.hash?window.history.pushState({location:window.history.state.location,modal:!0},null,"#".concat(window.history.state.location)):window.history.pushState({location:window.history.state.location,modal:!0},null," "),$("#meta-modal").on("hide.bs.modal",function(){""===window.history.state.location?displayHome():displayCategory(window.history.state.location)}),$("#meta-modal").modal("show"))}function settingsModal(){$("#settings-modal").is(":visible")||($(".modal").modal("hide"),getSettingsAsync(function(a){if(a){var b=getCookie("language"),c=getCookie("theme"),d=Object.keys(a.languages);$("#language-selection").html("");for(var h=0;h<d.length;h+=1)$("#language-selection").append("<option value=\"".concat(a.languages[d[h]],"\">").concat(d[h],"</option>"));try{$("#language-selection option[value='".concat(b,"']")).attr("selected",!0)}catch(a){}$("#theme-selection").html("");for(var i=0;i<a.themes.length;i+=1)$("#theme-selection").append("<option value=\"".concat(a.themes[i],"\">").concat(a.themes[i],"</option>"));try{$("#theme-selection option[value='".concat(c,"']")).attr("selected",!0)}catch(a){}}navigator.onLine?$("#custom-theme-options").show():$("#custom-theme-options").hide();var e=getStorage("background-image-url"),f=getStorage("custom-css-url"),g=getStorage("custom-js-url");e&&$("#background-image-url").val(e),f&&$("#custom-css-url").val(f),g&&$("#custom-js-url").val(g),$("#submit-language").on("click",function(){setCookie("language",$("#language-selection").val())}),$("#submit-theme").on("click",function(){getCookie("theme")!==$("#theme-selection").val()&&(setCookie("theme",$("#theme-selection").val()),window.location.reload())}),$("#submit-background-image").on("click",function(){""===$("#background-image-url").val()?($("body").css("background-image",""),deleteStorage("background-image-url"),deleteStorage("background-image")):imageToBackground($("#background-image-url").val(),function(a){setStorage("background-image-url",$("#background-image-url").val(),"string"),setStorage("background-image",a,"string"),$("body").css("background-image","url('".concat(a,"')"))},!1)}),$("#submit-css").on("click",function(){$("style").remove(),""===$("#custom-css-url").val()?(deleteStorage("custom-css-url"),deleteStorage("custom-css")):getDataAsync($("#custom-css-url").val(),function(a){setStorage("custom-css",a,"string"),setStorage("custom-css-url",$("#custom-css-url").val(),"string"),$("head").append("<style>".concat(a,"</style>"))},!0)}),$("#submit-js").on("click",function(){""===$("#custom-js-url").val()?(deleteStorage("custom-js-url"),deleteStorage("custom-js"),window.location.reload()):getDataAsync($("#custom-js-url").val(),function(a){setStorage("custom-js",a,"string"),setStorage("custom-js-url",$("#custom-js-url").val(),"string"),window.location.reload()},!0)}),$("#reload-page").on("click",function(){window.location.reload()}),$("#reset-defaults").on("click",function(){deleteStorage("background-image-url"),deleteStorage("background-image"),deleteStorage("custom-css-url"),deleteStorage("custom-css"),deleteStorage("custom-js-url"),deleteStorage("custom-js"),window.location.reload()}),window.location.hash?window.history.pushState({location:window.history.state.location,modal:!0},null,"#".concat(window.history.state.location)):window.history.pushState({location:window.history.state.location,modal:!0},null," "),$("#settings-modal").on("hide.bs.modal",function(){""===window.history.state.location?displayHome():displayCategory(window.history.state.location)}),$("#settings-modal").modal("show")}))}function randomBackground(){var a=["url(\"./themes/Default/images/0.png\")","url(\"./themes/Default/images/1.png\")"];$("body").css("background-image",a[Math.floor(Math.random()*a.length)])}$(function(){null===window.history.state&&window.history.replaceState({},null,window.location.hash?window.location.hash:" ");var a=getStorage("background-image"),b=getStorage("custom-css"),c=getStorage("custom-js");a&&$("body").css("background-image","url(".concat(a,")")),b&&$("head").append("<style>".concat(b,"</style>")),c&&$("head").append("<script>".concat(c,"</script>")),$("#ifr").attr("src","./blank.html"),navigator.onLine&&cacheTheme(),getMenuAsync(function(a){if(a!==void 0){window.Menu=a,navigator.onLine&&newsAlert();var d=autoloadCookie(window.Menu);if(d){var b=d.split("/")[0],c=d.split("/")[1];navigator.onLine?myAutoload(b,c):(!window.Menu[b].offline||!window.Menu[b].entries[c].offline)&&myAlert("danger","Could not autoload, payload is online only (Currently running from cache)")}buildHTML(),window.location.hash?decodeURIComponent(window.location.hash.substr(1))in window.Menu?displayCategory(decodeURIComponent(window.location.hash.substr(1))):displayHome():1===Object.keys(window.Menu).length?displayCategory(Object.keys(window.Menu)[0]):displayHome(),$(window).on("keyup",function(a){27===a.keyCode&&(clearFrame(),clearOverlays(),$(".modal").is(":visible")?$(".modal").modal("hide"):displayHome()),118===a.keyCode&&$("#settings-modal").modal("show")}),$(".category-button").on("click",function(a){displayCategory($(a.target).data("category"))}),$(".entry-button").on("click",function(a){exploitLoader($(a.target).data("category"),$(a.target).data("entry"))}),$(".about-button").on("click",function(a){$(a.target).data("entry")?entryMeta($(a.target).data("category"),$(a.target).data("entry")):categoryMeta($(a.target).data("category"))}),$(".autoload-button").on("click",function(a){myAutoload($(a.target).data("category"),$(a.target).data("entry"))}),$(".cache-button").on("click",function(a){$(a.target).data("entry")?cacheEntry($(a.target).data("category"),$(a.target).data("entry")):cacheCategory($(a.target).data("category"))}),$(".cache-all-button").on("click",function(a){$(a.target).data("category")?cacheCategory($(a.target).data("category")):cacheAll()}),$("#settings-modal").on("show.bs.modal",settingsModal)}else{$(document).prop("title","Menu Error | Exploit Host by Al Azif"),$("#title").text("Menu Error"),$("#header").text("");var e="<div class=\"btn-group\">";e+="<button class=\"btn btn-primary btn-custom-main btn-custom-full\">Unable to Retrieve Menu</button>",e+="</div>",$("#buttons").html(e)}})});
