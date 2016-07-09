function parse_stats(build_json, text_input) {
  var statlist = build_json.stats;

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
  for (var key in parsed_json.modifiers) {
    var newoption = document.createElement("option");
    var text = document.createTextNode(key);
    newoption.value = key;
    newoption.appendChild(text);
    input_element.appendChild(newoption);
  }
}

function display_stats(parsed_json, output_list, stats) {
  output_list.innerHTML = "";
  if (stats === null) {
    return;
  }
  var statlist = parsed_json.stats;

  for (var i=0; i<statlist.length; i++) {
    var newstat = document.createElement("li");
    var text = document.createTextNode(statlist[i]+" "+stats[statlist[i]]);
    newstat.appendChild(text);
    output_list.appendChild(newstat);
  }
}
