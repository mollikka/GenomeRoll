function parse_stats(build_json, text_input) {
  var statlist = build_json.build.stats;

  var stat_regex = /([0-9]+[.]?[0-9]*)/g;

  var matches = text_input.match(stat_regex);
  if (matches === null) {
    return null;
  }
  var stat_values = matches.map(parseFloat);

  if (stat_values.length != statlist.length) {
    return null;
  }
  var stats = {};
  for (var i=0; i<statlist.length; i++) {
    stats[statlist[i]] = stat_values[i];
  }
  return stats;
}

function setup_build_input(parsed_json, input_element) {
  var container = document.createElement("div");
  container.class = "input_container";
  var label = document.createTextNode("Build");
  var menu = document.createElement("select");
  container.appendChild(label);
  container.appendChild(menu);
  for (var key in parsed_json.build.modifiers) {
    var newoption = document.createElement("option");
    var text = document.createTextNode(key);
    newoption.value = key;
    newoption.appendChild(text);
    menu.appendChild(newoption);
  }
  input_element.appendChild(container);
  return menu;
}

function calculate_pup_stats(parsed_json, dad_stats, mom_stats, kid_build) {
  var stats = {};
  for (var i=0; i<parsed_json.build.stats.length; i++) {
    var key = parsed_json.build.stats[i];
    stats[key] = (dad_stats[key] + mom_stats[key])/parsed_json.build.modifiers[kid_build];
  }
  return stats;
}

function get_pup_build_choices(parsed_json, dad_build, mom_build) {
  if (dad_build + mom_build in parsed_json.build.inheritance) {
    return parsed_json.build.inheritance[dad_build + mom_build];
  } else if (mom_build + dad_build in parsed_json.build.inheritance) {
    return parsed_json.build.inheritance[mom_build + dad_build];
  } else {
    return null;
  }
}
function display_stats(parsed_json, output_list, stats) {
  output_list.innerHTML = "";
  if (stats === null) {
    return;
  }
  var statlist = parsed_json.build.stats;

  for (var i=0; i<statlist.length; i++) {
    var newstat = document.createElement("li");
    var text = document.createTextNode(statlist[i]+" "+stats[statlist[i]]);
    newstat.appendChild(text);
    output_list.appendChild(newstat);
  }
}
