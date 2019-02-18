"use strict";function myAlert(a,b,c){var d,e="alert-".concat(uuid()),f="<div class=\"alert alert-".concat(a," alert-dismissible fade collapse\" id=\"").concat(e,"\" role=\"alert\">");d=void 0===c?3e3:c,f+=b,f+="<button type=\"button\" class=\"close\" data-dismiss=\"alert\">",f+="<span>&times;</span>",f+="</button>",f+="</div>",$("#alertBox").append(f),$("#".concat(e)).collapse("show"),0!==d&&sleep(d).then(function(){$("#".concat(e)).alert("close")})}function newsAlert(){getJsonAsync("/news",function(a){if(a){var b=a,c=getCookie("newsDate");b!==void 0&&(c===void 0||b.Date>c)&&b.Message!==void 0&&b.Severity!==void 0&&(autoloadCookie(window.Menu)?(alert(b.Message),setCookie("newsDate",b.Date)):(myAlert("".concat(b.Severity," alert-news"),b.Message,0),$(".alert-news [data-dismiss=\"alert\"]").on("click",function(){setCookie("newsDate",b.Date)})))}})}function buildHTML(){var a="",b=0;return"error"in window.Menu&&!0===window.Menu.error&&"message"in window.Menu?(a+="<div class=\"btn-group\">",a+="<button class=\"btn btn-primary btn-custom-main btn-custom-full\">".concat(window.Menu.message,"</button>"),a+="</div>",void $("#buttons").html(a)):void(window.Menu!==void 0&&(a+="<div id=\"category-buttons\">",$.each(window.Menu,function(c,d){a+="<div class=\"btn-group\">",a+="<button class=\"btn btn-primary btn-custom-main category-button\" data-category=\"".concat(d.title,"\">").concat(d.title,"</button>"),a+="<button type=\"button\" class=\"btn btn-primary btn-custom-dropdown dropdown-toggle dropdown-toggle-split\" data-toggle=\"dropdown\"></button>",a+="<div class=\"dropdown-menu\">",a+="<a class=\"dropdown-item about-button\" href=\"javascript:void(0)\" data-category=\"".concat(d.title,"\">About</a>"),navigator.onLine&&d.offline&&(a+="<div class=\"dropdown-divider\"></div>",a+="<a class=\"dropdown-item cache-button\" href=\"javascript:void(0)\" data-category=\"".concat(d.title,"\">Cache</a>")),a+="</div>",a+="</div>",b+=1,0==b%3&&(a+="<br>")}),navigator.onLine&&(a+="<div class=\"btn-group\">",a+="<button class=\"btn btn-primary btn-custom-main btn-custom-full cache-all-button\">[Cache All]</button>",a+="</div>"),a+="</div>",b=0,$.each(window.Menu,function(c,d){a+="<div class=\"category-page\" data-category=\"".concat(d.title,"\">"),"error"in d.entries&&!0===d.entries.error&&"message"in d.entries?(a+="<div class=\"btn-group\">",a+="<button class=\"btn btn-primary btn-custom-main btn-custom-full\">".concat(d.entries.message,"</button>"),a+="</div>"):($.each(d.entries,function(c,e){a+="<div class=\"btn-group\">",a+="<button class=\"btn btn-primary btn-custom-main entry-button\" data-category=\"".concat(d.title,"\" data-entry=\"").concat(e.title,"\">").concat(e.title,"</button>"),a+="<button type=\"button\" class=\"btn btn-primary btn-custom-dropdown dropdown-toggle dropdown-toggle-split\" data-toggle=\"dropdown\"></button>",a+="<div class=\"dropdown-menu\">",a+="<a class=\"dropdown-item about-button\" href=\"javascript:void(0)\" data-category=\"".concat(d.title,"\" data-entry=\"").concat(e.title,"\">About</a>"),a+="<a class=\"dropdown-item autoload-button\" href=\"javascript:void(0)\" data-category=\"".concat(d.title,"\" data-entry=\"").concat(e.title,"\">Autoload</a>"),navigator.onLine&&d.offline&&(a+="<div class=\"dropdown-divider\"></div>",a+="<a class=\"dropdown-item cache-button\" href=\"javascript:void(0)\" data-category=\"".concat(d.title,"\" data-entry=\"").concat(e.title,"\">Cache</a>")),a+="</div>",a+="</div>",b+=1,0==b%3&&(a+="<br>")}),navigator.onLine&&d.offline&&(a+="<div class=\"btn-group\">",a+="<button class=\"btn btn-primary btn-custom-main btn-custom-full cache-all-button\" data-category=\"".concat(d.title,"\">[Cache All]</button>"),a+="</div>"),a+="</div>",b=0)})),$("#buttons").html(a))}function clearOverlays(){$("#cacheOverlay").hide(),$("#barText").hide(),$("#barBack").hide(),$("#barLoad").hide(),$("#barLoad").html(""),$("#barLoad").width("0%"),$("#exploitOverlay").hide(),$("#exploitMessage").hide(),$("#exploitMessage").html(""),$("#exploitLoader").hide()}function showCaching(){$("#cacheOverlay").show(),$("#barText").show(),$("#barBack").show(),$("#barLoad").show()}function showLoader(){$("#exploitOverlay").show(),$("#exploitLoader").show(),$("#exploitMessage").show()}function exploitDone(a){$("#exploitLoader").hide(),$("#exploitMessage").html(a);var b=$("#ifr")[0].contentDocument.URL.replace("".concat(document.location.origin,"/exploits/"),"").replace("/index.html",""),c=decodeURIComponent(b.split("/")[0]),d=decodeURIComponent(b.split("/")[1]);!0===window.Menu[c].entries[d].reload&&sleep(3e3).then(function(){clearFrame(),clearOverlays()})}function displayHome(){$(document).prop("title","Category Selection | Exploit Host by Al Azif"),window.history.replaceState("",document.title,"".concat(window.location.pathname).concat(window.location.search)),$("#title").text("Category Selection"),$("#header").text("Categories"),$(".category-page").hide(),$("#category-buttons").show()}function displayCategory(a){$(document).prop("title","Exploit Selection | Exploit Host by Al Azif"),window.history.pushState(null,null,"#".concat(a)),$("#title").text("Exploit Selection"),$("#header").text(a),$("#category-buttons").hide(),$(".category-page").hide(),$(".category-page").each(function(b,c){$(c).data("category")+""===a+""&&$(c).show()})}function cacheInterface(a){"ondownloading"===a?($("#barText").html("Caching..."),showCaching()):"ondownloading-redirect"===a?($("#barText").html("Caching Redirect..."),showCaching()):"ondownloading-theme"===a?($("#barText").html("Caching Theme..."),showCaching()):(clearFrame(),clearOverlays(),window.cacheLock=!1,window.autoloadLock=!1,"oncached"===a?myAlert("success","Cached Successfully"):"onupdateready"===a?myAlert("success","Cache updated"):"onnoupdate"===a?myAlert("primary","No update available"):"onerror"===a?myAlert("danger","Error caching resources"):"onobsolete"===a?myAlert("danger","Manifest returned a 404, cache was deleted"):"oncached-theme"==a||"onnoupdate-theme"==a||("onupdateready-theme"===a?(setCookie("newsDate",0),window.location.reload(!0)):"onerror-theme"===a?myAlert("danger","Error caching theme resources"):"onobsolete-theme"==a&&myAlert("danger","Manifest returned a 404, theme cache was deleted")))}function cacheProgress(a){$("#barLoad").width("".concat(a,"%")),$("#barLoad").html("".concat(a,"%"))}function myLoader(a,b){showLoader(),loadEntry(a,b,window.Menu[a].entries[b].redirect)}function myAutoload(a,b){setAutoload(a,b),navigator.onLine&&window.Menu[a].offline&&window.Menu[a].entries[b].offline?(cacheEntry(a,b),window.autoloadLock=!0):myLoader(a,b)}function myCategoryMeta(a){var b,c,d,e,f,g,h="<span class=\"badge badge-danger\">Mismatch</span>",i=window.Menu[a];return void 0===i?void myAlert("danger","Unable to retrieve metadata"):void(i.title!==void 0&&(b=i.title),i.device!==void 0&&(c=i.device),i.firmware!==void 0&&(d=i.firmware),checkUAMatch(i.user_agents)&&(h="<span class=\"badge badge-success\">Match</span>"),e=getCookie("language"),e===void 0&&(setCookie("language","default"),e="default"),f=i.notes[e],f===void 0&&(f=i.notes.default),f===void 0&&(f=""),g="<div class=\"row\"><div class=\"col-sm-3\">Device:</div><div class=\"col-sm-9\">".concat(c,"</div></div>"),g+="<div class=\"row\"><div class=\"col-sm-3\">Firmware:</div><div class=\"col-sm-9\">".concat(d,"</div></div>"),g+="<div class=\"row\"><div class=\"col-sm-3\">UA Match?:</div><div class=\"col-sm-9\">".concat(h,"</div></div>"),g+="<div class=\"row\"><div class=\"col-sm-3\">Notes:</div><div class=\"col-sm-9\">".concat(f,"</div></div>"),$("#metaModalTitle").html(b),$("#metaModalBody").html(g),$("#metaModal").modal("show"))}function myEntryMeta(a,b){var c,d,e,f,g="",h="",i="",j="",k="",l="",m=window.Menu[a].entries[b];return void 0===m?void myAlert("danger","Unable to retrieve metadata"):void(m.title!==void 0&&(g=m.title),m.version!==void 0&&(h=m.version),m.updated!==void 0&&(i=m.updated),m.device!==void 0&&(j=m.device),m.firmware!==void 0&&(k=m.firmware),c=getCookie("language"),c===void 0&&(setCookie("language","default"),c="default"),d=m.description[c],d===void 0&&(d=m.description.default),d===void 0&&(d=""),m.author!==void 0&&(l=m.author),m.url!==void 0&&(e=m.url),f="<div class=\"row\"><div class=\"col-sm-3\">Version:</div><div class=\"col-sm-9\">".concat(h,"</div></div>"),f+="<div class=\"row\"><div class=\"col-sm-3\">Updated:</div><div class=\"col-sm-9\">".concat(i,"</div></div>"),f+="<div class=\"row\"><div class=\"col-sm-3\">Device:</div><div class=\"col-sm-9\">".concat(j,"</div></div>"),f+="<div class=\"row\"><div class=\"col-sm-3\">Firmware:</div><div class=\"col-sm-9\">".concat(k,"</div></div>"),f+="<div class=\"row\"><div class=\"col-sm-3\">Description:</div><div class=\"col-sm-9\">".concat(d,"</div></div>"),f+="<div class=\"row\"><div class=\"col-sm-3\">Author(s):</div><div class=\"col-sm-9\">".concat(l,"</div></div>"),f+="<div class=\"row\"><div class=\"col-sm-3\">URL:</div><div class=\"col-sm-9\"><a href=\"".concat(e,"\">").concat(e,"</a></div></div>"),$("#metaModalTitle").html(g),$("#metaModalBody").html(f),$("#metaModal").modal("show"))}function settingsModal(){getSettingsAsync(function(a){var b="";if(a||!("error"in a)){b+="<label class=\"small\">Language:</label>",b+="<div class=\"input-group w-100 mb-1\">",b+="<select class=\"custom-select\" id=\"language-selection\">";for(var c=Object.keys(a.languages),d=0;d<c.length;d+=1)b+="<option value=\"".concat(a.languages[c[d]],"\">").concat(c[d],"</option>");if(b+="</select>",b+="<div class=\"input-group-append\">",b+="<button type=\"button\" class=\"btn btn-outline-secondary\" id=\"submit-language\">Submit</button>",b+="</div>",b+="</div>",navigator.onLine){b+="<label class=\"small\">Theme:</label>",b+="<div class=\"input-group w-100 mb-3\">",b+="<select class=\"custom-select\" id=\"theme-selection\">";for(var k=0;k<a.themes.length;k+=1)b+="<option value=\"".concat(a.themes[k],"\">").concat(a.themes[k],"</option>");b+="</select>",b+="<div class=\"input-group-append\">",b+="<button type=\"button\" class=\"btn btn-outline-secondary\" id=\"submit-theme\">Submit</button>",b+="</div>",b+="</div>"}b+="<hr>"}navigator.onLine&&(b+="<label class=\"small\">Custom Background Image URL:</label>",b+="<div class=\"input-group w-100 mb-1\">",b+="<input type=\"text\" class=\"form-control\" id=\"background-image-url\" placeholder=\"Custom Background Image URL\">",b+="<div class=\"input-group-append\">",b+="<button type=\"button\" class=\"btn btn-outline-secondary\" id=\"submit-background-image\">Submit</button>",b+="</div>",b+="</div>",b+="<label class=\"small\">Custom CSS URL:</label>",b+="<div class=\"input-group w-100 mb-1\">",b+="<input type=\"text\" class=\"form-control\" id=\"custom-css-url\" placeholder=\"Custom CSS URL\">",b+="<div class=\"input-group-append\">",b+="<button type=\"button\" class=\"btn btn-outline-secondary\" id=\"submit-css\">Submit</button>",b+="</div>",b+="</div>",b+="<label class=\"small\">Custom JS URL:</label>",b+="<div class=\"input-group w-100 mb-3\">",b+="<input type=\"text\" class=\"form-control\" id=\"custom-js-url\" placeholder=\"Custom JS URL\">",b+="<div class=\"input-group-append\">",b+="<button type=\"button\" class=\"btn btn-outline-secondary\" id=\"submit-js\">Submit</button>",b+="</div>",b+="</div>"),b+="<div class=\"w-100 text-right\">",b+="<button type=\"button\" class=\"btn btn-outline-danger mr-2\" id=\"reset-defaults\">Reset Defaults</button>",b+="<button type=\"button\" class=\"btn btn-outline-success\" id=\"reload-page\">Reload Page</button>",b+="</div>",$("#metaModalTitle").html("Settings"),$("#metaModalBody").html(b);var e=getCookie("language"),f=getCookie("theme");try{$("#language-selection option[value='".concat(e,"']")).attr("selected",!0),$("#theme-selection option[value='".concat(f,"']")).attr("selected",!0)}catch(a){}var g=getStorage("background-image-url"),h=getStorage("custom-css-url"),j=getStorage("custom-js-url");g&&$("#background-image-url").val(g),h&&$("#custom-css-url").val(h),j&&$("#custom-js-url").val(j),$("#metaModal").modal("show"),$("#submit-language").on("click",function(){setCookie("language",$("#language-selection").val())}),$("#submit-theme").on("click",function(){getCookie("theme")!==$("#theme-selection").val()&&(setCookie("theme",$("#theme-selection").val()),window.location.reload())}),$("#submit-background-image").on("click",function(){""===$("#background-image-url").val()?($("body").css("background-image",""),deleteStorage("background-image-url"),deleteStorage("background-image")):imageToBackground($("#background-image-url").val(),function(a){setStorage("background-image-url",$("#background-image-url").val(),"string"),setStorage("background-image",a,"string"),$("body").css("background-image","url('".concat(a,"')"))},!1)}),$("#submit-css").on("click",function(){$("style").remove(),""===$("#custom-css-url").val()?(deleteStorage("custom-css-url"),deleteStorage("custom-css")):getDataAsync($("#custom-css-url").val(),function(a){setStorage("custom-css",a,"string"),setStorage("custom-css-url",$("#custom-css-url").val(),"string"),$("head").append("<style>".concat(a,"</style>"))},!0)}),$("#submit-js").on("click",function(){""===$("#custom-js-url").val()?(deleteStorage("custom-js-url"),deleteStorage("custom-js")):getDataAsync($("#custom-css-url").val(),function(a){setStorage("custom-js",a,"string"),setStorage("custom-js-url",$("#custom-js-url").val(),"string")},!0),window.location.reload()}),$("#reset-defaults").on("click",function(){setCookie("language",a.languages[a.default_language]),setCookie("theme",a.default_theme),deleteStorage("background-image-url"),deleteStorage("background-image"),deleteStorage("custom-css-url"),deleteStorage("custom-css"),deleteStorage("custom-js-url"),deleteStorage("custom-js"),window.location.reload()}),$("#reload-page").on("click",function(){window.location.reload()})})}$(function(){var a=getStorage("background-image");a&&$("body").css("background-image","url(".concat(a,")"));var b=getStorage("custom-css");b&&$("head").append("<style>".concat(b,"</style>"));var c=getStorage("custom-js");c&&$("head").append("<script>".concat(c,"</script>")),window.cacheLock=!0,$("#ifr").attr("src","/blank.html"),navigator.onLine&&cacheTheme(),getMenuAsync(function(a){if(a!==void 0){window.Menu=a,navigator.onLine&&newsAlert();var d=autoloadCookie(window.Menu);if(d){var b=d.split("/")[0],c=d.split("/")[1];navigator.onLine?myAutoload(b,c):window.Menu[b].offline&&window.Menu[b].entries.offline&&myAlert("danger","Could not autoload, payload is online only (Currently running from cache)")}buildHTML(),window.location.hash?decodeURIComponent(window.location.hash.substr(1))in window.Menu?displayCategory(decodeURIComponent(window.location.hash.substr(1))):displayHome():1===Object.keys(window.Menu).length?displayCategory(Object.keys(window.Menu)[0]):displayHome(),$(window).on("keyup",function(a){27===a.keyCode?(clearFrame(),clearOverlays(),displayHome()):119===a.keyCode&&settingsModal()}),$(".category-button").on("click",function(a){displayCategory($(a.target).data("category"))}),$(".entry-button").on("click",function(a){myLoader($(a.target).data("category"),$(a.target).data("entry"))}),$(".about-button").on("click",function(a){$(a.target).data("entry")?myEntryMeta($(a.target).data("category"),$(a.target).data("entry")):myCategoryMeta($(a.target).data("category"))}),$(".autoload-button").on("click",function(a){myAutoload($(a.target).data("category"),$(a.target).data("entry"))}),$(".cache-button").on("click",function(a){$(a.target).data("entry")?cacheEntry($(a.target).data("category"),$(a.target).data("entry")):cacheCategory($(a.target).data("category"))}),$(".cache-all-button").on("click",function(a){$(a.target).data("category")?cacheCategory($(a.target).data("category")):cacheAll()})}else{$(document).prop("title","Menu Error | Exploit Host by Al Azif"),$("#title").text("Menu Error"),$("#header").text("");var e="<div class=\"btn-group\">";e+="<button class=\"btn btn-primary btn-custom-main btn-custom-full\">Unable to Retrieve Menu</button>",e+="</div>",$("#buttons").html(e)}})});
