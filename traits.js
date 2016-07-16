function setup_trait_input(parsed_json, input_elem, is_male) {

  var container = document.createElement("div");
  container.className = "input_container";
  var label = document.createElement("h3");
  label.innerHTML = "Traits";
  container.appendChild(label);
  var input_list = document.createElement("ul");
  container.appendChild(input_list);
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
  input_elem.appendChild(container);
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

function breed_traits(parsed_json, dad_traits, mom_traits, is_male) {
  var chances = calculate_pup_traits(parsed_json, dad_traits, mom_traits, is_male);
  var traits = [];
  for (var key in chances) {
    var chance = chances[key];
    if (Math.random() < chance) {
      traits.push(key);
    }
  }
  return traits;
}

function get_traits_from_input (traits_input){
  var traits = [];
  var traits_fields = traits_input.getElementsByTagName('input');

  for (var i=0; i<traits_fields.length; i++) {
    if (!traits_fields[i].checked) {continue;}
    traits.push(traits_fields[i].value);
  }
  return traits;
}
