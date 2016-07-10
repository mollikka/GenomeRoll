function setup_traitform(parsed_json, input_elem, is_male) {

  var input_list = document.createElement("ul");
  input_elem.appendChild(input_list);
  var traits = parsed_json.traits;

  for (var key in traits) {
    var trait = traits[key];
    //ignore trait that this gender cannot have
    if (is_male && !trait.male) continue;
    if (!is_male && !trait.female) continue;
    //ignore trait that is not inheritable
    if (trait.inherit === 0) continue;

    var q = document.createElement("li");
    var inp = document.createElement("input");
    var label = document.createTextNode(key);
    inp.type = "checkbox";
    inp.value = key;
    q.appendChild(inp);
    q.appendChild(label);
    input_list.appendChild(q);
  }
  return input_list;
}

function calculate_pup_traits(parsed_json, dad_traits, mom_traits, is_male) {
  var traitdata = parsed_json.traits;
  var traits = {};

  for (var key in traitdata) {
    var trait = traitdata[key];
    //traits of wrong gender have zero chance of happening
    if (((!is_male) && (!trait.female)) || (is_male && (!trait.male))) {
      traits[key] = 0;
      continue;
    }
    //calculate chance if both parents have the trait
    else if (dad_traits.indexOf(key)>-1 && mom_traits.indexOf(key)>-1) {
      traits[key] = (1-(1-trait.mutate)*(1-trait.inherit)*(1-trait.inherit));
      continue;
    }
    //calculate chance if one parents has the trait
    else if (dad_traits.indexOf(key)>-1 || mom_traits.indexOf(key)>-1) {
      traits[key] = (1-(1-trait.mutate)*(1-trait.inherit));
    }
    else {
      traits[key] = trait.mutate;
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
    mom_traits.push(mom_traits_fields[i].value);
  }
  return [dad_traits, mom_traits];
}
