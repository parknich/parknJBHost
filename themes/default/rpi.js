function rpi_getLastIP() {
  "use strict";
  var name = "last_ip=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var cookies = decodedCookie.split(";");
  var result;
  $.each(cookies, function(i, field) {
    while (field.charAt(0) === " ") {
      field = field.substring(1);
    }
    if (field.indexOf(name) === 0) {
      result = field.substring(name.length, field.length);
    }
  });
  return result;
}

function rpi_validateInput(inputType, value) {
  "use strict";
  var pattern;
  if (inputType === "IP") {
    pattern = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
  } else if (inputType === "URL") {
    pattern = /^http[s]?:\/\/.+/i;
  } else if (inputType === "ContentID") {
    pattern = /^[A-Z]{2}[0-9]{4}\-[A-Z]{4}[0-9]{5}_[0-9]{2}\-[A-Z0-9]{16}$/;
  } else if (inputType === "TitleID") {
    pattern = /^[A-Z]{4}[0-9]{5}$/;
  } else if (inputType === "TaskID") {
    pattern = /^(?:[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[0-9])$/;
  } else {
    return false;
  }
  return pattern.test(value);
}

function rpi_sendCommand(endpoint, command) {
  "use strict";
  var ip = $("#ip").val();
  if (rpi_validateInput("IP", ip)) {
    document.cookie = "last_ip=" + ip + "; expires=Tue, 19 Jan 2038 03:14:07 UTC;";
    $("#sendingOverlay").show();
    return sendJson("/api/remote_pkg", "{\"IP\": \"" + ip + "\", \"Endpoint\": \"" + endpoint + "\", \"Command\": " + command + "}");
  }
  alert("Invalid IP");
}

function rpi_isExists() {
  "use strict";
  var tid = $("#existID").val();
  tid = tid.toUpperCase();
  $("#existID").val(tid);

  if (rpi_validateInput("TitleID", tid)) {
    var response = rpi_sendCommand("is_exists", "{\\\"title_id\\\": \\\"" + tid + "\\\"}");
    $("#responseText").html("<p class=\"text-center\">" + response + "</p>");
    $("#sendingOverlay").hide();
    return;
  }
  alert("Validation Error");
}

function rpi_install(urlType) {
  "use strict";
  if (urlType !== "direct" && urlType !== "ref_pkg_url") {
    alert("Invalid installation type selected");
    return;
  }

  var url = $("#installURL").val();

  if (rpi_validateInput("URL", url)) {
    var response = rpi_sendCommand("install", "{\\\"type\\\": \\\"" + urlType + "\\\", \\\"url\\\": \\\"" + url + "\\\"}");
    $("#responseText").html("<p class=\"text-center\">" + response + "</p>");
    $("#sendingOverlay").hide();
    return;
  }
  alert("Validation Error");
}

function rpi_uninstall() {
  "use strict";
  var endpoint = $("input[name='uninstallRadios']:checked").val();
  var uid = $("#uninstallID").val();
  uid = uid.toUpperCase();
  $("#uninstallID").val(uid);

  var response;
  if (endpoint === "uninstall_game" || endpoint === "uninstall_patch") {
    if (rpi_validateInput("TitleID", uid)) {
      response = rpi_sendCommand(endpoint, "{\\\"title_id\\\": \\\"" + uid + "\\\"}");
      $("#responseText").html("<p class=\"text-center\">" + response + "</p>");
      $("#sendingOverlay").hide();
      return;
    }
  } else if (endpoint === "uninstall_ac" || endpoint === "uninstall_theme") {
    if (rpi_validateInput("ContentID", uid)) {
      response = rpi_sendCommand(endpoint, "{\\\"content_id\\\": \\\"" + uid + "\\\"}");
      $("#responseText").html("<p class=\"text-center\">" + response + "</p>");
      $("#sendingOverlay").hide();
      return;
    }
  }
  alert("Validation Error");
}

function rpi_findTask() {
  "use strict";
  var taskType = $("input[name='taskRadios']:checked").val();
  if (taskType < 6 || taskType > 9) {
    alert("Invalid task type selected");
    return;
  }

  var cid = $("#taskContentID").val();
  cid = cid.toUpperCase();
  $("#taskContentID").val(cid);


  if (rpi_validateInput("ContentID", cid)) {
    var response = rpi_sendCommand("find_task", "{\\\"content_id\\\": \\\"" + cid + "\\\", \\\"sub_type\\\": " + taskType + "}");
    $("#responseText").html("<p class=\"text-center\">" + response + "</p>");
    $("#sendingOverlay").hide();
    return;
  }
  alert("Validation Error");
}

function rpi_task(taskType) {
  "use strict";
  var taskID = $("#taskID").val();

  if (rpi_validateInput("TaskID", taskID)) {
    var response = rpi_sendCommand(taskType, "{\\\"task_id\\\": " + taskID + "}");
    $("#responseText").html("<p class=\"text-center\">" + response + "</p>");
    $("#sendingOverlay").hide();
    return;
  }
  alert("Validation Error");
}

function rpi_make_pkg_button(pkgName, pkgSize) {
  "use strict";
  var truncateLength = 43;
  var pkgURL = "https://" + getServerIP() + "/pkgs/" + encodeURIComponent(pkgName);
  var truncatedName = pkgName.substring(0, truncateLength - 3);
  if (pkgName.length > truncateLength) {
    truncatedName += "...";
  }
  var i = pkgSize === 0 ? 0 : Math.floor(Math.log(pkgSize) / Math.log(1024));
  var formattedSize = (pkgSize / Math.pow(1024, i)).toFixed(2) * 1 + " " + ["B", "kB", "MB", "GB", "TB"][i];
  var output = "<button type=\"button\" class=\"list-group-item list-group-item-action p-0 pb-1 pl-2\" ";
  output += "onclick=\"$('#installURL').val('" + pkgURL + "');\">";
  output += truncatedName + "<span class=\"badge badge-primary ml-1\">" + formattedSize + "</span></button>";

  return output;
}

function rpi_make_pkg_array(pkgJson) {
  "use strict";
  var output = "";

  if (pkgJson !== undefined) {
    $.each(pkgJson, function(i, field) {
      if (field === "No PKGs Found") {
        output = "<p class=\"text-center text-danger\">No PKGs found on host</p>";
      } else if (field === "I/O Error on Host") {
        output = "<p class=\"text-center text-danger\">I/O error on host</p>";
      } else {
        output += rpi_make_pkg_button(field.Filename, field.Filesize);
      }
    });
  }

  if (output === "") {
    output = "<p class=\"text-center text-danger\">Error connecting to host</p>";
  }
  return output;
}

$(function() {
  "use strict";
  if (!navigator.onLine) {
    $("#offlineOverlay").show();
    return;
  }

  var pkgJson = getJson("/api/pkglist");

  $("a[data-toggle='pill']").click(function() {
    $("#header").text($(this).text());
  });

  $("#pkgSearch").keyup(function() {
    var re = new RegExp($("#pkgSearch").val(), "i");
    var searchJson = [];
    $.each(pkgJson, function(i, field) {
      if (re.test(field.Filename)) {
        searchJson.push(field);
      }
    });
    $("#pkg-list").html(rpi_make_pkg_array(searchJson));
  });

  var last_ip = rpi_getLastIP();
  if (last_ip !== undefined) {
    $("#ip").val(last_ip);
  } else {
    $("#ip").val("0.0.0.0");
    document.cookie = "last_ip=0.0.0.0; expires=Tue, 19 Jan 2038 03:14:07 UTC;";
  }

  $("#pkg-list").html(rpi_make_pkg_array(pkgJson));
});
