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
  container.className = "input_container";
  var label = document.createElement("h3");
  label.innerHTML = "Build";
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

function setup_stats_input(parsed_json, input_element) {
  var container = document.createElement("div");
  container.className = "input_container";
  var label = document.createElement("h3");
  label.innerHTML = "Stats";
  container.appendChild(label);
  var inputfield = document.createElement("input");
  container.appendChild(inputfield);
  input_element.appendChild(container);

  inputfield.oninput = function() {
    if (this.value === "") {
      this.className = "";
    } else if (parse_stats(parsed_json, this.value)===null) {
      this.className = "invalid_input";
    } else {
      this.className = "valid_input";
    }
  };

  return inputfield;
}

function stats_to_str(stats) {
  strs = [];
  for (var key in stats) {
    strs.push(key + ": " + stats[key].toFixed(2));
  }
  return strs.join(", ");
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

function breed_build(parsed_json, dad_build, mom_build) {

  var possible_builds = get_pup_build_choices(parsed_json, dad_build, mom_build);

  return possible_builds[Math.floor(Math.random() * possible_builds.length)];
}
