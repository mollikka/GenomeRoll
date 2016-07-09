function setup_traitform(parsed_json, input_elem, is_male) {

  var traits = parsed_json;
  input_elem.innerHTML = "";

  for (var key in traits) {
    var q = document.createElement("li");
    var inp = document.createElement("input");
    var label = document.createTextNode(key);
    inp.type = "checkbox";
    inp.value = key;
    if (is_male) inp.disabled = !traits[key].male;
    else inp.disabled = !traits[key].female;
    q.appendChild(inp);
    q.appendChild(label);
    input_elem.appendChild(q);
  }
}

function calculate_pup_traits(parsed_json, dad_traits, mom_traits, is_male) {
  var traitdata = parsed_json;
  var traits = {};

  for (var i=0; i<dad_traits.length; i++) {
    //ignore dad's trait if I'm a girl and he's not offering a girly trait
    if ((!is_male) && (!traitdata[dad_traits[i]].female)) continue;
    traits[dad_traits[i]] = traitdata[dad_traits[i]].inherit;
  }

  for (var i=0; i<mom_traits.length; i++) {
    //ignore mom's trait if I'm a boy and she's not offering a boyish trait
    if ((is_male) && (!traitdata[mom_traits[i]].male)) continue;
    if (mom_traits[i] in traits) {
      var chance_dad = traits[mom_traits[i]];
      var chance_mom = traitdata[mom_traits[i]].inherit;
      traits[mom_traits[i]] = 1-(1-chance_dad)*(1-chance_mom);
    } else {
      traits[mom_traits[i]] = traitdata[mom_traits[i]].inherit;
    }
  }
  return traits;
}
function display_pup_traits(list_element, pup_traits) {
  list_element.innerHTML = "";
  for (var key in pup_traits) {
    trait_li = document.createElement("li");
    label = document.createTextNode(key + " " + pup_traits[key]);
    trait_li.appendChild(label);
    list_element.appendChild(trait_li);
  }
}

function get_input_traits (){
  var dad_traits = [];
  var dad_traits_fields = papa_traits_input.getElementsByTagName('input');

  for (var i=0; i<dad_traits_fields.length; i++) {
    if (!dad_traits_fields[i].checked) {continue;}
    dad_traits.push(dad_traits_fields[i].value);
  }

  var mom_traits = [];
  var mom_traits_fields = mama_traits_input.getElementsByTagName('input');

  for (var i=0; i<mom_traits_fields.length; i++) {
    if (!mom_traits_fields[i].checked) {continue;}
    mom_traits.push(dad_traits_fields[i].value);
  }
  return [dad_traits, mom_traits];
}
